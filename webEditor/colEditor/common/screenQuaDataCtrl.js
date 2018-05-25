/**
 * Created by wangmingdong on 2017/5/25.
 */

angular.module('app').controller('screenQuaDataCtrl', ['$scope', 'dsColumn',
    function ($scope, dsColumn) {
        /**
         * 切换作业员
         * @param {String} op 操作员
         * @return {undefined}
         */
        $scope.changeOperator = function (op) {
            var i;
            if (op != 0) {
                $scope.selectOperater = [];
                for (i = 0; i < $scope.operatorArray.length; i++) {
                    if ($scope.operatorArray[i].userId == op) {
                        $scope.quaLevel = $scope.operatorArray[i].level;
                        $scope.selectOperater.push($scope.operatorArray[i].userId);
                    }
                }
                $scope.opType = 1;
            } else {
                $scope.quaLevel = $scope.operatorLevel[0];
                $scope.opType = -1;
            }
        };

        /**
         * 切换等级
         * @param {number} lv 等级
         * @return {undefined}
         */
        $scope.changeLevel = function (lv) {
            if (lv != 0) {
                $scope.quaOperator = $scope.operatorArray[0].userId;
                $scope.opType = -1;
                $scope.selectOperater = [];
                for (var i = 0; i < $scope.operatorArray.length; i++) {
                    if ($scope.operatorArray[i].level == lv) {
                        $scope.selectOperater.push($scope.operatorArray[i].userId);
                    }
                }
            } else {
                $scope.opType = 1;
            }
        };

        /**
         * 申请数据
         * @return {undefined}
         */
        $scope.doApply = function () {
            $scope.showLoading.flag = true;
            var param = {
                firstWorkItem: $scope.firstType,
                secondWorkItem: '', // 精编申请接口二级作业项传递空字符串
                conditions: {
                    commenUserId: $scope.selectOperater.join(','),
                    startTime: $scope.workTimeBegin ? Utils.newDateFormat(new Date($scope.workTimeBegin), 'yyyyMMdd') + '0000' : '',
                    endTime: $scope.workTimeEnd ? Utils.newDateFormat(new Date($scope.workTimeEnd), 'yyyyMMdd') + '2359' : ''
                }
            };
            dsColumn.applyPoi(param).then(function (data) {
                $scope.showLoading.flag = false;
                if (data == 0) {
                    swal('提示', '无可申请的数据！', 'info');
                } else {
                    swal('提示', '数据申请成功！', 'info');
                    $scope.$emit('refreshMainPage');
                    $scope.$emit('broadcastRefreshPage');
                }
                $scope.$emit('closeQuaModal', true);
            });
        };

        /**
         * 页面初始化方法
         * @return {undefined}
         */
        var initPage = function () {
            $scope.selectOperater = []; // 所选操作员
            // 获取常规作业员下拉列表
            dsColumn.queryWorkerList(App.Temp.subTaskId).then(function (res) {
                if (res.length) {
                    $scope.operatorArray = res;
                } else {
                    $scope.operatorArray = [];
                }
                $scope.operatorLevel = [];
                for (var i = 0; i < $scope.operatorArray.length; i++) {
                    $scope.operatorArray[i].content = $scope.operatorArray[i].userId + '+' + $scope.operatorArray[i].name;
                    if ($scope.operatorLevel.indexOf($scope.operatorArray[i].level) == -1) {
                        $scope.operatorLevel.push($scope.operatorArray[i].level);
                    }
                }
                $scope.operatorLevel.unshift('请选择');
                $scope.operatorArray.unshift({
                    content: '请选择',
                    userId: ''
                });
                // 默认值
                $scope.quaOperator = $scope.operatorArray[0].userId;
                $scope.quaLevel = $scope.operatorLevel[0];
                $scope.opType = 0;
            });
        };

        $scope.$on('refreshScreenQua', function (event, data) {
            $scope.firstType = data;
            initPage();
        });
    }
]);
