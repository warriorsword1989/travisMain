/**
 * Created by zhaohang on 2016/11/22.
 */

angular.module('app').controller('MapToolbarCtrl', ['$scope', '$compile',
    function ($scope, $compile) {
        $scope.allToolsFlag = false;
        $scope.allRecentToolsFlag = false;
        $scope.editToolsFlag = false;
        $scope.pageFlag = 1;
        $scope.taskType = App.Temp.taskType;

        //  精细化采集时的默认工具
        var defaultToolsRefineTask = [
            {
                title: '创建点门牌',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-pointAddress.png" />',
                ngClass: '{\'active\': selectTool.name===\'IXPOINTADDRESS\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'IXPOINTADDRESS\')'
            }, {
                title: '批量移动点门牌显示坐标',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/batch-translate-address.svg" />',
                ngClass: '{\'active\': selectTool.name===\'batchTranslateIXPOINTADDRESSLocation\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchTranslateIndexLocation(\'IXPOINTADDRESS\')'
            }, {
                title: '批量重合点门牌显示坐标',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/batch-converge-address-location.svg" />',
                ngClass: '{\'active\': selectTool.name===\'batchConvergeIXPOINTADDRESSLocation\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchConvergeIndexLocation(\'IXPOINTADDRESS\')'
            }, {
                title: '批量自动匹配点门牌引导坐标',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/batch-address-guide-auto.svg" />',
                ngClass: '{\'active\': selectTool.name===\'batchIXPOINTADDRESSGuideAuto\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchIndexGuideAuto(\'IXPOINTADDRESS\')'
            }, {
                title: '批量手动指定点门牌引导坐标',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/batch-address-guide-manual.svg" />',
                ngClass: '{\'active\': selectTool.name===\'batchIXPOINTADDRESSGuideManual\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchIndexGuideManual(\'IXPOINTADDRESS\')'
            }
        ];

        //  子任务类型为0、2、7时的默认工具
        var defaultTools027 = [
            {
                title: '创建POI',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-poi.png" />',
                ngClass: '{\'active\': selectTool.name===\'IXPOI\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'IXPOI\')'
            }, {
                title: '批量移动POI显示坐标',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/batch-translate-poi.svg" />',
                ngClass: '{\'active\': selectTool.name===\'batchTranslateIXPOILocation\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchTranslateIndexLocation(\'IXPOI\')'
            }, {
                title: '批量重合POI显示坐标',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/batch-converge-poi-location.svg" />',
                ngClass: '{\'active\': selectTool.name===\'batchConvergeIXPOILocation\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchConvergeIndexLocation(\'IXPOI\')'
            }, {
                title: '批量自动匹配POI引导坐标',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/batch-poi-guide-auto.svg" />',
                ngClass: '{\'active\': selectTool.name===\'batchIXPOIGuideAuto\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchIndexGuideAuto(\'IXPOI\')'
            }, {
                title: '批量手动指定POI引导坐标',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/batch-poi-guide-manual.svg" />',
                ngClass: '{\'active\': selectTool.name===\'batchIXPOIGuideManual\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchIndexGuideManual(\'IXPOI\')'
            }
        ];

        //  子任务类型为3、4时的默认工具
        var defaultTools34 = [
            {
                title: '制作道路点',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-node.png" />',
                ngClass: '{\'active\': selectTool.name===\'RDNODE\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'RDNODE\')'
            }, {
                title: '制作道路线',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-link.png">',
                ngClass: '{\'active\': selectTool.name===\'RDLINK\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'RDLINK\')'
            }, {
                title: '制作路口',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-crossing.png">',
                ngClass: '{\'active\': selectTool.name===\'RDCROSS\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'RDCROSS\')'
            }, {
                title: '制作交限',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-traffic-limitation.png">',
                ngClass: '{\'active\': selectTool.name===\'RDRESTRICTION\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'RDRESTRICTION\')'
            }, {
                title: '制作车信',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-lane-information.png">',
                ngClass: '{\'active\': selectTool.name===\'RDLANECONNEXITY\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'RDLANECONNEXITY\')'
            }, {
                title: '制作信号灯',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-traffic-lights.png">',
                ngClass: '{\'active\': selectTool.name===\'RDTRAFFICSIGNAL\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'RDTRAFFICSIGNAL\')'
            }, {
                title: '制作立交',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/add-overpass.png">',
                ngClass: '{\'active\': selectTool.name===\'RDGSC\'}',
                ngController: 'startEditCtrl',
                ngClick: 'create($event, \'RDGSC\')'
            }, {
                title: '框选rdNode',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/frame-select-point.png">',
                ngClass: '{\'active\': selectTool.name===\'batch-RDNODE\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchSelect($event, \'RDNODE\', \'batch\')'
            }, {
                title: '框选线',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/frame-select-line.png">',
                ngClass: '{\'active\': selectTool.name===\'batch-RDLINK\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchSelect($event, \'RDLINK\', \'batch\')'
            }, {
                title: '框选tips',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/frame-select-tips.png">',
                ngClass: '{\'active\': selectTool.name===\'batch-TIPS\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchSelect($event, \'TIPS\', \'batch\')'
            }, {
                title: '追踪选线',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/truck-line.png">',
                ngClass: '{\'active\': selectTool.name===\'track-RDLINK\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchSelect($event, \'RDLINK\', \'track\')'
            }
        ];

        var toolList = [];
        var initToolList = function () {  //  在清除浏览器缓存后，或者没有自定义配置快捷工具条情况下，快捷工具条中的默认按钮，自动适配不同的子任务类型。
            if (App.Temp.Settings.dailyEditTool) {
                toolList = App.Temp.Settings.dailyEditTool;
            } else {
                if ($scope.taskType === 3 || $scope.taskType === 4) {
                    toolList = defaultTools34;
                } else if ($scope.taskType === 2 && App.Temp.workKind === 5) {  //  精细化任务
                    toolList = defaultTools027.concat(defaultToolsRefineTask);
                } else {
                    toolList = defaultTools027;
                }
            }
        };

        initToolList();

        // 第一个工具，两种中的一个
        var selectTwoLevel = [{
            type: 'SELECT',
            event: 'point',
            title: '点选要素',
            geo: null,
            img: 'select'
        }, {
            type: 'batch-null',
            event: 'batch',
            title: '框选要素',
            geo: null,
            img: 'frame_select_all'
        }];

        //  默认为框选
        $scope.defaultSelectTool = selectTwoLevel[1];

        // 子任务类型为3、4时的框选工具，第三个工具
        // var batchSelectTwoLevel = [
        //     {
        //         type: 'batch-RDNODE',
        //         event: 'batch',
        //         title: '框选rdNode',
        //         geo: 'RDNODE',
        //         img: 'frame-select-point'
        //     }, {
        //         type: 'batch-RDLINK',
        //         event: 'batch',
        //         title: '框选线',
        //         geo: 'RDLINK',
        //         img: 'frame-select-line'
        //     }, {
        //         type: 'batch-TIPS',
        //         event: 'batch',
        //         title: '框选tips',
        //         geo: 'TIPS',
        //         img: 'frame-select-tips'
        //     }, {
        //         type: 'track-RDLINK',
        //         event: 'track',
        //         title: '追踪选线',
        //         geo: 'RDLINK',
        //         img: 'truck-line'
        //     }
        // ];

        //  默认为框点
        // $scope.defaultBatchSelectTool = batchSelectTwoLevel[0];

        var storeSettings = function (value) {
            App.Temp.Settings.dailyEditTool = value;
            App.Util.setLocalStorage('Settings', App.Temp.Settings);
        };

        var getTools = function () {
            var tools = $('.map-toolbar li.tool');
            var ret = [];
            for (var i = 0; i < tools.length; i++) {
                ret.push({
                    ngController: $(tools[i]).attr('ng-controller'),
                    ngClick: $(tools[i]).attr('ng-click'),
                    title: $(tools[i]).attr('title')
                });
            }
            return ret;
        };

        var openAllTools = function () {
            $scope.allToolsFlag = true;
            $scope.allRecentToolsFlag = true;

            $scope.$emit('Map-openToolbarPanel', {
                type: 'MapToolbarPanel',
                data: getTools()
            });
        };
        var foldToolbar = function () {
            $scope.allToolsFlag = false;
            $scope.allRecentToolsFlag = false;
            $scope.editToolsFlag = false;
            $scope.pageFlag = 1;
        };
        var closeAllTools = function () {
            $scope.$emit('Map-closeToolbarPanel');
        };

        //  修改批量选工具的默认工具
        // var changeDefaultBatchSelectTool = function (toolName) {
        //     for (var i = 0; i < batchSelectTwoLevel.length; i++) {
        //         if (batchSelectTwoLevel[i].type == toolName) {
        //             $scope.defaultBatchSelectTool = batchSelectTwoLevel[i];
        //             break;
        //         }
        //     }
        // };

        //  修改第一个工具的默认工具
        var changeDefaultSelectTool = function (toolName) {
            for (var i = 0; i < selectTwoLevel.length; i++) {
                if (selectTwoLevel[i].type == toolName) {
                    $scope.defaultSelectTool = selectTwoLevel[i];
                    break;
                }
            }
        };

        // 选择二级后，联动到一级菜单
        var changeFirstTool = function (toolName) {
            if (toolName === 'SELECT' || toolName === 'batch-null') {
                changeDefaultSelectTool(toolName);
            } else {
                // changeDefaultBatchSelectTool(toolName);
            }
        };
        $scope.toggleAllTools = function () {
            if ($scope.allToolsFlag) {
                closeAllTools();
                foldToolbar();
            } else {
                openAllTools();
            }
        };

        $scope.switchPage = function () {
            if ($scope.allRecentToolsFlag) {
                return;
            }
            var pageTotal = 2;
            if ($scope.pageFlag < pageTotal) {
                $scope.pageFlag++;
            } else {
                $scope.pageFlag = 1;
            }
        };

        $scope.toggleEditTools = function (e) {
            $scope.editToolsFlag = !$scope.editToolsFlag;
            if ($scope.editToolsFlag && !$scope.allToolsFlag) {
                openAllTools();
            }
            $scope.$emit('MapToolbarPanel-toggleEditable', {
                editable: $scope.editToolsFlag
            });
        };

        var _createToolElem = function (data) {
            var elem = angular.element(document.createElement('li'));
            elem.addClass('tool');
            elem.attr('title', data.title);
            elem.attr('ng-controller', data.ngController);
            elem.attr('ng-click', data.ngClick);
            elem.attr('ng-class', data.ngClass);
            elem.append(data.icon);

            return elem;
        };

        var _createAddToolElem = function () {
            return '<li class="add" title="添加快捷工具"><img src="../../images/newPoi/toolIcon/quickToolIcon/newTool.png"></li>';
        };

        var addTool = function (event, data) {
            var elem = _createToolElem(data);
            var newTool = $compile(elem)($scope);
            var firstAddTools = $('.tools-ul li.add').first();
            var lastTools,
                allTools,
                i,
                t;
            if (firstAddTools.length > 0) {
                firstAddTools.replaceWith(newTool);
            } else {
                lastTools = $('.tools-ul li.tool').last();
                lastTools.replaceWith(newTool);
                toolList.pop();
                $scope.$emit('MapToolbarPanel-replaceTool', {
                    ngController: lastTools.attr('ng-controller'),
                    ngClick: lastTools.attr('ng-click'),
                    title: lastTools.attr('title')
                });
            }
            toolList.push(data);
            // 缓存
            storeSettings(toolList);
        };

        var removeTool = function (event, data) {
            var recentTools = $('.tools-ul li.tool');
            var li,
                p1,
                p2;
            for (var i = 0; i < recentTools.length; i++) {
                li = $(recentTools[i]);
                if (li.attr('ng-controller') === data.ngController && li.attr('ng-click') === data.ngClick) {
                    p1 = li.parent();
                    li.remove();
                    if (i < 10 && $(recentTools[10]).hasClass('tool')) {
                        p2 = $(recentTools[10]).parent();
                        p1.append($(recentTools[10]));
                        p2.append(_createAddToolElem);
                    } else {
                        p1.append(_createAddToolElem);
                    }
                    break;
                }
            }

            for (i = 0; i < toolList.length; i++) {
                if (toolList[i].ngController === data.ngController && toolList[i].ngClick === data.ngClick) {
                    toolList.splice(i, 1);
                    break;
                }
            }

            // 缓存
            storeSettings(toolList);
        };

        //  使用 ng-if || ng-show 来控制子任务类型不同时的 li.add 元素，会造成 $('.tools-ul li.add').first() 选择忽略此元素
        // var addListElement = function () {
        //     if ($scope.taskType === 0 || $scope.taskType === 2 || $scope.taskType === 7) {
        //         var elem = angular.element(document.createElement('li'));
        //         elem.addClass('add');
        //         elem.attr('title', '添加快捷工具');
        //         elem.append('<img src="../../images/newPoi/toolIcon/quickToolIcon/newTool.png">');
        //
        //         var newTool = $compile(elem)($scope);
        //         $('.select-tool').append(newTool);
        //     }
        // };

        var initialize = function () {
            var elem,
                newTool,
                anchor;

            // addListElement();
            for (var i = 0; i < toolList.length; i++) {
                elem = _createToolElem(toolList[i]);
                newTool = $compile(elem)($scope);
                anchor = $('.tools-ul li.add').first();
                if (anchor.length > 0) {
                    anchor.replaceWith(newTool);
                } else {
                    break;
                }
            }

            if (i < toolList.length) {
                toolList.splice(i);

                // 缓存
                storeSettings(toolList);
            }
        };

        $scope.$on('StartEditCtrl-ChangeFirstTool', function (event, data) {
            changeFirstTool(data);
        });

        $scope.$on('MapToolbarPanel-addTool', addTool);

        $scope.$on('MapToolbarPanel-removeTool', removeTool);

        $scope.$on('MapToolbarPanel-panelClosed', foldToolbar);

        $scope.$on('MapToolbar-Close', function (event, data) {
            closeAllTools();
            foldToolbar();
        });

        initialize();
    }
]);
