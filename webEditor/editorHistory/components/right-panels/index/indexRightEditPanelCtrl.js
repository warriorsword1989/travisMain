/**
 * index右侧面板容器ctrl
 * @file       indexRightEditPanelCtrl.js
 * @author  mali
 * @date    2017-09-28
 *
 * @copyright @Navinfo, all rights reserved.
 */

angular.module('app').controller('indexRightEditPanelCtrl', ['$scope', '$rootScope', '$timeout', 'dsEdit',
    function ($scope, $rootScope, $timeout, dsEdit) {
        var eventCtrl = fastmap.event.EventController.getInstance();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        var topoEditor = null;
        $scope.deletable = true;

        /* 审核状态*/
        $scope.statusObject = {
            1: '待作业',
            2: '待提交',
            3: '已提交'
        };
        
        var initialize = function () {
            if ($rootScope.CurrentObject.state == 2) { // 提交、删除状态的index不允许编辑   state --1新增，2删除 3修改
                $rootScope.isSpecialOperation = true;
            } else {
                $rootScope.isSpecialOperation = false;
            }
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
                    $scope.indexEditTmpl = attrTmpl.tmpl;
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
                eventCtrl.fire('deleteIndexToToolPanel', {
                    context: $scope,
                    panelType: 'singlePanel'
                });
            }
        };

        $scope.$on('IndexRightEditPanelReload', initialize);
    }
]);
