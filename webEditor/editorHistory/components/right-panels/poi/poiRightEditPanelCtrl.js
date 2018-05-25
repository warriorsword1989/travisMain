/**
 * Created by zhaohang on 2016/11/10.
 */

angular.module('app').controller('PoiRightEditPanelCtrl', ['$scope', '$rootScope', 'dsLazyload',
    'appPath', 'dsEdit', 'dsColumn', '$timeout', 'hotkeys',
    function ($scope, $rootScope, dsLazyload, appPath, dsEdit, dsColumn, $timeout, hotkeys) {
        var eventCtrl = fastmap.event.EventController.getInstance();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        var topoEditor = topoEditFactory.createTopoEditor('IXPOI', null);
        $scope.deletable = true;

        /* 审核状态*/
        $scope.statusObject = {
            1: '待作业',
            2: '待提交',
            3: '已提交'
        };
        $scope.statusQuaObject = {
            1: '待质检',
            2: '已质检',
            3: '已提交'
        };

        var initialize = function () {
            if ($rootScope.CurrentObject) {
                $scope.fmFormEditable = $rootScope.Editable;
                if (App.Temp.monthTaskType) {
                    $scope.deletable = false;
                    $scope.poiEditTmpl = '@components/index/poi/tpls/attr-base/deepInfoTpl.html';
                } else {
                    $scope.poiEditTmpl = '@components/index/poi/tpls/attr-base/generalBaseTpl.html';
                }
                $timeout(function () {
                    $scope.$broadcast('ReloadData', {
                        data: $rootScope.CurrentObject
                    });
                });

                $scope.editable = $rootScope.Editable;
                $scope.deletable = topoEditor.canDelete($rootScope.CurrentObject);
                $scope.taskCookie = App.Util.getSessionStorage('SubTask');
                // POI不可删除时，也不能进行编辑，但是可以进行保存
                $scope.fmFormEditable = $rootScope.Editable && topoEditor.canEdit($rootScope.CurrentObject) && $scope.deletable;

                eventCtrl.fire('deletePoiToToolPanel', {
                    context: $scope,
                    panelType: 'singlePanel'
                });
            }
        };

        $scope.$on('PoiRightEditPanelReload', initialize);

        $scope.$on('$destroy', function () {
        });
    }
]);
