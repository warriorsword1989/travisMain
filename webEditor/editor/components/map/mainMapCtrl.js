/**
 * Created by zhaohang on 2016/11/22.
 */

angular.module('app').controller('mainMapCtrl', ['$scope', '$cookies', '$q', '$timeout', '$ocLazyLoad', 'hotkeys',
    'dsLazyload', 'appPath',
    function ($scope, $cookies, $q, $timeout, $ocLazyLoad, hotkeys, dsLazyload, appPath) {
        if (!$scope.testLogin()) {
            return;
        }
        if (!$scope.testTask()) {
            return;
        }
        var eventCtrl = fastmap.event.EventController.getInstance();
        var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
        var idHighlightCtrl = fastmap.mapApi.render.IDHighlightController.getInstance();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();
        var shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
        var sourceCtrl = fastmap.mapApi.source.SourceController.getInstance();
        var featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        var snapCtrl = fastmap.mapApi.snap.SnapController.getInstance();
        var toolCtrl = fastmap.uikit.ToolController.getInstance();
        var geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var meshAlgm = fastmap.mapApi.MeshAlgorithm.getInstance();

        var taskFeedback = new fastmap.mapApi.Feedback();
        feedbackCtrl.add(taskFeedback);

        var layerCtrl;

        $scope.selectTool = {
            name: 'PAN' // 默认是漫游工具 ，此变量用于控制正在使用的功能的背景加深显示
        };

        // 加载各种配置文件
        var loadConfigs = function () {
            symbolFactory.loadSymbols(App.Config.symbols);
            sceneCtrl.setDefaultZoom(App.Config.map.layerZoom);
            sceneCtrl.loadLayers(App.Config.map.ReferenceLayers);
            sceneCtrl.loadLayers(App.Config.map.FeatureLayers, 'feature');
            sceneCtrl.loadLayers(App.Config.map.TipLayers, 'tip');
            sceneCtrl.loadLayers(App.Config.map.ThematicLayers, 'thematic');
            sceneCtrl.loadLayers(App.Config.map.TrackLayers, 'track');
            sceneCtrl.loadBackground(App.Config.map.Background);
            sceneCtrl.loadOverlay(App.Config.map.Overlay);
            sceneCtrl.loadScenes(App.Config.map.Scenes);
            sourceCtrl.loadConfig(App.Config.map.SourceConfig);
        };

        // 初始化地图控件
        var initMap = function () {
            var options = {
                tileSize: 256,
                container: 'editorMap',
                center: [0, 0],
                zoom: 0
            };
            return new FM.mapApi.Map(options);
        };

        // 初始化各模块
        var initModules = function (map) {
            $scope.map = map.getLeafletMap();
            window.map = $scope.map; // 临时对策，使用map全局变量
            featureSelector.setMap($scope.map);
            highlightCtrl.setMap($scope.map);
            idHighlightCtrl.setMap($scope.map);
            snapCtrl.setMap($scope.map);
            toolCtrl.setMap($scope.map);
            tooltipsCtrl.setMap($scope.map, 'tooltip');
            shapeEditor.loadTools();
        };

        var testMesh = function (latlng) {
            var meshId = meshAlgm.Calculate25TMeshId(latlng);
            if (App.Temp.meshList && App.Temp.meshList.length > 0) {
                return App.Temp.meshList.indexOf(meshId) >= 0;
            }
            return true;
        };

        var tagNames = {
            INPUT: true,
            BUTTON: true,
            TEXTAREA: true
        };

        var bodyEvent = {
            keydown: function (event) {
                if (!tagNames.hasOwnProperty(event.target.tagName)) {
                    toolCtrl.onKeyDown(event);
                    // modified by chenx on 2017-8-31
                    // 停止冒泡会导致hotkeys组件不可用
                    // event.stopPropagation();
                }
            },
            keyup: function (event) {
                if (!tagNames.hasOwnProperty(event.target.tagName)) {
                    toolCtrl.onKeyUp(event);
                    // event.stopPropagation();
                }
            },
            click: function (event) {
                var targetClass = event.target.innerText;
                // 伪造一个ctrl+z/x事件
                var copyEvent = {};
                if (['撤销', '重做', '重置'].indexOf(targetClass) > -1) {
                    if (targetClass === '撤销' || targetClass === '重做') {
                        copyEvent.ctrlKey = true;
                        copyEvent.key = targetClass === '撤销' ? 'z' : 'x';
                    } else {
                        copyEvent.ctrlKey = false;
                        copyEvent.key = 'Escape';
                    }
                    toolCtrl.onKeyUp(copyEvent);
                    event.stopPropagation();
                }
            },
            contextmenu: function (event) {
                event.preventDefault();
            }
        };

        var bindToolEvent = function (map) {
            var leafletMap = map.getLeafletMap();
            // 给工具绑定事件
            leafletMap.on('mousedown', toolCtrl.onMouseDown);
            leafletMap.on('mousemove', toolCtrl.onMouseMove);
            leafletMap.on('mouseup', toolCtrl.onMouseUp);

            // 将键盘事件绑定到body上，并根据event.target决定是否触发工具响应
            L.DomEvent.on(document.body, 'keydown', bodyEvent.keydown);
            L.DomEvent.on(document.body, 'keyup', bodyEvent.keyup);
            // 屏蔽掉默认的右键菜单
            L.DomEvent.on(leafletMap.getContainer(), 'contextmenu', bodyEvent.contextmenu);
            // 绑定撤销与重置事件到toolcontrol;
            L.DomEvent.on(document.body, 'click', bodyEvent.click);

            L.DomEvent.on(leafletMap.getContainer(), 'wheel', function (event) {
                toolCtrl.onWheel(event);
                event.stopPropagation();
            });
            // 阻止地图双击选中事件
            L.DomEvent.on(leafletMap.getContainer(), 'selectstart', function (event) {
                event.preventDefault();
            });
        };

        // 加载右侧地图编辑按钮面板
        var loadMapToolbar = function () {
            var promises = [];
            promises.push($ocLazyLoad.load(appPath.editor + 'map/mapToolbarCtrl.js'));
            $q.all(promises).then(function () {
                if (App.Temp.monthTaskType) {
                    // 深度信息----刘杨加
                    $scope.mapToolbarTmpl = appPath.editor + '/toolbars/deepInfoToolbarTmpl.htm';
                } else {
                    $scope.mapToolbarTmpl = appPath.editor + '/map/mapToolbarTmpl.htm';
                }
            });
        };

        // 清理地图上的选中效果
        var clearMap = function () {
            // 清理弹出气泡
            $scope.map.closePopup();
            // 清理浮动工具条
            if ($scope.map.floatMenu) {
                $scope.map.removeLayer($scope.map.floatMenu);
                $scope.map.floatMenu = null;
            }

            highlightCtrl.clear();
        };

        $scope.mapToolbarPanelFlag = false;
        var openToolbarPanel = function (event, data) {
            var ctrl = appPath.editor + 'map/mapToolbarPanelCtrl.js';
            var tmpl = appPath.editor + 'map/mapToolbarPanelTmpl.html';
            dsLazyload.loadInclude($scope, 'mapToolbarPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$emit('Map-ToolbarPanelOpened');
                $scope.mapToolbarPanelFlag = true;
                $scope.$broadcast('MapToolbarPanelReload', data);
            });
        };
        var closeToolbarPanel = function () {
            $scope.mapToolbarPanelFlag = false;
            // $scope.mapToolbarPanelTmpl = null;
            $scope.$emit('Map-ToolbarPanelClosed');
        };

        var drawTaskBounds = function (polygon, type) {
            var taskSymbol = symbolFactory.getSymbol(type == 1 ? 'py_task' : 'py_qua_task');
            if (polygon.type === 'Polygon') {
                taskFeedback.add(polygon, taskSymbol);
            } else if (polygon.type === 'MultiPolygon') {
                var newPolygon;
                for (var i = 0; i < polygon.coordinates.length; i++) {
                    newPolygon = {
                        type: 'Polygon',
                        coordinates: polygon.coordinates[i]
                    };
                    taskFeedback.add(newPolygon, taskSymbol);
                }
            }
            feedbackCtrl.refresh();
        };

        var mapCookieKey = App.Config.appName + '-' + App.Temp.userId + '-' + App.Temp.subTaskId + '-LastMapView';

        var setMapInitialPosition = function (polygon) {
            var mapCookie = $cookies.getObject(mapCookieKey);
            if (mapCookie) {
                $scope.map.setView(mapCookie.viewPoint, mapCookie.zoom);
            } else if (polygon) {
                var bbox = geometryAlgorithm.bbox(polygon);
                var bounds = L.latLngBounds([bbox.minY, bbox.minX], [bbox.maxY, bbox.maxX]);
                $scope.map.fitBounds(bounds);
            } else { // 随便定位一个位置（todo: 要改成天安门的坐标）
                $scope.map.setView([40.88888, 116.33333], 16);
            }
        };

        var setDefaultScene = function () {
            var taskType = App.Temp.taskType;

            if (taskType === 2 && App.Temp.workKind === 5) { //  精细化采集任务
                App.Config.map.Scenes.defaultScene = 'PointAddressScene';
                App.Config.map.SourceConfig.tipSource.requestParameter.workStatus = [0, 1, 2];
            } else if (taskType === 0 || taskType === 2) { //   type是0、2的子任务，默认是 “POI粗编作业场景”
                App.Config.map.Scenes.defaultScene = 'POIWorkScene';
                App.Config.map.SourceConfig.tipSource.requestParameter.workStatus = [0, 1, 2];
            } else if (taskType === 7) {  // 深度信息作业场景
                App.Config.map.Scenes.defaultScene = 'DeepInfoScene';
            }
        };

        //   grid粗编子任务，fc预处理tips默认不选中。在这里修改，不用每次打开图层面板都运行一遍。相关bug:8090
        var removeFCTips = function () {
            if (App.Temp.taskType === 3) {
                App.Config.map.TipLayers.TipFC.options.visible = false;
            }
        };

        // 页面初始化
        var initialize = function () {
            var map = initMap();

            sceneCtrl.setMap(map);

            setDefaultScene();

            removeFCTips();

            loadConfigs();

            initModules(map);

            bindToolEvent(map);

            // 因为很多地方用到了layerCtrl,防止报错做的临时处理
            layerCtrl = new fastmap.uikit.LayerController({
                config: []
            });

            // 默认使用地图漫游工具
            toolCtrl.resetCurrentTool('PanTool', null, null);

            var taskCookie = App.Temp.SubTask;
            if (taskCookie.taskType !== 7) { // 月编专项没有子任务
                var polygon = geometryAlgorithm.wktToGeojson(taskCookie.geometry);
                if (!polygon) {
                    swal('错误', 'WKT数据有误，请检查！', 'error');
                } else {
                    // 绘制任务圈
                    drawTaskBounds(polygon, 1);
                }
            }
            // 质检任务范围圈
            if (taskCookie.qualityGeos) {
                for (var i = 0; i < taskCookie.qualityGeos.length; i++) {
                    var quaPolygon = geometryAlgorithm.wktToGeojson(taskCookie.qualityGeos[i]);
                    if (!quaPolygon) {
                        swal('错误', 'WKT数据有误，请检查！', 'error');
                    } else {
                        // 绘制任务圈
                        drawTaskBounds(quaPolygon, 0);
                    }
                }
            }

            setMapInitialPosition(polygon);

            $scope.zoom = $scope.map.getZoom();

            $scope.map.on('moveend', function (e) {
                $cookies.putObject(mapCookieKey, {
                    zoom: $scope.map.getZoom(),
                    viewPoint: $scope.map.getCenter()
                }, {
                    path: '/'
                });

                // 注意：这里必须使用$timeout
                // 由于这段代码是在leaflet的上下文中运行，超出了$scope的控制，直接赋值后$scope检测不到变化，页面的值就不会更新
                // 但是直接调用$scope.$apply()又会报错，所以使用$timeout，在$timeout中$scope会自动调用$apply
                $timeout(function () {
                    $scope.zoom = $scope.map.getZoom();
                });
                $scope.$emit('LinkageChildWin', e);
            });

            eventCtrl.on('AllTileLayerLoaded', function (e) {
                highlightCtrl.refresh();
            });

            loadMapToolbar();
        };

        // 接到顶层的定位要素指令（editorCtrl broadcast），对geoLiveType对象进行定位
        $scope.$on('Map-LocateObject', function (event, data) {
            // 地图定位
            var geoms = [];
            for (var i = 0; i < data.features.length; i++) {
                if (data.features[i].geometry) {
                    if (data.features[i].geometry.g_location) { // 兼容InfoTip的geometry格式
                        geoms.push(data.features[i].geometry.g_location);
                    } else {
                        geoms.push(data.features[i].geometry);
                    }
                }
            }
            if (geoms.length > 0) {
                var bounds = $scope.map.getBounds();
                var w = bounds.getWest();
                var s = bounds.getSouth();
                var e = bounds.getEast();
                var n = bounds.getNorth();
                var g = {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [w, n],
                            [w, s],
                            [e, s],
                            [e, n],
                            [w, n]
                        ]
                    ]
                };
                var f = false;
                for (i = 0; i < geoms.length; i++) {
                    if (geometryAlgorithm.intersects(g, geoms[i])) {
                        f = true;
                        break;
                    }
                }

                // 如果对象有部分在地图范围内，则不移动地图
                // 如果对象都不在地图内，则将地图中心移动到对象中心点
                if (!f) {
                    var geoJson = L.geoJson(geoms);
                    var center = geoJson.getBounds().getCenter();
                    var zoom = $scope.map.getZoom();
                    zoom = zoom < 17 ? 17 : zoom;
                    $scope.map.setView(center, zoom);
                }
            }
        });

        // 接到顶层的定位要素指令（editorCtrl broadcast），对GeoJson对象定位
        $scope.$on('Map-LocateGeoJsonObject', function (event, data) {
            // 地图定位
            var geoms = [];
            for (var i = 0; i < data.features.length; i++) {
                if (data.features[i].geometry) {
                    geoms.push(data.features[i].geometry);
                }
            }
            if (geoms.length > 0) {
                var geoJson = L.geoJson(geoms);
                var center = geoJson.getBounds().getCenter();
                var zoom = $scope.map.getZoom();
                $scope.map.setView(center, zoom);
            }
        });

        $scope.$on('LocationByCoordinate', function (event, data) {
            var geoJson = L.geoJson(data.coordinate);
            var center = geoJson.getBounds().getCenter();
            var zoom = $scope.map.getZoom();
            $scope.map.setView(center, zoom);
        });

        // 接到顶层的高亮要素指令（editorCtrl broadcast），对geoLiveType对象进行高亮
        $scope.$on('Map-HighlightObject', function (event, data) {
            highlightCtrl.clear();
            for (var i = 0; i < data.features.length; i++) {
                highlightCtrl.highlight(data.features[i]);
            }
        });

        // 加载要素的编辑工具条
        $scope.$on('Map-LoadEditTool', function (event, data) {
            var editTools = FM.uikit.Config.getObjectEditTools(data.feature.geoLiveType);
            var conf = new FM.uikit.Config.EditTool();
            var tool,
                tools;
            if (editTools) {
                tools = [];
                for (var i = 0; i < editTools.length; i++) {
                    tool = conf.getEditTool(editTools[i]);
                    if (tool) {
                        tools.push({
                            text: tool.icon,
                            title: tool.title,
                            type: editTools[i],
                            class: 'feaf'
                        });
                    }
                }
            }

            if (tools) {
                if ($scope.map.floatMenu) {
                    $scope.map.removeLayer($scope.map.floatMenu);
                    $scope.map.floatMenu = null;
                }
                $scope.map.floatMenu = new L.Control.FloatMenu('000', data.originalEvent, {
                    items: tools
                });
                $scope.map.addLayer($scope.map.floatMenu);
                $scope.map.floatMenu.setVisible(true);
            }
        });

        /**
         * 定位或者进行缩放或者同时进行定位和缩放
         */
        $scope.$on('Map-LocationOrZoom', function (event, data) {
            var center = $scope.map.getCenter();
            var zoom = $scope.map.getZoom();
            if (data.center) {
                center = L.latLng(data.center.split(','));
            }
            if (data.zoom) {
                zoom = data.zoom;
            }
            $scope.map.setView(center, zoom);
        });

        $scope.$on('Map-RedrawFeatureLayer', function (event, data) {
            sceneCtrl.redrawLayerByGeoLiveTypes(data.geoLiveTypes);
        });

        // 地图上选中要素对象
        $scope.$on('Map-ObjectSelected', function (event, data) {
            // 继续向顶层发送要素选中事件
            $scope.$emit('ObjectSelected', data);
        });

        // 开始启动地图操作工具
        $scope.$on('Map-EnableTool', function (event, data) {
            // 关闭工具面板
            $scope.$broadcast('MapToolbar-Close');
        });

        // 清理地图
        $scope.$on('Map-ClearMap', function (event, data) {
            clearMap();
        });

        $scope.$on('Map-openToolbarPanel', openToolbarPanel);

        $scope.$on('Map-closeToolbarPanel', closeToolbarPanel);

        /**
         * 中转maptoolbar的操作
         */
        $scope.$on('MapToolbarPanel-toggleEditable', function (event, data) {
            $scope.$broadcast('MapToolbar-toggleEditable', data);
        });
        $scope.$on('MapToolbarPanel-replaceTool', function (event, data) {
            $scope.$broadcast('MapToolbar-replaceTool', data);
        });
        $scope.$on('MapToolbar-addTool', function (event, data) {
            $scope.$broadcast('MapToolbarPanel-addTool', data);
        });
        $scope.$on('MapToolbar-removeTool', function (event, data) {
            $scope.$broadcast('MapToolbarPanel-removeTool', data);
        });
        $scope.$on('MapToolbar-panelClosed', function (event, data) {
            $scope.$broadcast('MapToolbarPanel-panelClosed', data);
        });

        var destoryBodyEvent = function () {
            L.DomEvent.off(document.body, 'keyup', bodyEvent.keyup);
            L.DomEvent.off(document.body, 'keydown', bodyEvent.keydown);
            L.DomEvent.off(document.body, 'contextmenu', bodyEvent.contextmenu);
        };

        var resetToDefaultScene = function () {
            var taskType = App.Temp.taskType;
            var sceneID = '';

            if (taskType === 2 && App.Temp.workKind === 5) {
                sceneID = 'PointAddressScene';
            } else if (taskType === 0 || taskType === 2) {
                sceneID = 'POIWorkScene';
            } else {
                sceneID = 'BaseInfoScene';
            }

            sceneCtrl.changeScene(sceneID);
        };

        var bindHotKeys = function () {
            hotkeys.bindTo($scope).add({
                combo: 'ctrl+q',
                description: '恢复默认场景',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: resetToDefaultScene
            });
        };
        bindHotKeys();

        // add by chenx on 2017-4-27
        // 必须等待editor的指令来初始化
        // 解决切换任务后，地图不能正常加载的问题
        $scope.$on('Map-Initialize', initialize);

        // 删除地图
        $scope.$on('$destroy', function (event, data) {
            if ($scope.map) {
                $scope.map.remove();
            }
            destoryBodyEvent();
        });
    }
]);
