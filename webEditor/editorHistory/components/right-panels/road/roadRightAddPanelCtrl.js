/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('RoadRightAddPanelCtrl', ['$scope', '$rootScope', '$timeout',
    function ($scope, $rootScope, $timeout) {
        var initialize = function (event, data) {
            var geoLiveType = $rootScope.GeoLiveType;
            $scope.objectName = FM.uikit.Config.getName(geoLiveType);
            var attrTmpl = FM.uikit.Config.getAddTemplate(geoLiveType);
            if (attrTmpl) {
                $scope.roadAddTmpl = attrTmpl.tmpl;
                $timeout(function () {
                    $scope.$broadcast('ReloadData', data);
                });
            }
        };

        $scope.$on('RoadRightAddPanelReload', initialize);
    }
]);
