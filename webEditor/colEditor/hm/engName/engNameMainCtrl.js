/**
 * Created by mali on 2018/1/8.
 */

angular.module('app').controller('hmEngNameMainCtrl', ['$scope', 'ngDialog', '$ocLazyLoad',
    'appPath', 'dsColumn', 'dsEdit', '$interval', '$cookies', '$timeout',
    function ($scope, ngDialog, $ocLazyLoad, appPath, dsColumn, dsEdit, $interval, $cookies, $timeout) {
        $scope.editLines = 10; // 默认一条便于调试
        $scope.editAllDataList = [];
        $scope.showLoading = { flag: false };
        $scope.childTaskList = [{
            id: 'photoEngName',
            name: '照片录入英文名',
            num: '0/0',
            select: true
        }, {
            id: 'photoPorName',
            name: '照片录入葡文名',
            num: '0/0',
            select: true
        }, {
            id: 'chiEngName',
            name: '中文即是英文',
            num: '0/0',
            select: false
        }, {
            id: 'chiPorName',
            name: '中文即是葡文',
            num: '0/0',
            select: false
        }, {
            id: 'macaoEngName',
            name: '澳门英文名作业',
            num: '0/0',
            select: false
        }, {
            id: 'engNameInvalidChar',
            name: '英文名非法字符',
            num: '0/0',
            select: false
        }, {
            id: 'portuNameInvalidChar',
            name: '葡文名非法字符',
            num: '0/0',
            select: false
        }, {
            id: 'officalStandardEngName',
            name: '官方标准英文名',
            num: '0/0',
            select: false
        }, {
            id: 'officalStandardPortuName',
            name: '官方标准葡文名',
            num: '0/0',
            select: false
        }];
        $scope.main = {}; // 将子页面使用的公共方法，属性等存放在此变量中
        // 用于进度条控制
        $scope.progress = {};
        $scope.progress.value = 0;
        $scope.userName = '未登录';

        var resizeWindow = function () {
            var height = document.documentElement.clientHeight;
            $scope.panelBodyHight = {
                height: height + 'px'
            };
        };

        window.onresize = function () {
            // ng-style不管用
            $('.column_container').css({ height: document.documentElement.clientHeight });
        };

        $scope.backToPre = function () {
            window.location.href = '#/monthTasks?access_token=' + App.Temp.accessToken;
        };

        $scope.loginOut = function () {
            window.location.href = '#/login';
        };

        var catchIsExit = function () {
            return FM.ColumnUtils.getUserAndTaskInfo($scope, $cookies);
        };

        // 高亮点击的菜单
        var menuHighLight = function (id) {
            var i = 0;
            for (; i < $scope.childTaskList.length; i++) {
                var temp = $scope.childTaskList[i];
                temp.select = false;
                if (id === temp.id) {
                    temp.select = true;
                }
            }
        };

        $ocLazyLoad.load('./colEditor/hm/engName/engNameCtrl.js').then(function () {
            $scope.taskListUrl = './colEditor/hm/engName/engNameTpl.html';
        });

        $scope.selectTaskList = function (item) {
            $scope.main.selectedItem = item;
            $scope.main.workType = item.id;
            menuHighLight(item.id);
            $scope.$broadcast('refreshChildrenPage');
        };

        $scope.closeQuaModal = function () {
            $scope.quaModal = false;
        };

        $scope.$on('closeQuaModal', function (event, data) {
            $scope.closeQuaModal();
        });

        // 刷新列表
        $scope.$on('broadcastRefreshPage', function (event, data) {
            $scope.$broadcast('refreshChildrenPage');
        });

        // 全选
        $scope.selectAll = function (dataArr, isChecked) {
            var i = 0;
            for (; i < dataArr.length; i++) {
                dataArr[i].checked = isChecked;
            }
        };

        $scope.applyPoi = function () {
            if ($scope.isQuality) {
                $scope.quaModal = true;
                $ocLazyLoad.load('./colEditor/common/screenQuaDataCtrl.js').then(function () {
                    $scope.quaModalTpl = './colEditor/common/screenQuaDataTpl.html';
                    $timeout(function () {
                        $scope.$broadcast('refreshScreenQua', 'poi_englishname');
                    }, 500);
                });
            } else {
                $scope.showLoading.flag = true;
                var param = {
                    firstWorkItem: 'poi_englishname',
                    secondWorkItem: '' // 精编申请接口二级作业项传递空字符串
                };
                dsColumn.applyPoi(param).then(function (data) {
                    $scope.showLoading.flag = false;
                    if (data == 0) {
                        swal('提示', '无可申请的数据！', 'info');
                    } else {
                        swal('提示', '数据申请成功！', 'info');
                        $scope.queryStatistics();
                        $scope.$broadcast('refreshChildrenPage');
                    }
                });
            }
        };
        $scope.doSubmit = function () {
            $scope.showLoading.flag = true;
            dsColumn.submitData('poi_englishname').then(function (jobId) {
                if (jobId) {
                    var timer = $interval(function () {
                        dsEdit.getJobById(jobId).then(function (data) {
                            if (data.status == 3 || data.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                $scope.showLoading.flag = false;
                                $interval.cancel(timer);
                                if (data.status == 3) {
                                    swal('提示', '数据提交成功！', 'info');
                                    $scope.queryStatistics();
                                    $scope.$broadcast('refreshChildrenPage', { showErrMsg: 1 }); // 表示的是显示错误
                                } else {
                                    swal('提示', '数据提交失败！' + data.resultMsg, 'warning');
                                }
                            }
                        });
                    }, 600);
                } else {
                    $scope.showLoading.flag = false;
                }
            });
        };
        // 查询二级作业项的统计信息
        $scope.queryStatistics = function () {
            var param = {
                firstWorkItem: 'poi_englishname',
                taskId: App.Temp.subTaskId
            };
            dsColumn.querySecondWorkStatistics(param).then(function (data) {
                if (data) {
                    if (data.total) {
                        $scope.totalInfo = data.total.check + '/' + data.total.count;
                    }
                    if (data.details) {
                        var details = data.details;
                        var i = 0;
                        var j = 0;
                        for (;i < $scope.childTaskList.length; i++) {
                            for (j = 0; j < details.length; j++) {
                                if ($scope.childTaskList[i].id === details[j].id) {
                                    $scope.childTaskList[i].num = details[j].check + '/' + details[j].count;
                                    continue;
                                }
                            }
                        }
                    }
                }
            });
        };

        $scope.$on('refreshMianPage', function () {
            $scope.queryStatistics();
        });

        $scope.main.combiSaveParam = function (change) {
            var i = 0;
            var dataList = [];
            for (; i < change.dataList.length; i++) {
                var data = change.dataList[i];
                var param = {};
                param.command = 'UPDATE';
                param.dbId = App.Temp.dbId;
                param.type = 'IXPOI';
                param.objId = data.pid;
                param.data = data;
                dataList.push(param);
            }
            return dataList;
        };

        $scope.$on('refreshMainPage', function () {
            $scope.queryStatistics();
        });

        // 页面初始化方法
        var initPage = function () {
            resizeWindow();
            var flag = catchIsExit();
            if (!flag) {
                return;
            }
            $scope.isQuality = App.Temp.qcTaskFlag;
            // 默认选中第一条
            $scope.selectTaskList($scope.childTaskList[0]);
            $scope.queryStatistics();
        };
        initPage();
    }
]);
