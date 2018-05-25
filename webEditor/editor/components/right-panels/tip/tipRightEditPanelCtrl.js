/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('TipRightEditPanelCtrl', ['$scope', '$rootScope', '$timeout', 'dsFcc',
    function ($scope, $rootScope, $timeout, dsFcc) {
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
                $scope.objectName = FM.uikit.Config.getName(geoLiveType);
                var attrTmpl = FM.uikit.Config.getEditTemplate(geoLiveType);
                if (attrTmpl) {
                    $scope.tipEditTmpl = attrTmpl.tmpl;
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

        $scope.doSave = function () {
            var objectEditCtrl = FM.uikit.ObjectEditController();
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var simpleFeature;
            if (geoLiveType === 'TIPBORDER') {
                simpleFeature = new FM.dataApi.Tip({
                    pid: objectEditCtrl.data.pid,
                    geoLiveType: objectEditCtrl.data.geoLiveType
                });
                // 保存调用方法
                dsFcc.updateJoinBorder(objectEditCtrl.data.rowkey, objectEditCtrl.data.memo).then(function (data) {
                    if (data != -1) {
                        $scope.$emit('ObjectUpdated', {
                            feature: simpleFeature,
                            updateLogs: []
                        });
                    }
                });
            }
        };

        $scope.doDelete = function () {
            var objectEditCtrl = FM.uikit.ObjectEditController();
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var simpleFeature;
            if (geoLiveType === 'TIPBORDER') {
                if (objectEditCtrl.data.t_dStatus == 1) {
                    return;
                }
                simpleFeature = new FM.dataApi.Tip({
                    pid: objectEditCtrl.data.pid,
                    geoLiveType: objectEditCtrl.data.geoLiveType
                });
                dsFcc.deleteJoinBorder(objectEditCtrl.data.rowkey).then(function () {
                    $scope.$emit('ObjectDeleted', {
                        feature: simpleFeature,
                        updateLogs: [{
                            type: 'TIPBORDER'
                        }]
                    });
                });
            }
        };

        $scope.$on('TipRightEditPanelReload', initialize);
    }
]);
