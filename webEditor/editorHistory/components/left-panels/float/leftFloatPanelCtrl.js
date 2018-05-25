/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('LeftFloatPanelCtrl', ['$scope', '$timeout',
    function ($scope, $timeout) {
        var initialize = function (event, data) {
            var tmplFile = FM.uikit.Config.getUtilityTemplate(data.type);
            $scope.pageTmpl = tmplFile.tmpl;
            $timeout(function () {
                $scope.$broadcast('ReloadData', data.data);
            });
        };

        $scope.$on('LeftFloatPanelReload', initialize);
    }
]);
