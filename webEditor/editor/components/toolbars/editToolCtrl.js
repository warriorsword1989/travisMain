/**
 * Created by wuzhen on 2017/1/12.
 */

angular.module('app').controller('editToolCtrl', ['$scope', '$timeout', 'hotkeys',
    function ($scope, $timeout, hotkeys) {
        var eventCtrl = fastmap.event.EventController.getInstance();
        var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
        var objectEditCtrl = fastmap.uikit.ObjectEditController();
        var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();

        $scope.isOpen = false;
        $scope.isFirstLevel = false;
        $scope.subToolFlag = false;
        $scope.tools = new Array(9);
        $scope.featureTools = [];
        $scope.subTools = [];
        $scope.snapActors = [];
        $scope.activeTool = null;
        var currentEditCtrl = null;
        var lastSelectCtrl = null;

        /**
         * 停止当前的编辑流程=
         * @return {undefined}
         */
        var abortCurrentEditControl = function () {
            $scope.activeTool = null;
            if (currentEditCtrl && currentEditCtrl.status === 'Running') {
                currentEditCtrl.abort();
            }
        };

        /**
         * 清理编辑工具栏
         * @return {undefined}
         */
        var clear = function () {
            abortCurrentEditControl();
            $scope.tools = new Array(9);
            $scope.featureTools = [];
            $scope.snapActors = [];
        };

        var close = function () {
            clear();
            $scope.isOpen = false;
        };
        // 加载相同编辑流程工具;
        var reload = function (event, data) {
            // 创建;
            clear();
            if (data && data.geoLiveType) {
                $scope.isFirstLevel = true;
                $scope.featureTools = FM.uikit.Config.getObjectEditTools(data.geoLiveType);
                var topoEditor = topoEditFactory.createTopoEditor(data.geoLiveType, map);
                var editResult = {};
                if (topoEditor) {
                    editResult = topoEditor.getCreateEditResult();
                }
                var conf = new FM.uikit.Config.EditTool();
                var tool;
                if ($scope.featureTools) {
                    $scope.tools[0] = { text: '撤销', title: '撤销本次操作', type: 'toolFunc' };
                    $scope.tools[1] = { text: '重做', title: '重做工具', type: 'toolFunc' };
                    for (var i = $scope.featureTools.length - 1; i >= 0; i--) {
                        tool = conf.getEditTool($scope.featureTools[i]);
                        if (tool) {
                            $scope.tools.pop();
                            $scope.tools.unshift({
                                text: tool.text,
                                title: tool.title,
                                type: $scope.featureTools[i],
                                editResult: editResult.type
                            });
                        }
                    }
                    $scope.tools[8] = {
                        text: '重置',
                        title: '重置工具',
                        type: 'toolFunc'
                    };
                }
            } else {
                $scope.isFirstLevel = false;
                $scope.featureTools = [];
                $scope.tools = [];
            }
            $scope.isOpen = true;

            if (factory.currentControl instanceof FM.uikit.editControl.SelectControl) {
                lastSelectCtrl = factory.currentControl;
            } else {
                lastSelectCtrl = null;
            }
        };

        $scope.handler = function (tool) {
            if (!tool || tool.type === 'toolFunc') {
                return;
            }

            $scope.testDataChanged().then(function (flag) {
                $scope.activeTool = tool.type;
                var map = sceneCtrl._map.getLeafletMap();
                map.getContainer().focus();
                var ctrl;
                switch ($scope.activeTool) {
                    case 'MODIFY':
                        ctrl = factory.modifyControl(map, {
                            originObject: objectEditCtrl.data
                        });
                        break;
                    case 'MODIFYVIA':
                        if (objectEditCtrl.data.relationshipType == 1) {
                            swal('提示', '路口关系无法修改经过线', 'info');
                            return;
                        }
                        ctrl = factory.modifyViaControl(map, {
                            originObject: objectEditCtrl.data
                        });
                        ctrl.run();
                        break;
                    case 'ADDPAIRBOND': // 配对电子眼
                        ctrl = factory.addPairElectronicEyeControl(map, {
                            originObject: objectEditCtrl.data
                        });
                        break;
                    case 'SELECTPARENT': // 编辑POI的父
                        ctrl = factory.selectPoiParentControl(map, {
                            originObject: objectEditCtrl.data
                        });
                        break;
                    case 'POISAME': // poi同一关系
                        ctrl = factory.samePoiControl(map, {
                            originObject: objectEditCtrl.data
                        });
                        break;
                    case 'DIRECT': // link修改方向
                        ctrl = factory.linkDirectControl(map, {
                            originObject: objectEditCtrl.data
                        });
                        break;
                    case 'DELETECLOSEDVERTEX':
                        ctrl = factory.deleteClosedVertexControl(map, {
                            originObject: objectEditCtrl.data
                        });
                        break;
                    default:
                        swal('按钮功能未实现');
                        return;
                }
                if (!ctrl) {
                    swal('提示', '流程未实现', 'info');
                    return;
                }

                ctrl.run();

                currentEditCtrl = ctrl;
            });
        };

        var showSubTool = function () {
            $scope.subToolFlag = true;
        };

        var hideSubTool = function () {
            $scope.subToolFlag = false;
        };

        var resetSubTools = function (args) {
            $scope.subTools = args.tools;
        };

        var resetSnapActors = function (args) {
            $timeout(function () {
                $scope.snapActors = args.snapActors;
            });
        };

        $scope.onSubToolClick = function (tool) {
            tool.checked = true;
            for (var i = 0; i < $scope.subTools.length; ++i) {
                var item = $scope.subTools[i];
                if (item.toolName !== tool.toolName) {
                    item.checked = false;
                }
            }
            eventCtrl.fire(FM.event.EventTypes.SHAPEEDITTOOLCHANGED, {
                tool: tool
            });
        };

        $scope.onActorCkbClick = function (actor) {
            eventCtrl.fire(FM.event.EventTypes.SHAPEEDITSNAPACTORCHANGED, {
                snapActor: actor
            });
        };

        $scope.deleteFeature = function () {
            $scope.activeToolScope.doDelete();
        };

        /**
         * 绑定快捷键
         * @return {Object} 快捷键对象实例
         */
        var bindHotKeys = function () {
            hotkeys.bindTo($scope).add({
                combo: 'alt+q',
                description: '结束当前流程',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function () {
                    abortCurrentEditControl();
                    if (lastSelectCtrl && lastSelectCtrl.status === 'Aborted') {
                        lastSelectCtrl.run();
                    }
                }
            });
        };
        bindHotKeys();

        eventCtrl.on(FM.event.EventTypes.OPENSHAPEEDITPANEL, showSubTool);
        eventCtrl.on(FM.event.EventTypes.CLOSESHAPEEDITPANEL, hideSubTool);
        eventCtrl.on(FM.event.EventTypes.REFRESHSHAPEEDITPANELTOOLS, resetSubTools);
        eventCtrl.on(FM.event.EventTypes.REFRESHSHAPEEDITPANELSNAPACTORS, resetSnapActors);
        eventCtrl.on('deleteRoadToToolPanel', function (data) {
            $scope.activeToolScope = data.context;
            $scope.activePanelFlag = data.panelType;
        });
        eventCtrl.on('deletePoiToToolPanel', function (data) {
            $scope.activeToolScope = data.context;
            $scope.activePanelFlag = data.panelType;
        });
        eventCtrl.on('deleteRoadBatchToToolPanel', function (data) {
            $scope.activeToolScope = data.context;
            $scope.activePanelFlag = data.panelType;
        });
        eventCtrl.on('deleteIndexToToolPanel', function (data) {
            $scope.activeToolScope = data.context;
            $scope.activePanelFlag = data.panelType;
        });
        $scope.$on('EditTool-Reload', reload);
        $scope.$on('EditTool-Close', close);

        // 目的市防止on多次事件（主要是在退出子任务在进入时会在次on到事件）;
        $scope.$on('$destroy', function () {
            eventCtrl.off('deleteRoadToToolPanel');
            eventCtrl.off('deletePoiToToolPanel');
            eventCtrl.off('deleteRoadBatchToToolPanel');
            eventCtrl.off(FM.event.EventTypes.OPENSHAPEEDITPANEL, showSubTool);
            eventCtrl.off(FM.event.EventTypes.CLOSESHAPEEDITPANEL, hideSubTool);
            eventCtrl.off(FM.event.EventTypes.REFRESHSHAPEEDITPANELTOOLS, resetSubTools);
            eventCtrl.off(FM.event.EventTypes.REFRESHSHAPEEDITPANELSNAPACTORS, resetSnapActors);
        });
    }
]);
