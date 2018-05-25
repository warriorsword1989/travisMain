/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('DialogPanelCtrl', ['$scope', '$timeout',
    function ($scope, $timeout) {
        var initialize = function (event, data) {
            $scope.dialogMiniFlag = false;
            var tmplFile = FM.uikit.Config.getUtilityTemplate(data.type);
            $scope.dialogName = FM.uikit.Config.getUtilityName(data.type);
            $scope.dialogTmpl = tmplFile.tmpl;
            $timeout(function () {
                $scope.$broadcast('ReloadData', data);
            });
        };

        $scope.toggleMini = function () {
            $scope.dialogMiniFlag = !$scope.dialogMiniFlag;
        };
        $scope.closeDialog = function () {
            $scope.dialogTmpl = null;
            $scope.dialogMiniFlag = false;
            $scope.$emit('Dialog-Closed');
        };

        $scope.$on('Dialog-Minimize', function () {
            $scope.dialogMiniFlag = true;
        });

        $scope.$on('DialogPanelReload', initialize);
    }
]);
