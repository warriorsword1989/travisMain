/**
 * Created by zhaohang on 2016/11/1.
 */

angular.module('app').controller('taskMainMapCtrl', ['$scope', 'ngDialog', '$rootScope',
    function ($scope, ngDialog, $rootScope) {
        if (!$scope.testLogin()) {
            return;
        }

        $scope.showModalTest = function () {
            ngDialog.open({
                template: 'task/taskGeneralPage.html',
                controller: 'taskGeneralPageCtrl',
                className: 'ngdialog-theme-default ng-dialog no-overflow',
                width: '100%',
                height: '100%',
                closeByEscape: false,
                showClose: false,
                closeByDocument: false,
                data: {
                    showLogout: true
                }
            });
        };

        $scope.showModalTest();

        $scope.$on('$destroy', function () {
            var opens = ngDialog.getOpenDialogs();
            if (opens && opens.length > 0) {
                ngDialog.closeAll();
            }
        });
    }
]);
