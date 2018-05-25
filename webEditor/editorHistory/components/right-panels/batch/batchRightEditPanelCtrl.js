/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('BatchRightEditPanelCtrl', ['$scope', '$rootScope', '$timeout', 'dsEdit',
    function ($scope, $rootScope, $timeout, dsEdit) {
        var initialize = function (event, data) {
            if ($rootScope.CurrentObject) {
                var geoLiveType = $rootScope.CurrentObject.geoLiveType;
                $scope.objectName = FM.uikit.Config.getName(geoLiveType);
                var attrTmpl = FM.uikit.Config.getEditTemplate(geoLiveType);
                if (attrTmpl) {
                    $scope.batchEditTmpl = attrTmpl.tmpl;
                    $timeout(function () {
                        $scope.$broadcast('ReloadData', {
                            data: $rootScope.CurrentObject
                        });
                    });
                }
            }
        };

        $scope.$on('BatchRightEditPanelReload', initialize);
    }
]);
