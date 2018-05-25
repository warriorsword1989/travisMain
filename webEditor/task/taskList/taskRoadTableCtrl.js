/**
 * 粗编任务列表
 * @file taskRoadTableCtrl.js
 * @author wangmingdong
 * @date   2017-12-20
 *
 * @copyright @Navinfo, all rights reserved.
 */

angular.module('app').controller('taskRoadTableCtrl', ['$scope', 'ngDialog', 'dsManage', 'dsFcc', '$timeout', 'dsColumn', 'appPath', 'dsEdit',
    function ($scope, ngDialog, dsManage, dsFcc, $timeout, dsColumn, appPath, dsEdit) {
        var width = document.documentElement.clientWidth - 240;
        var taskNum = parseInt((width - 15) / 315, 10);
        var taskLength = width - taskNum * 300;
        $scope.taskListMargin = {
            'margin-left': taskLength / (taskNum + 1) + 'px'
        };

        $scope.taskListData = [];
        $scope.currentTipsTypes = 0;
        $scope.currentTipsNum = 0;
        $scope.searchModel = {
            searchText: ''
        };

        /**
         * 获取当前屏幕高度
         * @method getClientHeight
         * @return {undefined}
         */
        var getClientHeight = function () {
            $scope.wHeight = document.documentElement.clientHeight;
        };
        /**
         * 获取表格数据
         * @return {undefined}
         */
        var getData = function () {
            $scope.gridOptions.totalItems = $scope.taskListData.length;
            $scope.gridOptions.data = $scope.taskListData;
        };

        /**
         *显示子任务
         * @param {Object} data 数据内容
         * @return {undefined}
         */
        var getChildTaskList = function (data) {
            $scope.taskListData.length = 0;
            $scope.searchModel.searchText = '';
            $scope.checkboxes.checked = false;
            $scope.taskType = parseInt(data.type, 10);
            $timeout(function () {
                $scope.taskListData = FM.Util.clone(data.datas);
                getData();
            });
        };


        /**
         * 抽取日线tips质检;
         * @param {Object} $event 对象
         * @param {Object} item 标题
         * @return {undefined}
         */
        $scope.extractTask = function ($event, item) {
            $event.stopPropagation();
            if (item.isQuality == 1 && item.commonStatus != '0') {
                swal('提示', '常规任务未关闭，不可申请', 'warning');
                return;
            }
            var param = {
                subTaskId: item.subtaskId,
                checkerId: App.Temp.User.userId,
                checkerName: App.Temp.User.userRealName
            };
            $scope.loadingFlag = true;
            dsManage.getSubtaskById(item.subtaskId)
                .then(function (data) {
                    $scope.loadingFlag = false;
                    if (data) {
                        $scope.loadingFlag = true;
                        param.grids = data.gridIds;
                        dsFcc.extractDayTipsTask(param).then(function (resData) {
                            if (resData) {
                                $scope.currentTipsNum = resData.data.total;
                                $scope.currentTipsTypes = resData.data.typeCount;
                                var html = '已抽取 ' + $scope.currentTipsNum + ' 个Tips，共 ' + $scope.currentTipsTypes + ' 类';
                                swal({
                                    title: '抽取质检Tips',
                                    text: html,
                                    html: true,
                                    showCancelButton: false,
                                    allowEscapeKey: false,
                                    confirmButtonText: '关闭',
                                    confirmButtonColor: '#ec6c62'
                                }, function (f) {
                                    if (f) { // 关闭弹窗;
                                        swal.close();
                                        $timeout(function () {
                                            location.reload();
                                        }, 500);
                                    }
                                });
                            }
                            $scope.loadingFlag = false;
                        });
                    }
                });
        };

        /**
         * 选中子任务
         * @param {Object} item 标题
         * @return {String} null
         */
        $scope.selectSubTask = function (item) {
            // 如果是质检任务，且未申请数据，则不允许进入编辑
            if ((item.type == 3 || item.type == 4) && item.isQuality == 1 && (!item.isExtract)) {
                swal('提示', '请先申请质检数据！', 'warning');
                return;
            }

            dsManage.getSubtaskById(item.subtaskId).then(function (data) {
                if (data) {
                    var allDbId = Object.keys(data.meshes).map(function (itemId) {
                        return parseInt(itemId, 10);
                    });
                    App.Temp.dbIds = allDbId.length ? allDbId : [0];
                    App.Temp.dbId = App.Temp.dbIds[0];
                    App.Temp.subTaskId = data.subtaskId;
                    App.Temp.taskType = data.type;
                    App.Temp.workKind = data.workKind;
                    App.Temp.programType = data.programType;
                    App.Temp.subTaskName = data.name;
                    App.Temp.gridList = data.gridIds;
                    if (data.stage == 1) { // 日编
                        App.Temp.mdFlag = 'd';
                    } else if (data.stage == 2) { // 月编
                        App.Temp.mdFlag = 'm';
                    } else { // 默认：日编
                        App.Temp.mdFlag = 'd';
                    }
                    App.Temp.monthTaskType = null;
                    // 判断是否是质检任务
                    if (data.isQuality === 1) {
                        App.Temp.qcTaskFlag = true;
                    } else {
                        App.Temp.qcTaskFlag = false;
                    }
                    var currentMesh = data.meshes[App.Temp.dbId].slice();
                    App.Temp.SubTask = {
                        dbIds: App.Temp.dbIds,
                        dbId: App.Temp.dbId,
                        subTaskId: App.Temp.subTaskId,
                        taskName: App.Temp.subTaskName,
                        taskType: App.Temp.taskType,
                        programType: App.Temp.programType,
                        gridList: data.gridIds || [],
                        meshObj: data.meshes || {},
                        meshList: currentMesh || [],
                        mdFlag: App.Temp.mdFlag,
                        monthTaskType: null,
                        geometry: data.geometry,
                        qcTaskFlag: App.Temp.qcTaskFlag,
                        qualityGeos: data.qualityGeos,
                        workKind: data.workKind
                    };
                    App.Util.setSessionStorage('SubTask', App.Temp.SubTask);

                    ngDialog.close();

                    if (item.stage === 2) { // 月编POI专项
                        window.location.href = '#/monthTasks?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
                    } else {
                        // 2017-4-27 modified by chenx
                        // 增加随机数参数，解决切换任务后，编辑页面不刷新的问题
                        window.location.href = '#/editor?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
                    }
                }
            });
        };

        /**
         * 提交子任务
         * @param {Object} item 标题
         * @return {String} submitTask
         */
        var pushSubTask = function (item) {
            $scope.loadingFlag = true;
            if (item.stage === 1 && (item.type === 3 || item.type === 4) && item.isQuality === 1) {
                dsFcc.closeQualityCheckTask(item.subtaskId)
                    .then(function () {
                        return dsManage.submitTask(item.subtaskId);
                    })
                    .then(function (data) {
                        $scope.loadingFlag = false;
                        if (data) {
                            $scope.$emit('pushTaskList');
                        }
                    });
            } else {
                dsManage.submitTask(item.subtaskId).then(function (res) {
                    $scope.loadingFlag = false;
                    if (res) {
                        $scope.$emit('pushTaskList');
                    }
                });
            }
        };

        /**
         * 关闭弹窗
         * @param {Object} item 标题
         * @return {undefined}
         */
        var comformCloseDialog = function (item) {
            swal({
                title: '确认关闭此任务？',
                showCancelButton: true,
                allowEscapeKey: false,
                confirmButtonText: '是的，我要关闭',
                confirmButtonColor: '#ec6c62',
                closeOnConfirm: false, // 如果还有二级弹窗，需要此配置
                showLoaderOnConfirm: true
            }, function (f) {
                if (f) {
                    pushSubTask(item);
                }
            });
        };

        /**
         * 关闭任务
         * @param {Object} e 对象
         * @param {Object} item 标题
         * @return {String} null
         */
        $scope.submitTask = function (e, item) {
            e.stopPropagation();
            comformCloseDialog(item);
        };


        getClientHeight();
        $scope.currentPage = 1;
        $scope.currentPageSize = 20;
        $scope.loadingFlag = false;
        /**
         * 序号展示
         * @returns {string} <div><div/>
         */
        function getIndex() {
            return '<div class="ui-grid-cell-contents"><span style="vertical-align: middle">{{grid.appScope.caculateIndex(grid,row)}}</span></div>';
        }
        $scope.caculateIndex = function (grid, row) {
            var index = (grid.appScope.currentPage - 1) * grid.appScope.currentPageSize + grid.renderContainers.body.visibleRowCache.indexOf(row) + 1;
            if (index < 10) {
                index = '0' + index;
            }
            return index;
        };
        /**
         * 质检列格式化
         * @returns {string} <div><div/>
         */
        function getQuality() {
            return '<div class="ui-grid-cell-contents"><div ng-if="row.entity.isQuality">质检</div><div ng-if="!row.entity.isQuality">常规</div></div>';
        }

        /**
         * 操作列格式化
         * @returns {string} <div><div/>
         */
        function getOperation() {
            var html = '<div class="task-table-option ui-grid-cell-contents" ng-show="!(row.entity.isQuality == 1 && (!row.entity.isExtract))"><div class="task-underline-blue" ng-click="grid.appScope.submitTask($event, row.entity)">关闭</div>&nbsp' +
                '<div class="task-underline-disabled">申请</div></div>' +
                '<div class="task-table-option ui-grid-cell-contents" ng-show="row.entity.isQuality == 1 && (!row.entity.isExtract)"><div class="task-underline-disabled">关闭</div>&nbsp' +
                '<div ng-disabled="!(row.entity.isQuality == 1 && (!row.entity.isExtract))" class="task-underline-red" ng-click="grid.appScope.extractTask($event, row.entity)">申请</div></div>';
            return html;
        }

        /**
         * 清空输入框
         * @method emptySearchInput
         * @author wangmingdong
         * @date   2017-11-07
         * @return {undefined}
         */
        $scope.emptySearchInput = function () {
            $scope.searchModel.searchText = '';
            $scope.doSearchTaskList();
        };

        /**
         * 批量关闭任务
         * @method batchCloseTask
         * @author wangmingdong
         * @date   2017-11-07
         * @return {undefined}
         */
        $scope.batchCloseTask = function () {
            var param = {
                subtaskList: [],
                subtaskType: 2
            };
            var i;
            for (i = 0; i < $scope.taskListData.length; i++) {
                if ($scope.taskListData[i].checked) {
                    param.subtaskList.push($scope.taskListData[i].subtaskId);
                }
            }
            // 没有选择不关闭
            if (!param.subtaskList.length) {
                return;
            }
            $scope.loading.flag = true;
            dsEdit.batchCloseSubTask(param).then(function (data) {
                $scope.loading.flag = false;
                if (data) {
                    swal('提示', '关闭成功' + data.closeSuccessTasks + '个，关闭失败' + data.closeFailTasks + '个', 'warning');
                    for (i = 0; i < $scope.taskListData.length; i++) {
                        if (param.subtaskList.indexOf($scope.taskListData[i].subtaskId) > -1) {
                            $scope.taskListData.splice(i, 1);
                            i--;
                        }
                    }
                    getData();
                    $scope.checkboxes.checked = false;
                    $scope.$emit('pushTaskList');
                }
            });
        };

        /**
         * 勾选任务/全选/选中一行数据
         * @method checkTaskRow
         * @author wangmingdong
         * @param {Object} row 行数据
         * @param {Object} type 全选还是单选
         * @param {Object} event event
         * @date   2017-11-06
         * @return {undefined}
         */
        $scope.checkTaskRow = function (row, type, event) {
            var i;
            var task;
            if (type) {
                task = row.entity;
                // 勾选单条
                if (type === 2) {
                    task.checked = !task.checked;
                }
                // row.isSelected = task.checked;
                for (i = 0; i < $scope.taskListData.length; i++) {
                    if (!$scope.taskListData[i].checked) {
                        $scope.checkboxes.checked = false;
                        break;
                    }
                    if ($scope.taskListData[i].checked && i === $scope.taskListData.length - 1) {
                        $scope.checkboxes.checked = true;
                    }
                }
                event.stopPropagation();
            } else {
                // 全选/反选
                for (i = 0; i < $scope.taskListData.length; i++) {
                    $scope.taskListData[i].checked = $scope.checkboxes.checked;
                }
                // 反选行选中状态
                for (i = 0; i < $scope.gridApi.grid.rows.length; i++) {
                    // $scope.gridApi.grid.rows[i].isSelected = $scope.checkboxes.checked;
                }
            }
        };

        /**
         * 过滤数据
         * @method singleFilter
         * @author wangmingdong
         * @param {Object} renderAbleRows 筛选前数据
         * @date   2017-11-06
         * @return {undefined} renderAbleRows 筛选后数据
         */
        $scope.singleFilter = function (renderAbleRows) {
            var matcher = new RegExp($scope.searchModel.searchText);
            var i;
            for (i = 0; i < $scope.gridApi.grid.rows.length; i++) {
                if ($scope.gridApi.grid.rows[i].entity.subtaskId === App.Temp.subTaskId) {
                    $scope.gridApi.grid.rows[i].isSelected = true;
                } else {
                    $scope.gridApi.grid.rows[i].isSelected = false;
                }
            }
            renderAbleRows.forEach(function (row) {
                var match = false;
                var matchArray = ['name', 'subtaskId'];

                matchArray.forEach(function (field) {
                    var matchValue = row.entity[field] || row.entity[field] === 0 || row.entity[field] === '0'
                        ? row.entity[field] + '' : '';
                    // if (field === 'kindCode') {
                    //     var temp = $scope.metaData.kindFormat[matchValue];
                    //     matchValue = temp ? temp.kindName : '无';
                    // }
                    if (matchValue.match(matcher)) {
                        match = true;
                    }
                });

                if (!match) {
                    row.visible = false;
                }
            });

            return renderAbleRows;
        };

        /**
         * 搜索任务或id
         * @method doSearchTaskList
         * @author wangmingdong
         * @date   2017-11-06
         * @return {undefined}
         */
        $scope.doSearchTaskList = function () {
            $scope.gridApi.grid.refresh();
        };

        /**
         * 双击行跳转界面方法
         * @returns {string} <div><div/>
         */
        var formatRow = function () {
            var html = '<div class="ui-grid-row-wrapper" ng-click="grid.appScope.checkTaskRow(row, 2, $event)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell grid-cell-diy" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        };

        /**
         * 初始化任务列表表格
         * @method initTaskTable
         * @return {undefined}
         */
        function initTaskTable() {
            $scope.gridOptions = {
                enableColumnMenus: false,
                useExternalPagination: false,
                paginationPageSizes: [20, 50, 100, 200], // 每页显示个数选项
                paginationCurrentPage: 1, // 当前的页码
                paginationPageSize: 20, // 每页显示个数
                paginationTemplate: './task/taskGridPagerTmpl.htm',
                // enableFullRowSelection: true,
                // enableRowHeaderSelection: false,
                // multiSelect: true,
                // modifierKeysToMultiSelect: false,
                // noUnselect: false,
                enableRowSelection: false,
                enableRowHeaderSelection: false,
                rowTemplate: formatRow(),
                columnDefs: [{ field: 'pageIndex',
                    cellTemplate: getIndex,
                    displayName: '序号',
                    visible: true,
                    minWidth: 80
                }, {
                    field: 'name',
                    displayName: '子任务名称',
                    minWidth: 300,
                    enableSorting: true,
                    visible: true,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div ng-click="grid.appScope.selectSubTask(row.entity)" class="task-underline-blue">{{row.entity.name}}</div></div>'
                }, {
                    field: 'subtaskId',
                    displayName: '子任务ID',
                    minWidth: 80,
                    enableSorting: true,
                    visible: true,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div class="task-underline-blue" ng-click="grid.appScope.selectSubTask(row.entity)" style="cursor: pointer;">{{row.entity.subtaskId}}</div></div>'
                }, {
                    field: 'isQuality',
                    displayName: '环节',
                    enableSorting: true,
                    minWidth: 50,
                    visible: true,
                    cellTemplate: getQuality
                }, {
                    field: 'planStartDate',
                    displayName: '开始日期',
                    minWidth: 80,
                    enableSorting: true,
                    visible: true
                }, {
                    field: 'planEndDate',
                    displayName: '结束日期',
                    minWidth: 80,
                    enableSorting: true,
                    visible: true
                }, {
                    field: 'version',
                    displayName: '作业季',
                    minWidth: 60,
                    enableSorting: true,
                    visible: true
                }, {
                    field: 'tipsPrepared',
                    displayName: '待作业Tips',
                    minWidth: 70,
                    visible: true,
                    enableSorting: true,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.tipsPrepared? row.entity.tipsPrepared : "无"}}</div>'
                }, {
                    field: 'tipsFinished',
                    displayName: '已作业Tips',
                    minWidth: 70,
                    visible: true,
                    enableSorting: true,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.tipsFinished? row.entity.tipsFinished : "无"}}</div>'
                }, {
                    field: 'tipsQuestioned',
                    displayName: '有问题Tips',
                    minWidth: 70,
                    visible: true,
                    enableSorting: true,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.tipsQuestioned? row.entity.tipsQuestioned : "无"}}</div>'
                }, {
                    field: 'operate',
                    displayName: '操作',
                    minWidth: 100,
                    visible: true,
                    enableSorting: false,
                    cellTemplate: getOperation
                }],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.grid.registerRowsProcessor(FM.ColumnUtils.uiGridAutoHight, 200);
                    // 搜索事件
                    $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 400);

                    // 分页事件;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.currentPage = newPage;
                        $scope.currentPageSize = pageSize;
                    });
                }
            };
            $scope.checkboxes = {
                checked: false
            };
        }
        initTaskTable();

        /**
         * 监听父点击事件
         */
        $scope.$on('queryTaskList', function (event, data) {
            getChildTaskList(data);
        });

        /**
         * 监听窗口缩放
         */
        $scope.$on('resizeTaskTable', function (event, data) {
            getClientHeight();
        });
    }
]);
