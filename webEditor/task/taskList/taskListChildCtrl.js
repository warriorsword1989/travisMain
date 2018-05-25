/**
 * Created by zhaohang on 2016/12/6.
 */

angular.module('app').controller('taskListChildCtrl', ['$scope', 'ngDialog', 'dsManage', 'dsFcc', '$timeout', 'dsColumn',
    function ($scope, ngDialog, dsManage, dsFcc, $timeout, dsColumn) {
        var width = document.documentElement.clientWidth - 240;
        var taskNum = parseInt((width - 15) / 315, 10);
        var taskLength = width - taskNum * 300;
        $scope.taskListMargin = {
            'margin-left': taskLength / (taskNum + 1) + 'px'
        };

        $scope.taskListData = [];
        $scope.currentTipsTypes = 0;
        $scope.currentTipsNum = 0;

        // 显示子任务;
        var getChildTaskList = function (data) {
            $scope.taskListData.length = 0;
            $timeout(function () {
                $scope.taskListData = FM.Util.clone(data.datas);

                for (var i = 0, len = $scope.taskListData.length; i < len; i++) {
                    $scope.taskListData[i].isOld = $scope.taskListData[i].subtaskId === App.Temp.subTaskId;
                }
            });
        };


        // 抽取日线tips质检;
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
            dsManage.getSubtaskById(item.subtaskId)
                .then(function (data) {
                    if (data) {
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
                        });
                    }
                });
        };

        // 选中子任务
        $scope.selectSubTask = function (item) {
            if (item.type === 8 || item.type === 9) { // 暂时对月编-道路grid精编和月编-道路grid粗编的特殊处理
                return;
            }

            // 如果是质检任务，且未申请数据，则不允许进入编辑   (!item.isExtract)
            if ((item.type == 3 || item.type == 4) && item.isQuality == 1 && (!item.isExtract)) {
                swal('提示', '请先申请质检数据！', 'warning');
                return;
            }

            dsManage.getSubtaskById(item.subtaskId).then(function (data) {
                if (data) {
                    App.Temp.dbId = data.dbId;
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

                    App.Temp.SubTask = {
                        dbId: App.Temp.dbId,
                        subTaskId: App.Temp.subTaskId,
                        taskName: App.Temp.subTaskName,
                        taskType: App.Temp.taskType,
                        programType: App.Temp.programType,
                        gridList: data.gridIds || [],
                        meshList: data.meshes || [],
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

        // 提交子任务
        var pushSubTask = function (item) {
            if (item.stage === 1 && (item.type === 3 || item.type === 4) && item.isQuality === 1) {
                dsFcc.closeQualityCheckTask(item.subtaskId)
                    .then(function () {
                        return dsManage.submitTask(item.subtaskId);
                    })
                    .then(function (data) {
                        if (data) {
                            $scope.$emit('pushTaskList');
                        }
                    });
            } else {
                dsManage.submitTask(item.subtaskId).then(function (res) {
                    if (res) {
                        $scope.$emit('pushTaskList');
                    }
                });
            }
        };

        // 关闭弹窗
        var comformCloseDialog = function (item) {
            swal({
                title: '确认关闭此任务？',
                showCancelButton: true,
                allowEscapeKey: false,
                confirmButtonText: '是的，我要关闭',
                confirmButtonColor: '#ec6c62',
                closeOnConfirm: false,  // 如果还有二级弹窗，需要此配置
                showLoaderOnConfirm: true
            }, function (f) {
                if (f) {
                    pushSubTask(item);
                }
            });
        };

        // 配置key的中文名称
        var poiKeyName = {
            poi_name: '中文名称',
            poi_englishname: '英文名称',
            poi_englishaddress: '英文地址',
            poi_address: '中文地址',
            deepParking: '停车场',
            deepDetail: '通用深度',
            deepCarrental: '汽车租赁'
        };

        // 关闭任务
        $scope.submitTask = function (e, item) {
            e.stopPropagation();
            // poi采集和一体化采集关闭必须待作业和已作业为0
            if (item.type == 0 || item.type == 2) {
                if (item.workKind == 5) { // 点门牌任务
                    if (item.poiWaitWork != 0 || item.poiWorked != 0 || item.pointWaitWork != 0 || item.pointWorked != 0) {
                        swal('提示', '待作业POI、点门牌或待提交POI、点门牌不为0，无法关闭！', 'warning');
                        return;
                    }
                } else {
                    if (item.poiWaitWork != 0 || item.poiWorked != 0) {
                        swal('提示', '待作业POI或待提交POI不为0，无法关闭！', 'warning');
                        return;
                    }
                }
            }

            // type为7时，所有项必须都为0才可关闭
            if (item.type == 7) {
                dsColumn.querySubtaskStatics(item.subtaskId).then(function (data) {
                    if (data) {
                        swal('提示', '存在未提交的数据或库存log不为 0 ，不可关闭！', 'warning');
                    } else {
                        comformCloseDialog(item);
                    }
                });
            } else {
                comformCloseDialog(item);
            }
        };

        // 监听父点击事件
        $scope.$on('queryTaskList', function (event, data) {
            getChildTaskList(data);
        });
    }
]);
