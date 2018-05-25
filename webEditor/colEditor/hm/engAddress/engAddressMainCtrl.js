/**
 * Created by mali on 2018/1/8.
 */

angular.module('app').controller('hmEngAddressMainCtrl', ['$scope', 'ngDialog', '$ocLazyLoad',
    'appPath', 'dsColumn', 'dsEdit', '$interval', '$cookies', '$timeout',
    function ($scope, ngDialog, $ocLazyLoad, appPath, dsColumn, dsEdit, $interval, $cookies, $timeout) {
        $scope.editLines = 10; // 默认一条便于调试
        $scope.showLoading = { flag: false };
        $scope.editAllDataList = [];
        $scope.childTaskList = [{
            id: 'engAddrInvalidChar',
            name: '英文地址非法字符',
            num: '0/0',
            select: true
        }, {
            id: 'portuAddrInvalidChar',
            name: '葡文地址非法字符',
            num: '0/0',
            select: false
        }, {
            id: 'longEngAddress',
            name: '英文地址超长作业',
            num: '0/0',
            select: false
        }, {
            id: 'longPortuAddress',
            name: '葡文地址超长作业',
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

        $scope.closeQuaModal = function () {
            $scope.quaModal = false;
        };

        $scope.$on('closeQuaModal', function (event, data) {
            $scope.closeQuaModal();
        });

        $scope.$on('refreshMainPage', function () {
            $scope.queryStatistics();
        });

        // 刷新列表
        $scope.$on('broadcastRefreshPage', function (event, data) {
            $scope.$broadcast('refreshChildrenPage');
        });
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

        $ocLazyLoad.load('./colEditor/hm/engAddress/engAddressCtrl.js').then(function () {
            $scope.taskListUrl = './colEditor/hm/engAddress/engAddressTpl.html';
        });

        $scope.selectTaskList = function (item) {
            $scope.main.selectedItem = item;
            $scope.main.workType = item.id;
            menuHighLight(item.id);
            $scope.$broadcast('refreshChildrenPage');
        };

        // 全选
        $scope.selectAll = function (dataArr, isChecked) {
            var i = 0;
            for (; i < dataArr.length; i++) {
                dataArr[i].checked = isChecked;
            }
        };
        // 获取当前页要编辑的条数
        $scope.getPerPageEditData = function (allData) {
            // 需要编辑的所有数据
            $scope.editAllDataList = allData;
            if ($scope.editAllDataList.length > $scope.editLines) {
                // 当前页要编辑的数据
                var resultArr = $scope.editAllDataList;
                $scope.currentEditOrig = angular.copy(resultArr);
                $scope.currentEdited = angular.copy(resultArr);
            } else {
                $scope.currentEditOrig = angular.copy($scope.editAllDataList);
                $scope.currentEdited = angular.copy($scope.editAllDataList);
            }
        };

        $scope.applyPoi = function () {
            if ($scope.isQuality) {
                $scope.quaModal = true;
                $ocLazyLoad.load('./colEditor/common/screenQuaDataCtrl.js').then(function () {
                    $scope.quaModalTpl = './colEditor/common/screenQuaDataTpl.html';
                    $timeout(function () {
                        $scope.$broadcast('refreshScreenQua', 'poi_englishaddress');
                    }, 500);
                });
            } else {
                $scope.showLoading.flag = true;
                var param = {
                    firstWorkItem: 'poi_englishaddress',
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
            dsColumn.submitData('poi_englishaddress').then(function (jobId) {
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
                firstWorkItem: 'poi_englishaddress',
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
