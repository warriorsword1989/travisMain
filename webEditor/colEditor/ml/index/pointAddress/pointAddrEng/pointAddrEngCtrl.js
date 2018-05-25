/**
 * Created by mali on 2017/11/22.
 */

angular.module('app').controller('pointAddrEngCtrl', ['$scope', '$sce', '$ocLazyLoad', 'ngDialog', 'dsColumn', 'dsEdit', '$interval', '$timeout', 'uiGridConstants', 'appPath',
    function ($scope, $sce, $ocLazyLoad, ngDialog, dsColumn, dsEdit, $interval, $timeout, uiGridConstants, appPath) {
        var height = document.documentElement.clientHeight - 136;
        $scope.tableBodyHeight = {
            height: height + 'px'
        };
        $scope.checkboxes = {
            checked: false
        };
        $scope.subtaskName = FM.ColumnUtils.config.workBatch[App.Temp.subTaskId];
        $scope.qcWorkType = App.Temp.qcTaskFlag == 1 ? '质检' : '作业';
        $scope.dataListType = 1; // 默认选中待作业
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.costomWorkNum = 10;
        $scope.costomWorkNumEum = [{ num: 10, desc: '每次10条' }, { num: 20, desc: '每次20条' },
            { num: 30, desc: '每次30条' }, { num: 100, desc: '每次100条' }];
        $scope.enableClick = false; // 控制按钮时候可以点击
        $scope.loadTableDataMsg = '数据加载中。。。';
        $scope.searchPlaceholder = '点门牌';
        var alreadyChecked = false; // 是否点击过在线检查
        $scope.main.workType = 'pointEngAddr'; // 默认加载项
        $scope.main.jobIds = [];  // dialog查询的jobID

        // 设置每次作业条数
        $scope.selectNum = function (params, arg2) {
            $scope.costomWorkNum = params.num;
            $scope.popoverIsOpen = false;
        };

        /**
         * 格式化nameId
         * @return {String} <div><div/>
         */
        function getName() {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.nameId" >{{row.entity.nameChi.nameId}}</div>';
            return html;
        }

        /**
         * 格式化 门牌地址号
         * @return {string} div
         */
        function getPoint() {
            var html = '<div ng-bind-html="grid.appScope.getPointText(row.entity)"></div>';
            return html;
        }

        /**
         * 获取门牌地址号 规则是 外业道路名 + 外业门牌号
         * @param {Object} row 行数据
         * @return {undefined} div
         */
        $scope.getPointText = function (row) {
            return '<div>' + row.dprName + '+' + row.dpName + '</div>';
        };

        $scope.getAddressChiCombine = function (row) {
            var roadName = row.addressChi.roadnameStr;
            var addrName = row.addressChi.addrnameStr;
            if (roadName) {
                var arr = roadName.split('|');
                arr.splice(0, 3);
                roadName = arr.join('|'); // 英文地址不显示前三位 ，此处不用做非空的判断正常数肯定符合条件
            }
            var combine = '';
            if (roadName && addrName) {
                combine = roadName + addrName;
            } else if (roadName) {
                combine = roadName;
            } else if (addrName) {
                combine = addrName;
            }
            return combine;
        };

        /**
         *formatCkRules
         * @return {String} <div><div/>
         */
        function formatCkRules() {
            var html = '<div ng-bind-html="grid.appScope.getCkRules(row.entity)"></div>';
            return html;
        }
        $scope.getCkRules = function (row) {
            var ckRules = row.ckRules;
            var html = '';
            if (!ckRules.length) {
                html = '无';
            } else {
                for (var i = 0; i < ckRules.length; i++) {
                    html += (i + 1) + '.' + ckRules[i].log + '<br>';
                }
            }
            return html;
        };

        $scope.toggleVisible = function () {
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        // 表格显示的列
        $scope.cols = [];

        var conbineCols = function () {
            $scope.cols = [];
            // 配置显示的列
            var engNameCols = {
                // 前公共列
                primaryCols: [
                    { field: 'selector',
                        headerCellTemplate: '<div><input type="checkbox" ng-model="grid.appScope.checkboxes.checked" class="fm-control"/></div>',
                        cellTemplate: '<div><input type="checkbox" ng-model="row.entity.checked" class="fm-control"/></div>',
                        displayName: '选择',
                        visible: true,
                        maxWidth: 30 },
                    { field: 'nameChi.point', displayName: '点门牌', cellTemplate: getPoint, visible: true, minWidth: 100 },
                    { field: 'nameChi.nameId', displayName: '名称号码', enableSorting: true, cellTemplate: getName, visible: true, minWidth: 100, maxWidth: 150 },
                    { field: 'nameChi.addrname', displayName: '地址门牌号', enableSorting: true, visible: true, minWidth: 100 },
                    { field: 'nameChi.estab', displayName: '附属设施名', enableSorting: true, visible: true, minWidth: 100 },
                    { field: 'nameChi.building', displayName: '楼栋号', enableSorting: true, visible: true, minWidth: 100 },
                    { field: 'nameChi.unit', displayName: '楼门号', enableSorting: true, visible: true, minWidth: 100 }

                ],
                // 后公共列
                lastCols: [
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 },
                    { field: 'pid', displayName: 'PID', visible: false, minWidth: 100 }
                ]
            };
            $scope.cols = $scope.cols.concat(engNameCols.primaryCols);
            if (engNameCols[$scope.main.workType] && engNameCols[$scope.main.workType].length > 0) {
                $scope.cols = $scope.cols.concat(engNameCols[$scope.main.workType]);
            }
            $scope.cols = $scope.cols.concat(engNameCols.lastCols);
            return $scope.cols;
        };

        /**
         *getData
         * @param {Object} options 获取表格数据
         * @return {undefined}
         */
        function getData(options) {
            $scope.gridOptions.totalItems = 0;
            $scope.gridOptions.data = [];
            var param = {
                firstWorkItem: 'pointAddr_engAddr',
                secondWorkItem: $scope.main.workType, // 'nameUnify',
                status: $scope.dataListType
            };
            var params = $.extend(param, options);
            $scope.loadingFlag = true;
            dsColumn.queryPointAddressDataList(params).then(function (data) {
                var temp = new FM.dataApi.ColPointAddressList(data.rows);
                $scope.allTableList = temp.dataList;
                if (temp.dataList.length > 0) {
                    $scope.enableClick = true;
                } else {
                    $scope.enableClick = false;
                }
                $scope.gridOptions.totalItems = data.total;
                $scope.gridOptions.data = $scope.allTableList;
                $scope.loadingFlag = false;
            }, function () { $scope.loadingFlag = false; });
        }

        /**
         *formatRow
         * @return {String} <div><div/>
         */
        function formatRow() {
            var html = '<div ng-dblClick="grid.appScope.selectData(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }

        /**
         *initTable
         * @return {undefined}
         */
        function initTable() {
            $scope.gridOptions = {
                enableColumnMenus: false,
                useExternalPagination: false,
                paginationPageSizes: [15, 25, 50], // 每页显示个数选项
                paginationCurrentPage: 1, // 当前的页码
                paginationPageSize: 15, // 每页显示个数
                paginationTemplate: '@components/tools/uiGridPager/uiGridPagerTmpl.htm',
                enableFullRowSelection: true,
                enableRowHeaderSelection: false,
                // useExternalFiltering: false,
                multiSelect: false,
                totalItems: 0,
                modifierKeysToMultiSelect: false,
                noUnselect: false,
                rowTemplate: formatRow(),
                columnDefs: conbineCols(),
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    // 搜索事件
                    $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 400);
                }
            };
            // 初始化表格;
            getData();
        }

        // 搜索
        $scope.$watch('searchText', function (newValue, oldewValue) {
            $scope.gridApi.grid.refresh();
        });
        $scope.singleFilter = function (renderableRows) {
            var matcher = new RegExp($scope.searchText);
            renderableRows.forEach(function (row) {
                var match = false;
                if ($scope.searchText && (row.entity.dprName.match(matcher) || row.entity.dpName.match(matcher))) {
                    match = true;
                } else if (!$scope.searchText) {
                    match = true;
                }
                if (!match) {
                    row.visible = false;
                }
            });
            // 手动同步表格显示数据和 返回数据
            var currentResult = [];
            renderableRows.forEach(function (item, index) {
                if (item.visible) {
                    currentResult.push(item.entity);
                }
            });
            $scope.allTableList = currentResult;
            return renderableRows;
        };

        $scope.changeDataList = function (type) {
            $scope.loadTableDataMsg = '数据加载中。。。';
            $scope.dataListType = type;
            initTable();
        };

        // 二级项提交
        $scope.submitData = function () {
            if (!$scope.enableClick) {
                return;
            }
            $scope.showLoading.flag = true;
            dsColumn.submitPointAddressData('pointAddr_engAddr', $scope.main.workType).then(function (jobId) {
                if (jobId) {
                    var timer = $interval(function () {
                        dsEdit.getJobById(jobId).then(function (data) {
                            if (data.status == 3 || data.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                $scope.showLoading.flag = false;
                                $interval.cancel(timer);
                                if (data.status == 3) {
                                    alreadyChecked = true;
                                    initTable();
                                    $scope.$emit('refreshMainPage');
                                } else {
                                    swal('提示', '数据提交失败！' + data.resultMsg, 'warning');
                                }
                            }
                        });
                    }, 600);
                }
            });
        };

        // 启动进度条
        var progressTimer;
        var executeProgress = function () {
            $scope.progress.value = 0;
            progressTimer = $interval(function () {
                $scope.progress.value += 5;
                if ($scope.progress.value > 100) {
                    $scope.progress.value = 0;
                }
            }, 500);
        };
        // 关闭进度条
        var closeProgress = function () {
            $scope.progress.value = 100;
            if (progressTimer) {
                $interval.cancel(progressTimer);
            }
        };
        // 重置进度条
        var resertProgress = function () {
            $scope.progress.value = 0;
        };
        // 在线检查
        $scope.doCheckData = function () {
            if (!$scope.enableClick) {
                return;
            }
            $scope.showLoading.flag = true;
            executeProgress();
            var param = {
                subtaskId: App.Temp.subTaskId,
                checkType: 10, // 1 poi粗编 ;2 poi精编 ; 3 道路粗编 ; 4道路精编 ; 5道路名 ; 6 其他; 10 点门牌
                firstWorkItem: 'pointAddr_engAddr',
                secondWorkItem: $scope.main.selectedItem.id,
                status: $scope.dataListType
            };
            dsColumn.checkDeepData(param).then(function (jobId) {
                if (jobId) {
                    var timer = $interval(function () {
                        dsEdit.getJobById(jobId).then(function (data) {
                            if (data.status == 3 || data.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                $interval.cancel(timer);
                                closeProgress();
                                $scope.showLoading.flag = false;
                                if (data.status == 3) {
                                    alreadyChecked = true;
                                    initTable();
                                } else {
                                    swal('提示', '检查执行失败,' + data.resultMsg, 'warning');
                                }
                            }
                        });
                    }, 600);
                }
            });
        };

        // 监控全选;
        $scope.$watch(function () {
            return $scope.checkboxes.checked;
        }, function (value) {
            angular.forEach($scope.allTableList, function (item) {
                item.checked = value;
            });
        });

        // 获取当前页要编辑的条数
        $scope.combiPerPageEditData = function (allData) {
            // 需要编辑的所有数据
            if ($scope.allTableList.length > $scope.costomWorkNum) {
                // 当前页要编辑的数据
                var resultArr = $scope.allTableList.splice(0, $scope.costomWorkNum);
                $scope.currentEditOrig = angular.copy(resultArr);
                $scope.currentEdited = angular.copy(resultArr);
            } else {
                $scope.currentEditOrig = angular.copy($scope.allTableList);
                $scope.currentEdited = angular.copy($scope.allTableList);
                $scope.allTableList = [];
            }
            return $scope.currentEditOrig;
        };

        // 预加载，实际到ngDialog.open的时候才用到，
        $ocLazyLoad.load('./colEditor/ml/index/pointAddress/pointAddrEng/pointAddrEngEditCtrl.js');

        var openEditDialog = function (isCollectData) {
            $scope.isCollectData = false;
            if (isCollectData) {
                $scope.isCollectData = true;
            }

            $scope.combiPerPageEditData();
            var dialog = ngDialog.open({
                template: 'colEditor/ml/index/pointAddress/pointAddrEng/pointAddrEngEditTpl.html',
                controller: 'engAddressEditCtrl',
                className: 'ngdialog-theme-default ngdialog-theme-plain dialog-edit',
                width: '100%',
                height: '100%',
                closeByDocument: false,
                scope: $scope,
                preCloseCallback: function () {
                    if ($scope.main.jobIds.length != 0) {
                        $scope.showLoading.flag = true;
                        var timer = $interval(function () {
                            dsEdit.getByJobIds($scope.main.jobIds).then(function (data) {
                                for (var i = $scope.main.jobIds.length - 1; i >= 0; i--) {
                                    var status = data[$scope.main.jobIds[i]].status;
                                    if (status == 3 || status == 4) {
                                        $scope.main.jobIds.splice(i, 1);
                                    }
                                }
                                if ($scope.main.jobIds.length === 0) {
                                    $scope.showLoading.flag = false;
                                    $interval.cancel(timer);
                                    initTable();
                                    $scope.$emit('refreshMainPage');
                                }
                            });
                        }, 600);
                    } else {
                        initTable();
                    }
                }
            });
        };

        $scope.selectData = function (row, index) {
            var temp = $scope.allTableList;
            var checkedArr = [];
            for (var i = 0, len = temp.length; i < len; i++) {
                if (temp[i].checked) {
                    checkedArr.push(temp[i]);
                }
            }
            var editArr = [];
            if (checkedArr.length > 0) {
                editArr = checkedArr;
            } else {
                editArr = temp;
            }
            $scope.allTableList = editArr;
            openEditDialog();
        };

        $scope.doRefresh = function () {
            initTable();
        };

        $scope.$on('refreshChildrenPage', function (event, obj) {
            if (obj && obj.showErrMsg == 1) {  // 表示的是提交后需要显示错误信息列
                alreadyChecked = true;
            } else {
                alreadyChecked = false;
                $scope.dataListType = 1; // 待作业
            }
            $scope.searchText = ''; // 清空搜索条件
            resertProgress();
            initTable();
        });

        initTable();
    }]);
