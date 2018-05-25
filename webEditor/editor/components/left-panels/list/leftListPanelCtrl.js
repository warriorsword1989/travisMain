/**
 * Created by wangmingdong on 2017/5/8.
 */

angular.module('app').controller('leftListPanelCtrl', ['$scope', 'dsLazyload', 'uiGridConstants', '$timeout',
    function ($scope, dsLazyload, uiGridConstants, $timeout) {
        var eventController = fastmap.event.EventController.getInstance();
        var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
        var sourceCtrl = fastmap.mapApi.source.SourceController.getInstance();
        // 显示列表类型
        $scope.typeList = [];

        // poi tab名称
        $scope.tabPoiName = [
            { name: '待作业', id: 1 },
            { name: '待提交', id: 2 },
            { name: '已提交', id: 3 }
        ];

        // 质检poi tab名称
        $scope.tabQualityPoiName = [
            { name: '待质检', id: 1 },
            { name: '已质检', id: 2 },
            { name: '已提交', id: 3 }
        ];

        // tips type类型
        $scope.tabTipName = [
            { name: '待作业', id: 1 },
            { name: '已作业', id: 2 },
            { name: '有问题', id: 3 }
        ];

        $scope.tabQualityCheckName = [
            { name: '待质检', id: 1 },
            { name: '已质检', id: 2 },
            { name: '有问题', id: 3 }
        ];

        $scope.initData = function () {
            $scope.tabNames = $scope.tabPoiName;
            $scope.activeType = 1;
            if (App.Temp.taskType == 2 && App.Temp.workKind == 5) {
                var temArr = [{ name: 'POI', id: 1 }, { name: '点门牌', id: 3 }]; // 后面需要提出来];
                $scope.typeList = [];
                temArr.forEach(function (outerItem) {
                    App.Temp.SubTask.dbIds.forEach(function (innerItem) {
                        $scope.typeList.push({ dbId: innerItem, id: outerItem.id, name: outerItem.name + ' - ' + innerItem });
                    });
                });
                var tempArr = $scope.typeList.slice(App.Temp.SubTask.dbIds.length);
                tempArr.forEach(function (item) {
                    if (App.Temp.SubTask.dbId === item.dbId) {
                        $scope.listType = item;
                    }
                });
            } else if (App.Temp.taskType == 0 || (App.Temp.taskType == 2 && App.Temp.workKind != 5)) {
                $scope.typeList = App.Temp.SubTask.dbIds.map(function (item) {
                    return { dbId: item, id: 1, name: 'POI - ' + item };
                });
                $scope.typeList.forEach(function (item) {
                    if (App.Temp.SubTask.dbId === item.dbId) {
                        $scope.listType = item;
                    }
                });
            } else {
                $scope.typeList = App.Temp.SubTask.dbIds.map(function (item) {
                    return { dbId: item, id: 2, name: 'Tips - ' + item };
                });
                $scope.typeList.forEach(function (item) {
                    if (App.Temp.SubTask.dbId === item.dbId) {
                        $scope.listType = item;
                    }
                });
            }
            $scope.selectListType($scope.listType);
        };

        $scope.loadObject = {
            1: {
                name: 'loadPoiListTpl',
                ctrl: './editor/components/left-panels/list/leftPoiListPanelCtrl.js',
                tpl: './editor/components/left-panels/list/leftPoiListPanelTmpl.htm'
            },
            2: {
                name: 'loadTipsListTpl',
                ctrl: './editor/components/left-panels/list/leftTipsListPanelCtrl.js',
                tpl: './editor/components/left-panels/list/leftTipsListPanelTmpl.htm'
            },
            3: {
                name: 'loadPointAddressListTpl',
                ctrl: './editor/components/left-panels/list/leftPointAddressListPanelCtrl.js',
                tpl: './editor/components/left-panels/list/leftPointAddressListPanelTmpl.htm'
            }
        };

        // 切换显示列表类型
        $scope.selectListType = function (type) {
            $scope.listType = type;
            // 更新当前激活的dbId以及dbId对应的meshes,然后刷新对应的overLayer;
            if (type.dbId != App.Temp.SubTask.dbId) {
                App.Util.refreshDbId(type.dbId);
                // 切换当前dbid对应的遮罩；
                sceneCtrl.removeFromOverlay('overlay');
                sceneCtrl.addToOverlay(new FM.mapApi.scene.SceneLayer('overlay', App.Config.map.ReferenceLayers.overlay));
                sceneCtrl.refreshOverlay();
                // 重新设置请求初始化的dbid;
                sourceCtrl.getAllSources().forEach(function (sourceItem) {
                    if (sourceItem.getParameter('dbId')) {
                        sourceItem.setParameter('dbId', App.Temp.SubTask.dbId);
                    }
                });
            }
            dsLazyload.loadInclude($scope, $scope.loadObject[type.id].name, $scope.loadObject[type.id].ctrl, $scope.loadObject[type.id].tpl)
            .then(function () {
                if (type.id == 1) {
                    // 区分质检和常规tab 判断是否显示筛选按钮
                    if (App.Temp.qcTaskFlag) {
                        $scope.tabNames = $scope.tabQualityPoiName;
                        $scope.allowPoiFilter = true;
                    } else {
                        $scope.tabNames = $scope.tabPoiName;
                        $scope.allowPoiFilter = false;
                    }
                    $scope.$emit('LeftPanelFullAndLeft', false);
                    $scope.$emit('RefreshWorkGeo', 'POI');
                    // 为了ctrl和tpl加载后切换下拉列表的事件发送;
                    $scope.$broadcast('resetTableHead', $scope.activeType);
                    $scope.$broadcast('refreshTable', $scope.activeType);
                }
                if (type.id == 2) {
                    if (App.Temp.qcTaskFlag) {
                        $scope.tabNames = $scope.tabQualityCheckName;
                    } else {
                        $scope.tabNames = $scope.tabTipName;
                    }
                    $scope.activeType = 1;
                    $scope.listTitleContainerStyle = {
                        'background-image': "url('../../images/webEditor/left-panel/bg2.png')",
                        width: '300px'
                    };
                    $scope.leftPanelFull = false;
                    $scope.$emit('LeftPanelFullAndLeft', false);
                    $scope.$broadcast('refreshTable', $scope.activeType);
                }
                if (type.id == 3) {
                    $scope.tabNames = $scope.tabPoiName;
                    $scope.$emit('LeftPanelFullAndLeft', false);
                    $scope.$emit('RefreshWorkGeo', 'POINTADDRESS');
                    $scope.$broadcast('resetTableHead', $scope.activeType);
                    $scope.$broadcast('refreshTable', $scope.activeType);
                }
            });
        };

        // 回车搜索POI
        $scope.doSearchParPoiList = function (e) {
            var code = e.keyCode;
            if (code == 13 && ($scope.listType.id == 1 || $scope.listType.id == 3)) { // 按enter键时触发，并且只对poi标签有效
                $scope.searchParContent();
            }
        };
        
        // 搜索POI
        $scope.searchParContent = function () {
            if ($scope.listType.id == 1 || $scope.listType.id == 3) {
                $scope.$broadcast('getSearchTable', $scope.searchParText);
            }
        };

        // 切换作业类型
        $scope.changeType = function (type) {
            $scope.activeType = type;
            $scope.$broadcast('refreshTable', type);
        };

        $scope.openTipList = function () {
            eventController.fire(FM.event.EventTypes.PARTSOPENPANEL, { panelName: 'tipListPanel' });
        };

        // 打开poi筛选弹窗
        $scope.openPoiFilter = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'poiFilterPanel'
            });
        };

        $scope.initData();

        // 切换大小样式变化
        $scope.$on('LeftPanelFullAndLeft', function (event, data) {
            if (data.flag) {
                $scope.listTitleContainerStyle = {
                    'background-image': "url('../../images/webEditor/left-panel/bg.png')",
                    width: '100%'
                };
            } else {
                $scope.listTitleContainerStyle = {
                    'background-image': "url('../../images/webEditor/left-panel/bg2.png')",
                    width: '300px'
                };
            }
            $scope.leftPanelFull = data.flag;
            $scope.childScope = data.childScope;
        });

        $scope.toggleVisible = function () {
            $scope.childScope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        // 重置activeType
        $scope.$on('resetActiveType', function (event, data) {
            $scope.activeType = data;
        });
    }
]);
