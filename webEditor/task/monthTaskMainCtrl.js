/**
 * Created by wuzhen on 2016/12/6.
 */

angular.module('app').controller('monthTaskMainCtrl', ['$scope', 'ngDialog', 'dsColumn', 'dsManage',
    function ($scope, ngDialog, dsColumn, dsManage) {
        if (!$scope.testLogin()) {
            return;
        }

        if (!$scope.testTask()) {
            return;
        }
        $scope.subtaskName = FM.ColumnUtils.config.workBatch[App.Temp.subTaskId];
        $scope.qcWorkType = App.Temp.qcTaskFlag == 1 ? '质检' : '作业';
        $scope.flag = false;

        // 根据屏幕计算高度
        // var height = document.documentElement.clientHeight;
        // var width = document.documentElement.clientWidth;
        // var percent = height / 1019;
        //
        // $scope.mapBackGround = {
        //     'padding-top': (height - (1000 * percent)) / 2 + 'px',
        //     width: width + 'px',
        //     height: height + 'px',
        //     position: 'absolute'
        // };

        var resizeWindow = function () {
            var height = document.documentElement.clientHeight;
            $scope.panelBodyHight = {
                height: height + 'px'
            };
        };

        window.onresize = function () {
            // ng-style不管用
            $('.column_container').css({
                height: document.documentElement.clientHeight
            });
        };

        $scope.subTaskKinds = [
            // make eslint happy
            {
                label: '中文名称',
                workType: 'poi_name',
                kcLog: 0,
                flag: 0,
                select: true
            }, {
                label: '英文名称',
                workType: 'poi_englishname',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '中文地址',
                workType: 'poi_address',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '英文地址',
                workType: 'poi_englishaddress',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '深度信息-停车场',
                workType: 'deepParking',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '深度信息-汽车租赁',
                workType: 'deepCarrental',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '深度信息-通用深度',
                workType: 'deepDetail',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '点门牌-中文',
                workType: 'pointAddr_chiAddr',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '点门牌-英文',
                workType: 'pointAddr_engAddr',
                kcLog: 0,
                flag: 0,
                select: false
            }
            // {
            //     label: '点位调整-开发中',
            //     workType: '',
            //     kcLog: 0,
            //     flag: 0,
            //     select: false
            // }, {
            //     label: '后期专项-开发中',
            //     workType: '',
            //     kcLog: 0,
            //     flag: 0,
            //     select: false
            // }, {
            //     label: '月后批处理-开发中',
            //     workType: '',
            //     kcLog: 0,
            //     flag: 0,
            //     select: false
            // }, {
            //     label: '区域检查专项-开发中',
            //     workType: '',
            //     kcLog: 0,
            //     flag: 0,
            //     select: false
            // }
            //     {
            //     label: '敏感信息处理-开发中',
            //     workType: '',
            //     kcLog: 0,
            //     flag: 0,
            //     select: false
            // }
        ];

        $scope.workType = $scope.subTaskKinds[0].id; // 默认选中名称类

        $scope.selectWorkType = function (item) {
            if (item.noEvent) {
                return;
            }
            for (var i = 0; i < $scope.subTaskKinds.length; i++) {
                $scope.subTaskKinds[i].select = false;
                item.select = true;
            }
            sessionStorage.setItem('FM-Quality-one-level', JSON.stringify({
                label: item.label,
                workType: item.workType
            }));
            if (item.label.indexOf('深度信息') == -1) {
                $scope.openMonthEditor(item.workType);
            } else {
                App.Temp.monthTaskType = item.workType;
                App.Temp.SubTask.monthTaskType = item.workType;
                App.Util.setSessionStorage('SubTask', App.Temp.SubTask);
                window.location.href = '#/editor?access_token=' + App.Temp.accessToken + '&random=' + (new Date()).getTime();
            }
        };

        $scope.closePanel = function () {
            $scope.flag = false;
        };

        $scope.showStatistics = function () {
            dsColumn.queryStatistics(App.Temp.subTaskId).then(function (res) {
                $scope.rows = res;
                $scope.flag = true;
            });
        };

        // 打开任务列表
        $scope.goTaskMenu = function () {
            ngDialog.open({
                template: 'task/taskGeneralPage.html',
                controller: 'taskGeneralPageCtrl',
                className: 'ngdialog-theme-default',
                width: '100%',
                height: '100%',
                closeByEscape: false,
                closeByDocument: false
            });
        };

        $scope.openMonthEditor = function (workType) {
            var route;
            if (workType === 'deepCarrental' || workType === 'deepDetail' || workType === 'deepParking') {
                route = '#/deepInfo';
            } else if (workType === 'poi_name') {
                route = '#/chinaNameTask_' + App.Temp.accessType;
            } else if (workType === 'poi_address') {
                route = '#/chinaAddressTask_' + App.Temp.accessType;
            } else if (workType === 'poi_englishname') {
                route = '#/engNameTask_' + App.Temp.accessType;
            } else if (workType === 'poi_englishaddress') {
                route = '#/engAddressTask_' + App.Temp.accessType;
            } else if (workType === 'pointAddr_chiAddr') {
                route = '#/pointAddrChi';
            } else if (workType === 'pointAddr_engAddr') {
                route = '#/pointAddrEng';
            } else {
                route = '#/editor';
            }
            App.Temp.monthTaskType = workType;
            App.Temp.SubTask.monthTaskType = workType;
            App.Util.setSessionStorage('SubTask', App.Temp.SubTask);

            window.location.href = route + '?access_token=' + App.Temp.accessToken;
        };

        var initSubTaskList = function () {
            // 如果是质检，屏蔽深度信息
            if (App.Temp.qcTaskFlag) {
                for (var i = 0; i < $scope.subTaskKinds.length; i++) {
                    if ($scope.subTaskKinds[i].workType == 'deepParking' || $scope.subTaskKinds[i].workType == 'deepCarrental' ||
                        $scope.subTaskKinds[i].workType == 'deepDetail') {
                        $scope.subTaskKinds[i].label += '-开发中';
                        $scope.subTaskKinds[i].noEvent = true;
                        $scope.subTaskKinds[i].flag = 0;
                        $scope.subTaskKinds[i].kcLog = 0;
                    }
                }
            }
        };

        var highlightOldWorkType = function () {
            if (App.Temp.monthTaskType) {
                for (var i = 0, len = $scope.subTaskKinds.length; i < len; i++) {
                    var item = $scope.subTaskKinds[i];

                    // 如果oldWorkType存在，并且不是第一项；(因为默认情况是第一个item处于选中状态)
                    if (item.workType === App.Temp.monthTaskType && item.workType !== 'poi_name') {
                        item.select = true;
                        $scope.subTaskKinds[0].select = false;
                    }
                }
            }
        };

      /**
       * 在线检查
       * @return {undefined}
       */
        function initPage() {
            // initSubTaskList();
            resizeWindow();
            highlightOldWorkType();
            dsColumn.queryKcLog(App.Temp.subTaskId).then(function (res) {
                if (res) {
                    $scope.workItemLog = res;
                    for (var i = 0; i < $scope.subTaskKinds.length; i++) {
                        if (res[$scope.subTaskKinds[i].workType]) {
                            $scope.subTaskKinds[i].kcLog = res[$scope.subTaskKinds[i].workType].kcLog;
                            $scope.subTaskKinds[i].flag = res[$scope.subTaskKinds[i].workType].flag;
                        }
                    }

                    // initSubTaskList();
                }
            });
            // 查询子任务名称
            var param = {
                platForm: 1,
                snapshot: 1,
                status: 1,
                pageSize: 1000
            };
            dsManage.getSubtaskListByUser(param).then(function (data) {
                if (data.errcode === 0) {
                    for (var i = 0; i < data.data.result.length; i++) {
                        var temp = data.data.result[i];
                        if (temp.subtaskId == App.Temp.subTaskId) {
                            App.Temp.subtaskName = temp.name;
                            App.Temp.subTaskId = temp.subtaskId;
                            $scope.subtaskName = App.Temp.subtaskName;
                            $scope.subTaskId = App.Temp.subTaskId;
                        }
                    }
                }
            });
        }

        initPage();

        $scope.$on('$destroy', function () {
            var opens = ngDialog.getOpenDialogs();
            if (opens && opens.length > 0) {
                ngDialog.closeAll();
            }
        });
    }
]);
