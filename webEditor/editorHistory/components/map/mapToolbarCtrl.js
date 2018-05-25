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

        var toolList = [
            {
                title: '追踪选线',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/truck-line.png">',
                ngClass: '{\'active\': selectTool.name===\'track-RDLINK\'}',
                ngController: 'startEditCtrl',
                ngClick: 'batchSelect($event, \'RDLINK\', \'track\')'
            },
            {
                title: '联动',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/linkage.png" />',
                ngClass: '{\'active\': selectTool.syncTool.indexOf("LINKAGE")>-1}',
                ngController: 'startEditCtrl',
                ngClick: 'syncMove($event, \'LINKAGE\')'
            }, {
                title: '缩放',
                icon: '<img src="../../images/newPoi/toolIcon/quickToolIcon/scale.png">',
                ngClass: '{\'active\': selectTool.syncTool.indexOf("ZOOM")>-1}',
                ngController: 'startEditCtrl',
                ngClick: 'syncMove($event, \'ZOOM\')'
            }
        ];

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
            if (data.ngController) {
                elem.attr('ng-controller', data.ngController);
            }
            elem.attr('ng-click', data.ngClick);
            elem.attr('ng-class', data.ngClass);
            elem.append(data.icon);

            return elem;
        };

        var initialize = function () {
            var elem,
                newTool,
                anchor;
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
            }
        };

        // $scope.$on('StartEditCtrl-ChangeFirstTool', function (event, data) {
        //     changeFirstTool(data);
        // });

        $scope.$on('MapToolbarPanel-panelClosed', foldToolbar);

        $scope.$on('MapToolbar-Close', function (event, data) {
            closeAllTools();
            foldToolbar();
        });

        initialize();
    }
]);
