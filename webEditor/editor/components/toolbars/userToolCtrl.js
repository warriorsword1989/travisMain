/**
 * Created by zhaohang on 2016/11/22.
 */

angular.module('app').controller('userToolCtrl', ['$rootScope', '$scope', '$ocLazyLoad', 'ngDialog', 'appPath', 'dsEdit', 'dsColumn', 'dsManage', 'dsFcc', '$interval', 'dsOutput', '$timeout',
    function ($rootScope, $scope, $ocLazyLoad, ngDialog, appPath, dsEdit, dsColumn, dsManage, dsFcc, $interval, dsOutput, $timeout) {
        var logMsgCtrl = fastmap.uikit.LogMsgController();
        var eventCtrl = fastmap.event.EventController.getInstance();
        $scope.menuList = []; // 控制菜单是否可用
        $scope.hisVersionList = {};
        /**
         * logHandler
         * @param {String} title 标题
         * @param {function} callBack 回调函数
         * @return {undefined}
        */
        function logHandler(title, callBack) {
            swal({
                title: title,
                type: 'info',
                animation: 'none',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }, function (f) {
                if (f) {
                    if (callBack) callBack();
                }
            });
        }

        // 根据任务是POI还是道路执行不同的检查;
        $scope.showCheckTool = function (flag) {
            if (flag) {
                return;
            }
            // 对于poi采集任务以及一体化采集任务直接调检查;
            if ([0, 2].indexOf(App.Temp.taskType) > -1) {
                logHandler('确认检查？', function () {
                    dsEdit.runCheck(9).then(function (res) {
                        var temp = {
                            itemId: res.data,
                            itemType: 'check',
                            itemRemark: null,
                            itemStatus: false
                        };
                        $rootScope.onLineJobStack = temp;
                        sessionStorage.setItem('ON-LINE-JOB-STACK', JSON.stringify($rootScope.onLineJobStack));
                        $scope.showLoading();
                        // $timeout(function () {
                        //     $scope.hideLoading();
                        // }, 300000);
                    });
                });
            } else if ([3, 4].indexOf(App.Temp.taskType) > -1) { // 对于道路任务则选择道路粗编中的suite包进行检查;
                $scope.$emit('ShowInfoPage', {
                    type: 'CheckJobPanel'
                });
            } else if ([7].indexOf(App.Temp.taskType) > -1) {   // 月编专项
                // if (!$scope.deepListType) {
                //     swal('检查提示', '请打开深度信息列表!', 'warning');
                //     return;
                // }
                // 深度信息只检查待提交数据
                $scope.showLoading();
                var param = {
                    subtaskId: App.Temp.subTaskId,
                    secondWorkItem: App.Temp.SubTask.monthTaskType, // App.Temp.SubTask取自taskCookie
                    firstWorkItem: 'poi_deep',
                    checkType: 2,
                    status: 2
                };
                dsColumn.checkDeepData(param).then(function (jobId) {
                    if (jobId) {
                        var timer = $interval(function () {
                            dsEdit.getJobById(jobId).then(function (data) {
                                if (data.status == 3 || data.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                    $scope.hideLoading();
                                    eventCtrl.fire('refreshDeepInfoTable', { status: $scope.deepListType });
                                    $scope.$emit('refreshPoiViewPanel');
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
                        $scope.hideLoading();
                        swal('检查提示', '在线检查执行失败!', 'warning');
                    }
                });
            } else {
                console.warn('还不支持此类任务的在线检查!');
            }
        };

        $scope.showCheckResult = function (flag) {
            if (flag) {
                return;
            }

            var type = '';

            if ($scope.isRefineTask) {
                type = 'pointAddressPanel';
            } else if ([0, 2].indexOf(App.Temp.taskType) > -1) {   // 对于poi采集任务以及一体化采集任务直接调检查;
                type = 'poiCheckResult';
            } else if ([3, 4].indexOf(App.Temp.taskType) > -1) { // 对于道路任务则选择道路粗编中的suite包进行检查;
                type = 'roadCheckResult';
            } else if ([7].indexOf(App.Temp.taskType) > -1) { // 深度信息（停车场、租赁、通用）
                type = 'poiDeepCheckResult';
            }

            $scope.$emit('ShowInfoPage', { type: type });
        };
        // 批量翻译功能;
        $scope.showBatchTranslate = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'batchTranslatePanel'
            });
        };

        // 消息提醒
        $scope.showMsgAlert = function (flag) {
            if (flag) {
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'messageAlert'
            });
        };
        // 批处理
        $scope.showBatchTool = function (flag) {
            if (flag) {
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'batchJobPanel'
            });
        };
        // 自动化
        $scope.showAutoResult = function (flag) {
            if (flag) {
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'autoJobPanel'
            });
        };
        // 道路名
        $scope.showRoadName = function (flag) {
            if (flag) {
                return;
            }
            ngDialog.open({
                template: '@components/road/tpls/specialwork/roadNameTpl.htm',
                controller: 'RoadNameCtl',
                className: 'fm-fs-ngDialog',
                width: '100%',
                height: '100%',
                closeByEscape: false,
                closeByDocument: false
            });
        };

        var backToPre = function () {
            window.location.href = '#/monthTasks?access_token=' + App.Temp.accessToken;
        };

        // 任务面板
        $scope.showTaskPanel = function (flag) {
            if (flag) {
                return;
            }

            var isMonthTask = ['deepParking', 'deepCarrental', 'deepDetail'].indexOf(App.Temp.monthTaskType) > -1;
            if (isMonthTask) {
                backToPre();    //  深度信息时，点击后返回到上一层
            } else {
                ngDialog.open({
                    template: 'task/taskGeneralPage.html',
                    controller: 'taskGeneralPageCtrl',
                    className: 'ngdialog-theme-default ng-dialog no-overflow',
                    width: '100%',
                    height: '100%',
                    closeByEscape: false,
                    closeByDocument: false,
                    data: {
                        showLogout: false
                    }
                });
            }
        };

        // 子任务类型 0 POI_采集， 1道路_采集， 2一体化_采集， 3一体化_grid粗编_日编， 4一体化_区域粗编_日编， 5 POI粗编_日编， 6代理店，  7 POI专项_月编, 8道路_grid精编， 9道路_grid粗编， 10道路区域专项 11预处理
        var initMenuList = function () {
            var taskType = App.Temp.taskType;
            $scope.isRefineTask = taskType === 2 && App.Temp.workKind === 5;  //  精细化任务，点门牌作业
            $scope.menuList = [];

            if ([0, 2].indexOf(taskType) > -1) { // POI作业
                $scope.menuList = ['taskPanel', 'checking', 'checkResult', 'msgAlert', 'submit', 'trackPhoto'];
            } else if ([3, 4].indexOf(taskType) > -1) { // 道路作业;
                $scope.menuList = ['roadName', 'batch', 'autoEnter', 'taskPanel', 'checking', 'checkResult', 'msgAlert', 'trackPhoto'];
            } else if ([7].indexOf(taskType) > -1) {
                $scope.menuList = ['taskPanel', 'checking', 'checkResult', 'submit'];
            } else {
                $scope.menuList = ['taskPanel', 'trackPhoto'];
            }
        };

        /**
         * POI提交
         * 返回成功后刷新POI列表，重新绘制POI图层
         * @return {undefined}
         */
        $scope.doSubmitData = function () {
            if ([3, 4].indexOf(App.Temp.taskType) > -1) { return; }
            logHandler('确认提交？', function () {
                var subTask = App.Util.getSessionStorage('SubTask');
                $scope.subQuality = subTask.qcTaskFlag;
                var temp = null;
                if ([0, 2].indexOf(App.Temp.taskType) > -1) {
                    dsEdit.submitPoi().then(function (data) {
                        if (data) {
                            temp = {
                                itemId: data,
                                itemType: 'poiSubmit',
                                itemRemark: null,
                                itemStatus: false
                            };
                            $rootScope.onLineJobStack = temp;
                            sessionStorage.setItem('ON-LINE-JOB-STACK', JSON.stringify($rootScope.onLineJobStack));
                            $scope.showLoading();
                            // $timeout(function () {
                            //     $scope.hideLoading();
                            // }, 300000);
                        }
                    });
                } else if ([7].indexOf(App.Temp.taskType) > -1) {   // 月编专项
                    $scope.showLoading();
                    var param = {
                        dbId: App.Temp.dbId,
                        subtaskId: App.Temp.subTaskId,
                        secondWorkItem: App.Temp.monthTaskType, // App.Temp.taskType
                        isQuality: App.Temp.qcTaskFlag
                    };
                    dsColumn.releaseDeepDataList(param).then(function (data) {
                        $scope.hideLoading();
                        if (data) {
                            swal('提示', '提交成功' + data.sucReleaseTotal + '条POI。', 'info');
                            eventCtrl.fire('refreshDeepInfoTable', { status: $scope.deepListType });
                        } else {
                            swal('提示', '提交失败！', 'error');
                        }
                    });
                } else {
                    console.log('此类任务不支持提交');
                }
            });
        };

        /**
         * 精细化采集子任务检查方法
         * @method startCheck
         * @author LiuZhe
         * @date   2017-09-27
         * @param {number} checkType 检查类型
         * @return {undefined}
         */
        $scope.startCheck = function (checkType) {
            logHandler('确认检查？', function () {
                dsEdit.runCheck(checkType).then(function (res) {
                    $rootScope.onLineJobStack = {
                        itemId: res.data,
                        itemType: 'check',
                        itemRemark: null,
                        itemStatus: false
                    };

                    sessionStorage.setItem('ON-LINE-JOB-STACK', JSON.stringify($rootScope.onLineJobStack));
                    $scope.showLoading();
                });
            });
        };

        /**
         * 精细化采集子任务 提交poi or 点门牌
         * @method startCommit
         * @author LiuZhe
         * @date   2017-09-27
         * @param {number} checkType 检查类型
         * @return {undefined}
         */
        $scope.startCommit = function (checkType) {
            logHandler('确认提交？', function () {
                var type = '';
                var promise = null;

                if (checkType === 9) {
                    type = 'poiSubmit';
                    promise = dsEdit.submitPoi();
                } else if (checkType === 6) {
                    type = 'pointAddressSubmit';
                    promise = dsEdit.submitPointAddress();
                }

                promise.then(function (data) {
                    if (data) {
                        $rootScope.onLineJobStack = {
                            itemId: data,
                            itemType: type,
                            itemRemark: null,
                            itemStatus: false
                        };
                        sessionStorage.setItem('ON-LINE-JOB-STACK', JSON.stringify($rootScope.onLineJobStack));
                        $scope.showLoading();
                    }
                });
            });
        };

        var initHisVersion = function () {
            $scope.hisVersionList = {};
            dsManage.getHisVersion().then(function (data) {
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (!$scope.hisVersionList[data[i].seasonVersion]) {
                            $scope.hisVersionList[data[i].seasonVersion] = [];
                        }
                        $scope.hisVersionList[data[i].seasonVersion].push(data[i]);
                    }
                }
            });
        };

        /**
         * 查看历史版本记录
         * @method showHistory
         * @author wuzhen
         * @date   2018-01-05
         * @return {undefined}
         */
        $scope.showHistory = function () {
            $scope.$emit('ShowHistoryVersion', {
                type: 'hisVersionPanel',
                version: $scope.hisVersionList
            });
        };

        /**
         * 打开轨迹照片作业弹窗
         * @method showTrackPanel
         * @param {number} flag disable状态下禁止点击
         * @return {undefined}
         */
        $scope.showTrackPanel = function (flag) {
            if (flag) {
                return;
            }
            
            dsEdit.testLocalService().then(function () {
                $scope.$emit('ShowInfoPage', { type: 'trackInfoPanel' });
            });
        };

        eventCtrl.off('getDeepList');
        // 监听深度信息列表切换
        eventCtrl.on('getDeepList', function (data) {
            $scope.deepListType = data.status;
        });

        var initUserTool = function () {
            initMenuList();
            initHisVersion();
        };

        initUserTool();
    }
]);
