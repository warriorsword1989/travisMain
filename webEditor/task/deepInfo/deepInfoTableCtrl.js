/**
 * Created by liuyang on 2016/12/7.
 */

angular.module('app').controller('deepInfoTableCtrl', ['$scope', '$rootScope', 'NgTableParams', 'ngTableEventsChannel',
    '$sce', 'dsColumn', '$document', 'appPath', '$interval', '$timeout', 'dsOutput', 'ngDialog', 'dsEdit', 'dsMeta',
    function ($scope, $rootScope, NgTableParams, ngTableEventsChannel, $sce, dsColumn, $document, appPath,
        $interval, $timeout, dsOutput, ngDialog, dsEdit, dsMeta) {
        $scope.showLoadingSVG = {
            flag: false
        };
        $scope.kindCodeData = {};
        var _self = $scope;
        $scope.dataListType = 1;
        $scope.tableHeight = {
            height: document.documentElement.clientHeight - 100 + 'px'
        };
        /* 初始化显示table提示*/
        $scope.poiListTableMsg = '数据加载中...';
        var filterParam = {
            name: $scope.searchText
        };

        /* 选择数据查找poi详情 */
        $scope.showDetail = function (data) {
            if (!(data && data.pid)) {
                return;
            }
            var id = ngDialog.getOpenDialogs()[0];
            ngDialog.close();
            $rootScope.$on('ngDialog.closed', function (e, $dialog) {
                if ($dialog.attr('id') === id) {
                    window.location.href = '#/editor?access_token=' + App.Temp.accessToken + '&pid=' + data.pid + '&random=' + (new Date()).getTime();
                }
            });
        };
        /* -----------------------------------格式化函数部分----------------------------------*/
        /* 审核状态*/
        /**
         * getStatus
         * @param {Object} scope 要素内容
         * @param {Object} row row
         * @return {string} temp
        */
        function getStatus(scope, row) {
            var temp = '';
            if (row.status === 1) {
                temp = '待审核';
            } else {
                temp = '已审核';
            }
            return temp;
        }

        /* 分类 */
      /**
       * getKindName
       * @param {Object} scope 要素内容
       * @param {Object} row row
       * @return {*} temp
       */
        function getKindName(scope, row) {
            if (row.kindCode) {
                if ($scope.kindCodeData[row.kindCode]) {
                    return $sce.trustAsHtml($scope.kindCodeData[row.kindCode]);
                }
                return $sce.trustAsHtml('');
            }
            return $sce.trustAsHtml(row.kindCode);
        }
        /* 状态 */
      /**
       * getState
       * @param {Object} scope 要素内容
       * @param {Object} row row
       * @return {undefined}
       */
        function getState(scope, row) {
            return {
                0: '<span>无</span>',
                1: '<span style="color:#636ef5">新增</span>',
                2: '<span style="font-color:#f56363">删除</span>',
                3: '<span style="font-color:#f9a130">修改</span>'
            }[row.state];
        }
        /* 名称 */
      /**
       * getName
       * @param {Object} scope 要素内容
       * @param {Object} row row
       * @return {String} <span><span/>
       */
        function getName(scope, row) {
            return '<span style="cursor: pointer;" ng-click="showDetail(row)">' + row.name + '</span>';
        }
        /* -----------------------------------格式化函数部分----------------------------------*/
        // 初始化ng-table表头;
        $scope.cols = [{
            field: 'num_index',
            title: '序号',
            width: '35px',
            show: true
        }, {
            field: 'state',
            title: '状态',
            text: 'center',
            width: '30px',
            html: true,
            sortable: true,
            getValue: getState,
            show: true
        }, {
            field: 'name',
            title: '名称',
            html: true,
            width: '110px',
            sortable: 'name',
            getValue: getName,
            show: true
        }, {
            field: 'kindCode',
            title: '分类',
            width: '60px',
            sortable: 'kindCode',
            getValue: getKindName,
            show: true
        }, {
            field: 'status',
            title: '审核状态',
            width: '40px',
            sortable: 'status',
            show: true,
            getValue: getStatus
        }, {
            field: 'photoTotal',
            title: '照片',
            width: '40px',
            sortable: 'photoTotal',
            show: true
        }, {
            field: 'checkErrorTotal',
            title: '检查错误',
            width: '60px',
            sortable: 'checkErrorTotal',
            show: true
        }];

        // 表格配置搜索;
        $scope.filters = {
            value: '',
            name: '',
            pid: 0
        };
        $scope.searchType = 'name';

        // 刷新表格方法;
        var refreshData = function (flag) {
            _self.tableParams.reload();
        };

        $scope.total = 0;
      /**
       * initDeepTable
       * @return {undefined}
       */
        function initDeepTable() {
            $scope.poiListTableMsg = '数据加载中。。。';
            if ($scope.showLoading) {
                $scope.showLoading.flag = true;
            } else {
                $scope.showLoadingSVG.flag = true;
            }
            var param = {
                dbId: App.Temp.dbId,
                subtaskId: App.Temp.subTaskId,
                type: App.Temp.monthTaskType,
                status: $scope.dataListType
            };
            dsColumn.queryDeepDataList(param).then(function (data) {
                if ($scope.showLoading) {
                    $scope.showLoading.flag = false;
                } else {
                    $scope.showLoadingSVG.flag = false;
                }
                if (data && data.rows) {
                    $scope.total = data.total;
                    $scope.poiListTableMsg = '列表无数据';
                    var pidList = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        pidList.push(data.rows[i].pid);
                    }
                    sessionStorage.setItem('deepPids', pidList);
                    $scope.tableParams = new NgTableParams({
                        count: 30,
                        filter: filterParam
                    }, {
                        counts: [30, 50, 100, 200],
                        paginationMaxBlocks: 5,
                        paginationMinBlocks: 2,
                        dataset: data.rows
                    });
                } else {
                    $scope.total = 0;
                    $scope.loadTableDataMsg = '数据加载失败，请刷新页面重新请求！';
                }
            });
        }

        // 给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function () {
            $scope.itemActive = -1;
            angular.forEach($scope.tableParams.data, function (data, index) {
                data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
            });
        });
        // 加载元数据
        var loadMetaData = function () {
            // 查询全部的小分类数据
            var param = {
                mediumId: '',
                region: 0
            };
            dsMeta.getKindList(param).then(function (kindData) {
                /* 初始化方法*/
                initDeepTable();
                for (var i = 0; i < kindData.length; i++) {
                    $scope.kindCodeData[kindData[i].kindCode] = kindData[i].kindName;
                }
            });
        };
        loadMetaData();

        /* 切换poi列表类型*/
        $scope.changeDataList = function (val) {
            $scope.dataListType = val;
            initDeepTable();
        };
        $scope.$watch('searchText', function (newValue, oldewValue) {
            if ($scope.tableParams && $scope.tableParams.filter()) {
                $scope.tableParams.filter().name = newValue;
            }
        });
        /**
         * 申请数据
         * 返回成功后刷新列表
         * @return {undefined}
         */
        $scope.applyData = function () {
            if ($scope.showLoading) {
                $scope.showLoading.flag = true;
            } else {
                $scope.showLoadingSVG.flag = true;
            }
            var param = {
                dbId: App.Temp.dbId,
                taskId: App.Temp.subTaskId,
                secondWorkItem: App.Temp.monthTaskType,
                firstWorkItem: 'poi_deep'
            };
            dsColumn.applyDeepData(param).then(function (data) {
                if ($scope.showLoading) {
                    $scope.showLoading.flag = false;
                } else {
                    $scope.showLoadingSVG.flag = false;
                }
                swal('提示', '申请成功，共申请到' + data + '条数据。', 'info');
                $scope.$emit('freshList');
                initDeepTable();
            });
        };
        /**
         * 在线检查
         * 返回成功后刷新列表
         * @return {undefined}
         */
        $scope.checkData = function () {
            if ($scope.showLoading) {
                $scope.showLoading.flag = true;
            } else {
                $scope.showLoadingSVG.flag = true;
            }
            var param = {
                subtaskId: App.Temp.subTaskId,
                secondWorkItem: App.Temp.monthTaskType, // App.Temp.taskType,
                firstWorkItem: 'poi_deep',
                checkType: 2,
                status: $scope.dataListType
            };
            dsColumn.checkDeepData(param).then(function (jobId) {
                if (jobId) {
                    var timer = $interval(function () {
                        dsEdit.getJobById(jobId).then(function (data) {
                            if (data.status == 3 || data.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                if ($scope.showLoading) {
                                    $scope.showLoading.flag = false;
                                } else {
                                    $scope.showLoadingSVG.flag = false;
                                }
                                initDeepTable();
                                $interval.cancel(timer);
                                if (data.status == 3) {
                                    swal('检查提示', '在线检查执行完成', 'info');
                                } else {
                                    swal('检查提示', '在线检查执行失败,' + data.resultMsg, 'warning');
                                }
                            }
                        });
                    }, 500);
                } else {
                    if ($scope.showLoading) {
                        $scope.showLoading.flag = false;
                    } else {
                        $scope.showLoadingSVG.flag = false;
                    }
                    swal('检查提示', '在线检查执行失败!', 'warning');
                }
            });
        };
        /**
         * 数据提交
         * 返回成功后刷新列表
         * @return {undefined}
         */
        $scope.submitDeepData = function () {
            swal({
                title: '确认提交？',
                type: 'warning',
                animation: 'none',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '是的，我要提交',
                cancelButtonText: '取消'
            }, function (f) {
                if (f) {
                    if ($scope.showLoading) {
                        $scope.showLoading.flag = true;
                    } else {
                        $scope.showLoadingSVG.flag = true;
                    }
                    var param = {
                        dbId: App.Temp.dbId,
                        subtaskId: App.Temp.subTaskId,
                        secondWorkItem: App.Temp.monthTaskType // App.Temp.taskType
                    };
                    dsColumn.releaseDeepDataList(param).then(function (data) {
                        if ($scope.showLoading) {
                            $scope.showLoading.flag = false;
                        } else {
                            $scope.showLoadingSVG.flag = false;
                        }
                        if (data) {
                            swal('提示', '提交成功' + data.sucReleaseTotal + '条POI。', 'info');
                            $scope.$emit('freshList');
                            initDeepTable();
                        } else {
                            swal('提示', '提交失败！', 'error');
                        }
                    });
                }
            });
        };
    }
]);
