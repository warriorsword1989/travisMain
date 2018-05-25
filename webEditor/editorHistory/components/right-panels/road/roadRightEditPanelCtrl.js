/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('RoadRightEditPanelCtrl', ['$scope', '$rootScope', '$timeout', 'dsEdit',
    function ($scope, $rootScope, $timeout, dsEdit) {
        var eventCtrl = fastmap.event.EventController.getInstance();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        var topoEditor = null;
        $scope.deletable = true;

        var initialize = function () {
            if ($rootScope.CurrentObject) {
                var geoLiveType = $rootScope.CurrentObject.geoLiveType;
                topoEditor = topoEditFactory.createTopoEditor(geoLiveType, null);
                if (!topoEditor) {
                    swal({
                        title: geoLiveType + '类型要素未实现topoEditor!',
                        type: 'error',
                        allowEscapeKey: false
                    });
                    return;
                }
                $scope.objectPid = topoEditor.getId($rootScope.CurrentObject);
                $scope.objectName = FM.uikit.Config.getName(geoLiveType);
                var attrTmpl = FM.uikit.Config.getEditTemplate(geoLiveType);
                if (attrTmpl) {
                    $scope.roadEditTmpl = attrTmpl.tmpl;
                    $timeout(function () {
                        $scope.$broadcast('ReloadData', {
                            data: $rootScope.CurrentObject
                        });
                    });
                }

                $scope.editable = $rootScope.Editable && topoEditor.canEdit($rootScope.CurrentObject);
                $scope.deletable = topoEditor.canDelete($rootScope.CurrentObject);
                // 道路要素不可删除时，依然可以编辑
                $scope.fmFormEditable = $scope.editable;
                eventCtrl.fire('deleteRoadToToolPanel', {
                    context: $scope,
                    panelType: 'singlePanel'
                });
            }
        };

        $scope.$on('RoadRightEditPanelReload', initialize);
    }
]);
