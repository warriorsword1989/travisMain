/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('TipRightAddPanelCtrl', ['$scope', '$rootScope', '$timeout',
    function ($scope, $rootScope, $timeout) {
        var initialize = function () {
            var geoLiveType = $rootScope.CurrentObject.geoLiveType;
            $scope.objectName = FM.uikit.Config.getName(geoLiveType);
            var attrTmpl = FM.uikit.Config.getAddTemplate(geoLiveType);
            if (attrTmpl) {
                $scope.tipAddTmpl = attrTmpl.tmpl;
                $timeout(function () {
                    $scope.$broadcast('ReloadData', {
                        data: $rootScope.CurrentObject
                    });
                });
            }
        };

        $scope.$on('TipRightAddPanelReload', initialize);
    }
]);
