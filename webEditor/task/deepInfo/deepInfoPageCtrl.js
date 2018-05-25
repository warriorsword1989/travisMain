/**
 * Created by liuyang on 2016/12/7.
 */

angular.module('app').controller('deepInfoPageCtrl', ['$scope', '$rootScope', 'ngDialog', 'dsColumn',
    function ($scope, $rootScope, ngDialog, dsColumn) {
        // if (!$scope.testLogin()) {
        //     return;
        // }

        // if (!$scope.testTask()) {
        //     return;
        // }

        $scope.deepTablUrl = './task/deepInfo/deepInfoTable.html';
        $scope.showLoading = {
            flag: false
        };
        $scope.userName = '';
        $scope.taskDesc = {
            name: '',
            undoNum: 0,
            doneNum: 0
        };

        $scope.getDeepSum = function () {
            var subtaskId = App.Temp.subTaskId;
            var type = App.Temp.monthTaskType;
            if (type === 'deepParking') {
                $scope.taskDesc.name = '停车场';
            } else if (type === 'deepCarrental') {
                $scope.taskDesc.name = '租赁';
            } else if (type === 'deepDetail') {
                $scope.taskDesc.name = '通用';
            }
            var param = {
                firstWorkItem: 'poi_deep',
                taskId: subtaskId
            };
            dsColumn.querySecondWorkStatistics(param).then(function (data) {
                if (data) {
                    for (var i = 0; i < data.details.length; i++) {
                        if (data.details[i].id === type) {
                            $scope.taskDesc.doneNum = data.details[i].check;
                            $scope.taskDesc.undoNum = data.details[i].count - data.details[i].check;
                        }
                    }
                }
            });
        };
        $scope.getDeepSum();
        $scope.$on('freshList', function () {
            $scope.getDeepSum();
        });

        $scope.backToPre = function () {
            var token = App.Temp.accessToken;
            var id = ngDialog.getOpenDialogs()[0];
            ngDialog.close();
            $rootScope.$on('ngDialog.closed', function (e, $dialog) {
                if ($dialog.attr('id') === id) {
                    window.location.href = '#/monthTasks?access_token=' + token;
                }
            });
        };

        $scope.logout = function () {
            var id = ngDialog.getOpenDialogs()[0];
            ngDialog.close();
            $rootScope.$on('ngDialog.closed', function (e, $dialog) {
                if ($dialog.attr('id') === id) {
                    window.location.href = '#/login';
                }
            });
        };
    }
]);
