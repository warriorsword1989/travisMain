/**
 * 专项任务列表
 * @file taskSpecialTableCtrl.js
 * @author wangmingdong
 * @date   2017-11-08
 *
 * @copyright @Navinfo, all rights reserved.
 */

angular.module('app').controller('taskSpeacialTableCtrl', ['$scope', 'ngDialog', 'dsManage', 'dsFcc', '$timeout', 'dsColumn', 'appPath', 'dsEdit', 'uiGridConstants',
    function ($scope, ngDialog, dsManage, dsFcc, $timeout, dsColumn, appPath, dsEdit, uiGridConstants) {
        var width = document.documentElement.clientWidth - 240;
        var taskNum = parseInt((width - 15) / 315, 10);
        var taskLength = width - taskNum * 300;
        $scope.taskListMargin = {
            'margin-left': taskLength / (taskNum + 1) + 'px'
        };
        // 批次列表数据配置表
        var monthTaskDataList = {
            11: [{ type: '快速', batch: 'M1', isQuality: 0, subTaskId: 11 }, { type: '快速', batch: 'M1', isQuality: 1, subTaskId: 11 }],
            12: [{ type: '策略', batch: 'M1', isQuality: 0, subTaskId: 12 }, { type: '策略', batch: 'M1', isQuality: 1, subTaskId: 12 }],
            21: [{ type: '快速', batch: 'M2', isQuality: 0, subTaskId: 21 }, { type: '快速', batch: 'M2', isQuality: 1, subTaskId: 21 }],
            22: [{ type: '策略', batch: 'M2', isQuality: 0, subTaskId: 22 }, { type: '策略', batch: 'M2', isQuality: 1, subTaskId: 22 }],
            23: [{ type: '常规', batch: 'M2', isQuality: 0, subTaskId: 23 }, { type: '常规', batch: 'M2', isQuality: 1, subTaskId: 23 }],
            31: [{ type: '快速', batch: 'M3', isQuality: 0, subTaskId: 31 }, { type: '快速', batch: 'M3', isQuality: 1, subTaskId: 31 }],
            32: [{ type: '策略', batch: 'M3', isQuality: 0, subTaskId: 32 }, { type: '策略', batch: 'M3', isQuality: 1, subTaskId: 32 }],
            33: [{ type: '常规', batch: 'M3', isQuality: 0, subTaskId: 33 }, { type: '常规', batch: 'M3', isQuality: 1, subTaskId: 33 }]
        };
        // 专项任务列表
        var specialTasks = App.Util.getSessionStorage('SpecialTasks');
        // 专项任务筛选条件
        var specialMeshes = App.Util.getSessionStorage('SpecialMeshes');
        if (specialTasks && specialTasks.length) {
            $scope.taskListData = specialTasks;
        } else {
            $scope.taskListData = [];
        }
        $scope.taskListData = [];
        $scope.currentTipsTypes = 0;
        $scope.currentTipsNum = 0;
        $scope.searchModel = {
            searchText: '',
            enterMeshes: specialMeshes ? specialMeshes : ''
        };
        $scope.isMeshesFilter = false;

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
         * 初始化数据
         * @method initTableData
         * @author wangmingdong
         * @param {Object} data 任务
         * @date   2017-11-20
         * @return {undefined}
         */
        var initTableData = function (data) {
            $scope.taskListData.length = 0;
            $scope.searchModel.searchText = '';
            $scope.checkboxes.checked = false;
            $scope.taskType = 7;
        };

        /**
         *显示子任务
         * @param {Object} data 数据内容
         * @param {Object} options 子任务选项
         * @param {function} callback 回调函数
         * @return {undefined}
         */
        var getChildTaskList = function (data, options, callback) {
            var i;
            initTableData(data);
            $scope.finalResultObj = { '-1': { total: 0, datas: [], type: -1 } };
            $scope.finalResultArray = [];
            dsColumn.queryPartition().then(function (datas) {
                App.Temp.dbId = datas.dbId;
                for (i = 0; i < datas.partition.length; i++) {
                    $scope.taskListData = $scope.taskListData.concat(monthTaskDataList[datas.partition[i]]);
                }
                // 默认批次排序
                $scope.taskListData.sort(function (a, b) {
                    return a.lot - b.lot;
                });
                getData();
                if (callback) {
                    callback();
                }
            });
        };

        /**
         * 选中子任务
         * @param {Object} item 子任务标题
         * @return {Object} null
         */
        $scope.selectSubTask = function (item) {
            App.Temp.subTaskId = item.subTaskId;
            App.Temp.qcTaskFlag = item.isQuality;
            App.Temp.taskType = 7;
            App.Temp.SubTask = {
                dbId: App.Temp.dbId,
                subTaskId: item.subTaskId,
                subTaskBatch: item.batch,
                taskType: App.Temp.taskType,
                qcTaskFlag: App.Temp.qcTaskFlag
            };
            App.Util.setSessionStorage('SubTask', App.Temp.SubTask);
            ngDialog.close();
            window.location.href = '#/monthTasks?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
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
            return '<div class="ui-grid-cell-contents"><div ng-if="row.entity.isQuality">质检</div><div ng-if="!row.entity.isQuality">作业</div></div>';
        }

        /**
         * 获取子任务统计
         * @method getTaskTotal
         * @author wangmingdong
         * @date   2017-11-07
         * @return {string} <div><div/>
         */
        var getTaskTotal = function () {
            return '<div class="ui-grid-cell-contents">' +
                '<div ng-if="!row.entity.showTotal && !row.entity.showLoading" class="task-underline-blue" ng-click="grid.appScope.showTaskTotal(row.entity, $event);">查看子任务统计</div>' +
                '<div ng-if="row.entity.showLoading" class="small-loading-gif"></div>' +
                '<div ng-if="row.entity.showTotal">专项库存log：{{row.entity.total.commonTotal}}；专项我的log：{{row.entity.total.myCommonTotal}}；点门牌库存log：{{row.entity.total.pointaddrtotal}}；点门牌我的log：{{row.entity.total.myPointaddrTotal}}；' +
                '深度信息库存POI：{{row.entity.total.deepTotal}}；深度信息我的POI：{{row.entity.total.myDeepTotal}}。<span class="task-underline-blue" ng-click="grid.appScope.showTaskTotal(row.entity, $event);">刷新</span></div>' +
                '</div>';
        };

        /**
         * 根据taskId查询任务统计
         * @method showTaskTotal
         * @author wangmingdong
         * @date   2017-11-07
         * @param {Object} row row
         * @param {Object} event 事件对象
         * @return {undefined}
         */
        $scope.showTaskTotal = function (row, event) {
            event.stopPropagation();
            var i;
            for (i = 0; i < $scope.taskListData.length; i++) {
                if ($scope.taskListData[i].subTaskId === row.subTaskId && $scope.taskListData[i].isQuality == row.isQuality) {
                    $scope.taskListData[i].showTotal = false;
                    $scope.taskListData[i].showLoading = true;
                }
            }
            dsColumn.querySubtask(row.subTaskId, row.isQuality).then(function (data) {
                for (i = 0; i < $scope.taskListData.length; i++) {
                    if ($scope.taskListData[i].subTaskId === row.subTaskId && $scope.taskListData[i].isQuality == row.isQuality) {
                        $scope.taskListData[i].showLoading = false;
                        $scope.taskListData[i].showTotal = true;
                        $scope.taskListData[i].total = {
                            commonTotal: data.commonTotal,
                            myCommonTotal: data.myCommonTotal,
                            deepTotal: data.deepTotal,
                            myDeepTotal: data.myDeepTotal,
                            pointaddrtotal: data.pointaddrtotal,
                            myPointaddrTotal: data.myPointaddrTotal
                        };
                    }
                }
            });
        };

        /**
         * 统计全部子任务
         * @method allTaskTotal
         * @author wangmingdong
         * @date   2017-11-07
         * @param {String} type 打开或关闭
         * @return {undefined}
         */
        $scope.allTaskTotal = function (type) {
            $scope.showAllTotal = type;
            if (type) {
                var i;
                var selectArray = [];
                for (i = 0; i < $scope.gridApi.grid.rows.length; i++) {
                    // if ($scope.gridApi.grid.rows[i].visible) {
                    selectArray.push($scope.gridApi.grid.rows[i].entity.subtaskId);
                    // }
                }
                $scope.loading.flag = true;
                dsColumn.querySubtask(selectArray).then(function (data) {
                    if (data.length) {
                        $scope.allTotal = data;
                    }
                    $scope.loading.flag = false;
                });
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
            $scope.currentLot = [];
            $scope.checkboxes.checked = false;
            var i;
            for (i = 0; i < $scope.taskListData.length; i++) {
                $scope.taskListData[i].checked = false;
            }
            // 反选行选中状态
            for (i = 0; i < $scope.gridApi.grid.rows.length; i++) {
                if ($scope.gridApi.grid.rows[i].entity.subTaskId === App.Temp.subTaskId && $scope.gridApi.grid.rows[i].entity.isQuality === App.Temp.qcTaskFlag) {
                    $scope.gridApi.grid.rows[i].isSelected = true;
                } else {
                    $scope.gridApi.grid.rows[i].isSelected = false;
                }
            }

            // 手动同步表格显示数据和 返回数据
            var currentResult = [];

            renderAbleRows.forEach(function (item, index) {
                if (item.visible) {
                    currentResult.push(item.entity);
                }
            });
            $scope.taskListData = currentResult;

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
            var html = '<div class="ui-grid-row-wrapper">' +
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
                enableFiltering: true,
                enableColumnMenus: false,
                useExternalPagination: false,
                paginationPageSizes: [20], // 每页显示个数选项
                paginationCurrentPage: 1, // 当前的页码
                paginationPageSize: 20, // 每页显示个数
                paginationTemplate: '@components/tools/uiGridPager/uiGridPagerTmpl.htm',
                // enableFullRowSelection: true,
                // enableRowHeaderSelection: false,
                // multiSelect: true,
                // modifierKeysToMultiSelect: false,
                // noUnselect: false,
                enableRowSelection: false,
                enableRowHeaderSelection: false,
                rowTemplate: formatRow(),
                columnDefs: [{
                    field: 'pageIndex',
                    displayName: '序号',
                    minWidth: 60,
                    visible: true,
                    enableSorting: false,
                    enableFiltering: false,
                    cellTemplate: getIndex
                }, {
                    field: 'type',
                    displayName: '',
                    minWidth: 100,
                    filter: {
                        term: '',
                        noTerm: false,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [{ value: '', label: '全部方式' }, { value: '快速', label: '快速' }, { value: '策略', label: '策略' }, { value: '常规', label: '常规' }]
                    },
                    visible: true,
                    headerCellClass: 'task-header-select'
                }, {
                    field: 'batch',
                    displayName: '',
                    minWidth: 100,
                    filter: {
                        term: '',
                        noTerm: false,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [{ value: '', label: '全部批次' }, { value: 'M1', label: 'M1' }, { value: 'M2', label: 'M2' }, { value: 'M3', label: 'M3' }]
                    },
                    visible: true,
                    headerCellClass: 'task-header-select'
                }, {
                    field: 'isQuality',
                    displayName: '',
                    minWidth: 100,
                    filter: {
                        term: '',
                        noTerm: false,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [{ value: '', label: '作业方式' }, { value: '0', label: '作业' }, { value: '1', label: '质检' }]
                    },
                    visible: true,
                    cellTemplate: getQuality,
                    headerCellClass: 'task-header-select'
                }, {
                    field: 'isQuality',
                    displayName: '编辑',
                    minWidth: 50,
                    enableFiltering: false,
                    visible: true,
                    enableSorting: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><div ng-click="grid.appScope.selectSubTask(row.entity)" class="task-underline-blue">编辑</div></div>'
                }, {
                    field: 'showTotal',
                    displayName: '子任务统计',
                    minWidth: 740,
                    enableFiltering: false,
                    enableSorting: false,
                    visible: true,
                    cellTemplate: getTaskTotal
                }],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.grid.registerRowsProcessor(FM.ColumnUtils.uiGridAutoHight, 200);
                    // 搜索事件
                    $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 400);

                    $timeout(function () {
                        if (App.Temp.subTaskId) {
                            for (var i = 0; i < $scope.gridApi.grid.rows.length; i++) {
                                if ($scope.gridApi.grid.rows[i].entity.subTaskId === App.Temp.subTaskId && $scope.gridApi.grid.rows[i].entity.isQuality === App.Temp.qcTaskFlag) {
                                    $scope.gridApi.grid.rows[i].isSelected = true;
                                }
                            }
                        }
                    });
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
            specialTasks = App.Util.getSessionStorage('SpecialTasks');
            if (specialTasks && specialTasks.length) {
                // initTableData(data);
                $scope.isMeshesFilter = true;
                $scope.taskListData = specialTasks;
                getData();
            } else {
                $scope.isMeshesFilter = false;
                getChildTaskList(data);
            }
        });

        /**
         * 监听窗口缩放
         */
        $scope.$on('resizeTaskTable', function (event, data) {
            getClientHeight();
        });
    }
]);
