/**
 * 编辑页面的主controller
 * @file       editorCtrl.js
 * @author ChenXiao
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */

angular.module('app').controller('editorCtrl', ['$scope', '$rootScope', '$cookies', '$timeout', '$q',
    '$ocLazyLoad', 'ngDialog',
    'appPath', 'dsMeta', 'dsFcc', 'dsEdit', 'dsManage', 'dsColumn', 'dsLazyload',
    function ($scope, $rootScope, $cookies, $timeout, $q, $ocLazyLoad, ngDialog,
        appPath, dsMeta, dsFcc, dsEdit, dsManage, dsColumn, dsLazyload) {
        if (!$scope.testLogin()) {
            return;
        }

        if (!$scope.testTask()) {
            return;
        }

        var singletons = [];
        /**
         * 注册单例对象，以便在页面关闭时进行清理
         * @method registSingletons
         * @author ChenXiao
         * @date   2017-09-14
         * @return {Undefined}       无
         */
        var registSingletons = function () {
            singletons.push(fastmap.mapApi.MeshAlgorithm.getInstance());
            singletons.push(fastmap.mapApi.FeatureSelector.getInstance());
            singletons.push(fastmap.mapApi.GeometryTransform.getInstance());
            singletons.push(fastmap.mapApi.Proj4Transform.getInstance());
            singletons.push(fastmap.mapApi.TileRequestController.getInstance());
            singletons.push(fastmap.mapApi.FeedbackController.getInstance());
            singletons.push(fastmap.mapApi.geometry.GeometryAlgorithm.getInstance());
            singletons.push(fastmap.mapApi.scene.SceneController.getInstance());
            singletons.push(fastmap.mapApi.snap.SnapController.getInstance());
            singletons.push(fastmap.mapApi.source.SourceController.getInstance());
            singletons.push(fastmap.mapApi.symbol.GeometryFactory.getInstance());
            singletons.push(fastmap.mapApi.symbol.GeometryTransform.getInstance());
            singletons.push(fastmap.mapApi.symbol.ResourceFactory.getInstance());
            singletons.push(fastmap.mapApi.symbol.Transformation.getInstance());
            singletons.push(FM.mapApi.render.HighlightController.getInstance());
            singletons.push(FM.mapApi.render.IDHighlightController.getInstance());
            singletons.push(fastmap.mapApi.symbol.GetSymbolFactory());
            singletons.push(fastmap.uikit.Util.getInstance());
            singletons.push(fastmap.uikit.check.CheckController.getInstance());
            // add by chenx on 2017-8-1
            // 要素编辑器增加图幅列表的限制
            singletons.push(fastmap.uikit.complexEdit.ComplexEditor.getInstance({
                meshList: App.Temp.SubTask.meshList
            }));
            singletons.push(fastmap.uikit.relationEdit.RelationEditor.getInstance({
                meshList: App.Temp.SubTask.meshList
            }));
            singletons.push(fastmap.uikit.shapeEdit.ShapeEditor.getInstance({
                meshList: App.Temp.SubTask.meshList
            }));
            singletons.push(fastmap.uikit.topoEdit.TopoEditFactory.getInstance());
            singletons.push(fastmap.uikit.editControl.EditControlFactory.getInstance());
            singletons.push(fastmap.uikit.operation.OperationController.getInstance());
            singletons.push(fastmap.uikit.ToolController.getInstance());
            singletons.push(fastmap.service.DataServiceEdit.getInstance());
            singletons.push(fastmap.service.DataServiceFcc.getInstance());
            singletons.push(fastmap.service.DataServiceTips.getInstance());
        };

        /**
         * 清理单例对象
         * @method destorySingletons
         * @author ChenXiao
         * @date   2017-09-14
         * @return {Undefined}          无
         */
        var destorySingletons = function () {
            for (var i = 0; i < singletons.length; ++i) {
                if (!singletons[i].destroy) {
                    throw new Error('单例对象未提供destroy方法:' + singletons);
                }
                singletons[i].destroy();
            }
        };

        registSingletons();

        // 页面的中心点像素坐标，用于固定宽/高页面元素的设置
        $scope.PageViewPoint = {
            x: document.documentElement.clientWidth / 2,
            y: document.documentElement.clientHeight / 2
        };

        /** $rootScope 定义区  -----start **/
        $rootScope.CurrentObject = null; // 当前操作的对象
        $rootScope.GeoLiveType = null; // 当前操作的要素类型
        $rootScope.OperationType = null; // 当前操作类型：新增：ADD，编辑：EDIT
        $rootScope.JobStack = []; // 执行的任务堆栈
        /** $rootScope 定义区  -----end **/

        $scope.leftPanelFlag = false;
        $scope.leftFloatPanelFlag = false;
        $scope.leftAdvanceSearchPanelFlag = false;
        /* 右侧面板总控标识, 右侧面板对于页面的布局很重要，
        加一个总控有可能在子页面种打开/关闭右侧面板 */
        $scope.rightPanelOpened = false;
        // 右侧面板是否开启标识
        $scope.rightPanelFlag = false;
        // 右侧浮动面板是否开启标识
        $scope.rightFloatPanelFlag = false;
        // 所有其他的右侧浮动面板
        $scope.mapToolbarPanelFlag = false;
        $scope.clmPanelOpened = false;
        // 专题图图例面板
        $scope.thematicFigureFlag = false;
        // 将页面loading动画的开关引用赋给dsEdit的本地变量，以便在dsEdit中进行控制
        // 注意：这里利用了对象引用的特性，变量必须是个对象，不能是字符串、bool、数字等
        $scope.loading = {
            flag: false
        };
        // 精细化任务当前作业的要素类型
        $scope.workGeo = null;
        dsEdit.referenceLoadingSwitch($scope.loading);
        dsFcc.referenceLoadingSwitch($scope.loading);
        dsColumn.referenceLoadingSwitch($scope.loading);
        dsMeta.referenceLoadingSwitch($scope.loading);

        /**
         * 显示页面加载中效果
         * @method showLoading
         * @author ChenXiao
         * @date   2017-09-14
         * @return {Undefined}    无
         */
        $scope.showLoading = function () {
            if (!$scope.loading.flag) {
                $scope.loading.flag = true;
            }
        };

        /**
         * 关闭页面加载中效果
         * @method hideLoading
         * @author ChenXiao
         * @date   2017-09-14
         * @return {Undefined}    无
         */
        $scope.hideLoading = function () {
            if ($scope.loading.flag) {
                $scope.loading.flag = false;
            }
        };

        /**
         * 弹出窗口管理器
         * @type {Object}
         */
        $scope.dialogManager = {};

        /**
         * 最小化后的窗口信息
         * @type {Array}
         */
        $scope.minimizedDlgs = [];

        /**
         * 弹出窗口默认选项
         * @type {Object}
         */
        var defaultDialogOptions = {
            position: {
                x: $scope.PageViewPoint.x - 300,
                y: $scope.PageViewPoint.y - 150
            },
            size: {
                width: 600,
                height: 300
            },
            container: 'mainEditor',
            viewport: 'mainEditor',
            minimizable: true,
            minimizedSize: 0, // 最小化后隐藏窗口
            closable: true,
            modal: false,
            /*
             confirmFlag 值域说明
             false: 直接关闭窗口；true：可以在各自的面板中编写关闭时的验证方法，具体使用方法如下,
             1. 在面板中通过 $scope.$on('WMWin-CloseConfirmed', functionName); 来调用验证方法 functionName
             2. functionName()方法中，确认关闭，调用 $scope.$emit('WMWin-CloseConfirmed');取消关闭，啥也不做就好
             */
            confirmFlag: false
        };

        /**
         * 设置弹出窗口选项
         * @method getDlgOption
         * @author ChenXiao
         * @date   2017-09-14
         * @param  {Object}     dlgOption 窗口选项对象
         * @param  {Number}     width     宽度
         * @param  {Number}     height    高度
         * @param  {Boolean}    modal     是否显示为模态窗口
         * @param  {Boolean}    confirmFlag     是否显示为模态窗口
         * @return {Undefined}            无
         */
        var getDlgOption = function (dlgOption, width, height, modal, confirmFlag) {
            dlgOption.modal = modal;
            dlgOption.confirmFlag = confirmFlag;
            dlgOption.size.width = width;
            dlgOption.size.height = height;
            dlgOption.position.x = $scope.PageViewPoint.x - width / 2;
            dlgOption.position.y = $scope.PageViewPoint.y - height / 2;
        };

        /**
         * 对于显示不同类型信息的弹出窗口分别设置窗口选项
         * @method getDlgOptions
         * @author ChenXiao
         * @date   2017-09-14
         * @param  {String}      type      窗口显示的信息类型
         * @param  {Object}      dlgOption 窗口选项对象
         * @return {Undefined}             无
         */
        var getDlgOptions = function (type, dlgOption) {
            switch (type) {
                case 'roadCheckResult':
                    getDlgOption(dlgOption, 1000, 600, false, false);
                    break;
                case 'ExternalQuality':
                    getDlgOption(dlgOption, 1000, 600, true, false);
                    break;
                case 'DeepInfoQuality':
                    getDlgOption(dlgOption, 700, 500, true, true);
                    break;
                case 'tipListPanel':
                    getDlgOption(dlgOption, 600, 400, false, false);
                    break;
                case 'AdvancedSearch':
                    // 高级搜索
                    getDlgOption(dlgOption, 600, 380, false, false);
                    break;
                case 'poiFilterPanel':
                    // 筛选
                    getDlgOption(dlgOption, 600, 400, false, false);
                    break;
                case 'trackInfoPanel':
                    getDlgOption(dlgOption, 650, 600, false, false);
                    break;
                default:
                    break;
            }
        };
        /**
         * 根据的窗口的选项，创建弹出窗口对象
         * @method createDialog
         * @author ChenXiao
         * @date   2017-09-11
         * @param  {object} data 窗口选项，主要为要显示的信息类型
         * @return {object}      包含窗口标题、页面片段的信息的窗口对象
         */
        var createDialog = function (data) {
            var item = {};
            var tmplFile = FM.uikit.Config.getUtilityTemplate(data.type);
            item.title = FM.uikit.Config.getUtilityName(data.type);
            item.ctrl = appPath.scripts + tmplFile.ctrl;
            item.tmpl = tmplFile.tmpl;
            item.options = FM.Util.clone(defaultDialogOptions);
            getDlgOptions(data.type, item.options);

            return item;
        };
        /**
         * 窗口打开后执行handler赋值
         * @param  {object} dlg    窗口对象的handler
         * @param  {string} dlgKey 窗口的键值
         * @return {undefined}
         */
        $scope.onDlgOpened = function (dlg, dlgKey) {
            $scope.dialogManager[dlgKey].handler = dlg;
        };
        /**
         * 窗口最小化后的操作
         * @param  {string} dlgKey 窗口的键值
         * @return {undefined}
         */
        $scope.onDlgMinimized = function (dlgKey) {
            var dlg = $scope.dialogManager[dlgKey];
            $scope.minimizedDlgs.push({
                key: dlgKey,
                title: dlg.title
            });
        };
        /**
         * 从最小化的窗口中删除对应的窗口信息
         * @param  {string} dlgKey 窗口的键值
         * @return {undefined}
         */
        var removeFromMinimizedDlgs = function (dlgKey) {
            for (var i = 0, n = $scope.minimizedDlgs.length; i < n; i++) {
                if ($scope.minimizedDlgs[i].key == dlgKey) {
                    $scope.minimizedDlgs.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * 重新打开窗口（从最小化=状态恢复）
         * @param  {string} dlgKey 窗口的键值
         * @return {undefined}
         */
        $scope.restoreDialog = function (dlgKey) {
            $scope.dialogManager[dlgKey].handler.restore();
        };
        /**
         * 重新打开窗口后的操作
         * @param  {string} dlgKey 窗口的键值
         * @return {undefined}
         */
        $scope.onDlgRestored = function (dlgKey) {
            removeFromMinimizedDlgs(dlgKey);
        };
        /**
         * 关闭窗口后的操作
         * @param  {string} dlgKey 窗口的键值
         * @return {undefined}
         */
        $scope.closeDialog = function (dlgKey) {
            removeFromMinimizedDlgs(dlgKey);
            delete $scope.dialogManager[dlgKey];
            $scope.$broadcast('WMDialog-Closed', dlgKey);
        };

        // add by chenx on 2017-3-1
        // 由于编辑时要一边查看tip，并编辑其关联的要素，因此在编辑要素的过程中不能关闭tip面板
        // 加一个左侧tip查看面板是否打开的标识，用于特殊控制
        // 这个标识的值在tipLeftViewPanelCtrl中进行修改，在editorCtrl中的closeLeftPanel使用
        $rootScope.tipLeftViewFlag = false;

        var resetRightPanelOpened = function () {
            $scope.rightPanelOpened = $scope.mapToolbarPanelFlag || $scope.rightFloatPanelFlag || $scope.rightPanelFlag;
        };
        var closeMapToolbarPanel = function () {
            $scope.$broadcast('MapToolbar-Close');
        };

        var showLeftPanel = function () {
            if (!$scope.leftPanelFlag && $scope.leftPanelTmpl) {
                $scope.leftPanelFlag = true;
            }
            $scope.closeLeftFloatPanel();
            $scope.closeLeftListPanel();
            $scope.closeLeftAdvanceSearchPanel();
        };
        // hard: 是否强制关闭
        // 强制关闭用于关闭特殊控制的tip查看面板
        var closeLeftPanel = function (hard) {
            if ($rootScope.tipLeftViewFlag && !hard) {
                return;
            }
            $scope.hideLeftPanel();
            $scope.leftPanelTmpl = null;
        };
        $scope.showLeftFloatPanel = function () {
            if (!$scope.leftFloatPanelFlag && $scope.leftFloatPanelTmpl) {
                $scope.leftFloatPanelFlag = true;
            }
            $scope.closeLeftListPanel();
            $scope.closeLeftAdvanceSearchPanel();
        };
        $scope.showLeftAdvancePanel = function () {
            if (!$scope.leftAdvanceSearchPanelFlag && $scope.leftAdvanceSearchPanelTmpl) {
                $scope.leftAdvanceSearchPanelFlag = true;
            }
            closeLeftPanel(true);
            $scope.closeLeftFloatPanel();
            $scope.closeLeftListPanel();
        };
        $scope.showLeftPanelSwitch = function () {
            if ($scope.leftPanelTmpl) {
                showLeftPanel();
            } else {
                $scope.showLeftAdvancePanel();
            }
        };
        $scope.hideLeftPanel = function () {
            $scope.leftPanelFlag = false;
        };
        $scope.hideLeftAdvanceSearchPanel = function () {
            $scope.leftAdvanceSearchPanelFlag = false;
        };
        $scope.closeLeftFloatPanel = function () {
            $scope.leftFloatPanelFlag = false;
            $scope.leftFloatPanelTmpl = null;
        };
        // 关闭左侧tips/poi面板
        $scope.closeLeftListPanel = function () {
            $scope.leftListPanelFlag = false;
            $scope.leftListPanelTmpl = null;
        };
        $scope.closeLeftAdvanceSearchPanel = function () {
            $scope.leftAdvanceSearchPanelFlag = false;
            $scope.leftAdvanceSearchPanelTmpl = null;
        };
        $scope.showRightPanel = function () {
            if (!$scope.rightPanelFlag && $scope.rightPanelTmpl) {
                $scope.rightPanelFlag = true;
            }
            $scope.closeRightFloatPanel();
            closeMapToolbarPanel();
        };
        $scope.hideRightPanel = function () {
            $scope.rightPanelFlag = false;
            resetRightPanelOpened();
        };
        var closeRightPanel = function () {
            $scope.hideRightPanel();
            $scope.rightPanelTmpl = null;
            resetRightPanelOpened();
        };
        $scope.showRightFloatPanel = function () {
            if (!$scope.rightFloatPanelFlag && $scope.rightFloatPanelTmpl) {
                $scope.rightFloatPanelFlag = true;
            }
            closeMapToolbarPanel();
        };
        $scope.closeRightFloatPanel = function () {
            $scope.rightFloatPanelFlag = false;
            $scope.rightFloatPanelTmpl = null;
            resetRightPanelOpened();
        };

        var eventCtrl = FM.event.EventController.getInstance();
        var objectEditCtrl = new fastmap.uikit.ObjectEditController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        $scope.metaData = {};
        $scope.rootCommonTemp = {}; // 用于保存需要全局控制的变量
        // add by chenx on 2017-9-4
        // 记录上一次从地图工具中打开的选择流程，以便在编辑完要素重新加载后再次启动选择流程
        var selectCtrl = null;

        $scope.testDataChanged = function () {
            var defer = $q.defer();
            if (objectEditCtrl.data.getChanges()) {
                swal({
                    title: '数据已经修改但未保存，继续将会清空修改，是否继续？',
                    text: '如果需要保存，请点击“否”，然后执行保存操作。',
                    animation: 'slide-from-top',
                    allowEscapeKey: false,
                    showCancelButton: true,
                    confirmButtonText: '是的，我要继续',
                    confirmButtonColor: '#ec6c62',
                    cancelButtonText: '否'
                }, function (f) {
                    if (f) {
                        defer.resolve(1);
                    } else {
                        defer.reject(0);
                    }
                });
            } else {
                defer.resolve(1);
            }

            return defer.promise;
        };

        var showInTipLeftViewPanel = function (data) {
            var ctrl = './editor/components/left-panels/tip/tipLeftViewPanelCtrl.js';
            var tmpl = './editor/components/left-panels/tip/tipLeftViewPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'leftPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('TipLeftViewPanelReload', data);
                showLeftPanel();
            });
        };

        var showInPoiLeftViewPanel = function (data) {
            var ctrl = './editor/components/left-panels/poi/poiLeftViewPanelCtrl.js';
            var tmpl = './editor/components/left-panels/poi/poiLeftViewPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'leftPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('PoiLeftViewPanelReload', data);
                showLeftPanel();
            });
        };

        var showInRoadRightAddPanel = function (data) {
            var ctrl = './editor/components/right-panels/road/roadRightAddPanelCtrl.js';
            var tmpl = './editor/components/right-panels/road/roadRightAddPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'rightPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('RoadRightAddPanelReload', data);
                $scope.showRightPanel();
            });
        };

        var showInRoadRightEditPanel = function (data) {
            var ctrl = './editor/components/right-panels/road/roadRightEditPanelCtrl.js';
            var tmpl = './editor/components/right-panels/road/roadRightEditPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'rightPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('RoadRightEditPanelReload', data);
                $scope.showRightPanel();
            });
        };

        var showInIndexRightEditPanel = function (data) {
            var ctrl = './editor/components/right-panels/index/indexRightEditPanelCtrl.js';
            var tmpl = './editor/components/right-panels/index/indexRightEditPanelTmpl.html';
            dsLazyload.loadInclude($scope, 'rightPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('IndexRightEditPanelReload', data);
                $scope.showRightPanel();
            });
        };

        var showInPoiRightEditPanel = function (data) {
            var ctrl = './editor/components/right-panels/poi/poiRightEditPanelCtrl.js';
            var tmpl = './editor/components/right-panels/poi/poiRightEditPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'rightPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('PoiRightEditPanelReload', data);
                $scope.showRightPanel();
            });
        };

        var showInTipRightAddPanel = function (data) {
            var ctrl = './editor/components/right-panels/tip/tipRightAddPanelCtrl.js';
            var tmpl = './editor/components/right-panels/tip/tipRightAddPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'rightPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('TipRightAddPanelReload', data);
                $scope.showRightPanel();
            });
        };

        var showInTipRightEditPanel = function (data) {
            var ctrl = './editor/components/right-panels/tip/tipRightEditPanelCtrl.js';
            var tmpl = './editor/components/right-panels/tip/tipRightEditPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'rightPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('TipRightEditPanelReload', data);
                $scope.showRightPanel();
            });
        };

        var showInBatchRightPanel = function (data) {
            var ctrl = './editor/components/right-panels/batch/batchRightEditPanelCtrl.js';
            var tmpl = './editor/components/right-panels/batch/batchRightEditPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'rightPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('BatchRightEditPanelReload', data);
                $scope.showRightPanel();
            });
        };

        var showInLeftFloatPanel = function (data) {
            var ctrl = './editor/components/left-panels/float/leftFloatPanelCtrl.js';
            var tmpl = './editor/components/left-panels/float/leftFloatPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'leftFloatPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('LeftFloatPanelReload', data);
                $scope.showLeftFloatPanel();
            });
        };
        var showInLeftAdvanceSearchPanel = function () {
            $ocLazyLoad.load('./editor/components/left-panels/search/leftAdvanceSearchPanelCtrl.js').then(function () {
                $scope.leftAdvanceSearchPanelTmpl = './editor/components/left-panels/search/leftAdvanceSearchPanelTmpl.html';
                $scope.showLeftAdvancePanel();
            });
        };

        var showInRightFloatPanel = function (data) {
            var ctrl = './editor/components/right-panels/float/rightFloatPanelCtrl.js';
            var tmpl = './editor/components/right-panels/float/rightFloatPanelTmpl.htm';
            dsLazyload.loadInclude($scope, 'rightFloatPanelTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('RightFloatPanelReload', data);
                $scope.showRightFloatPanel();
            });
        };

        var showInDialog = function (data) {
            var dlgKey = data.type;
            if ($scope.dialogManager[dlgKey]) {
                $scope.$broadcast('ReloadData-' + dlgKey, data);
                $scope.dialogManager[dlgKey].handler.selectWindow();
            } else {
                var item = createDialog(data);
                $scope.dialogManager[dlgKey] = item;
                dsLazyload.testHtmlLoad($scope, item.tmpl).then(function () {
                    $scope.$broadcast('ReloadData-' + dlgKey, data);
                });
            }
        };

        $scope.selectedDataListFlag = false;
        var showInDataList = function (data) {
            var ctrl = appPath.editor + 'dialog-panels/selectedDataListCtrl.js';
            var tmpl = appPath.editor + 'dialog-panels/selectedDataListTmpl.html';
            dsLazyload.loadInclude($scope, 'selectedDataListTmpl', ctrl, tmpl).then(function () {
                $scope.$broadcast('SelectedDataListReload', data);
                $scope.selectedDataListFlag = true;
            });
        };

        // 刷新选择要素面板
        var refreshDataList = function (data) {
            $scope.$broadcast('SelectedDataListRefresh', data);
        };

        var closeDataList = function () {
            $scope.selectedDataListFlag = false;
        };

        var closeEditTool = function () {
            $scope.$broadcast('EditTool-Close');
        };

        var showEditTool = function (glt) {
            var data = null;
            if (glt) {
                data = {
                    geoLiveType: glt
                };
            }
            $scope.$broadcast('EditTool-Reload', data);
        };

        var showUtilityPage = function (data) {
            switch (data.type) {
                case 'adminOfLevel':
                case 'tmcTreePanel':
                    showInLeftFloatPanel(data);
                    break;
                case 'ScenePanel':
                case 'RestrictionTopoPanel':
                case 'createPoiPanel':
                case 'selpoiParentPanel':
                case 'samePoiPanel':
                case 'createPointAddressPanel':
                case 'messageAlert':
                case 'LaneConnexityPanel':
                    showInRightFloatPanel(data);
                    break;
                case 'CheckJobPanel':
                case 'roadCheckResult':
                case 'roadCheckQuality':
                case 'poiCheckResult':
                case 'batchJobPanel':
                case 'batchTranslatePanel':
                case 'autoJobPanel':
                case 'AdminJoinFacesPanel':
                case 'RdSameNodePanel':
                case 'RdSameLinkPanel':
                case 'RdCrossPanel':
                case 'ExternalQuality':
                case 'DeepInfoQuality':
                case 'tipListPanel':
                case 'pointAddressPanel':
                case 'AdvancedSearch':
                case 'poiFilterPanel':
                case 'poiDeepCheckResult':
                case 'historyVersion':
                case 'cmgBuildingJoinPoiPanel':
                case 'luFaceJoinPoiPanel':
                case 'trackInfoPanel':
                case 'StreetView':
                    showInDialog(data);
                    break;
                // case 'AdvancedSearchPanel':
                //     showInLeftAdvanceSearchPanel();
                //     break;
                default:
                    break;
            }
        };

        var closeUtilityPage = function (data) {
            switch (data.type) {
                case 'ScenePanel':
                    $scope.closeRightFloatPanel();
                    break;
                case 'adminOfLevel':
                    $scope.closeLeftFloatPanel();
                    break;
                case 'RestrictionTopoPanel':
                    $scope.closeRightFloatPanel();
                    break;
                case 'createPoiPanel':
                case 'selpoiParentPanel':
                case 'samePoiPanel':
                    $scope.closeRightFloatPanel();
                    break;
                case 'messageAlert':
                    $scope.closeRightFloatPanel();
                    break;
                case 'Check':
                case 'batchJobPanel':
                case 'autoJobPanel':
                case 'RdCrossPanel':
                case 'CheckJobPanel':
                case 'AdminJoinFacesPanel':
                case 'RdSameNodePanel':
                case 'RdSameLinkPanel':
                case 'poiFilterPanel':
                case 'cmgBuildingJoinPoiPanel':
                case 'luFaceJoinPoiPanel':
                    $scope.closeDialog(data.type);
                    break;
                case 'LaneConnexityPanel':
                    $scope.closeRightFloatPanel();
                    break;
                default:
                    break;
            }
        };

        var clearPage = function () {
            closeLeftPanel();
            closeRightPanel();
            $scope.closeLeftFloatPanel();
            $scope.closeRightFloatPanel();
            closeDataList();
            closeEditTool();
            $scope.closeLeftListPanel();
        };

        // 关闭与要素属性编辑相关的面板
        // 主要用于数据删除后的页面清理
        var closeDataPanel = function () {
            closeRightPanel();
            $scope.closeLeftFloatPanel();
            if ($rootScope.GeoLiveType === 'IXPOI') {
                closeLeftPanel();
            }
            closeEditTool();
        };

        var clearData = function () {
            objectEditCtrl.clear();
            $rootScope.CurrentObject = null;
            $rootScope.GeoLiveType = null;
            $rootScope.OperationType = null;
        };

        var _getAdjacentLinks = function (nodePid, geoLiveType, callback) {
            var linkType = new FM.uikit.Config.Feature().getLinkByNode(geoLiveType);
            var param = {
                type: linkType,
                data: {
                    nodePid: nodePid
                }
            };
            dsEdit.getByCondition(param).then(function (rest) {
                var links = [];
                if (rest) {
                    for (var i = 0; i < rest.data.length; i++) {
                        links.push(rest.data[i].pid);
                    }
                }
                if (callback) {
                    callback(links);
                }
            });
        };

        // add by chenx on 2017-8-1
        // 在加载要素前，临时记录要加载要素的dbId，当加载完成时，将此值记录到rootScope中
        // 用于判断加载的要素是否是当前大区库，以便区分是否可编辑
        var _tempDbId = 0;

        // 调用服务接口查询到要素全属性后进行的处理
        var _objectLoadedCallback = function (data, selectEvent) {
            // 数据刷新
            objectEditCtrl.setData(data, {
                region: App.Temp.accessType //  目前poi数据模型中用到了
            });

            $rootScope.CurrentObject = objectEditCtrl.data;
            $rootScope.GeoLiveType = objectEditCtrl.data.geoLiveType;
            $rootScope.OperationType = 'EDIT';
            // 通知组件CurrentObject加载完成
            $scope.$broadcast('ObjectLoaded', $rootScope.CurrentObject);
            // add by chenx on 2017-8-1
            // 控制要素是否可编辑
            // 目前用于控制当前大区库外的要素只能查看不可编辑
            $rootScope.Editable = _tempDbId === App.Temp.dbId;

            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var topoEditor = topoEditFactory.createTopoEditor(geoLiveType);

            if (geoLiveType === 'RDINTER' || geoLiveType === 'RDROAD' || geoLiveType === 'RDOBJECT') {
                $rootScope.Editable = true;

                var feaSele = null;
                for (var i = 0; i < singletons.length; i++) {
                    if (singletons[i] instanceof fastmap.mapApi.FeatureSelector) {
                        feaSele = singletons[i];
                    }
                }
                if (feaSele) {
                    var fea = feaSele.selectByFeatureId(data.pid, geoLiveType); // 解决由于服务返回crf的坐标是其中任意个点的坐标，web定位不准确的问题
                    if (fea) {
                        data.geometry = fea.geometry;
                    }
                }
            }

            // 页面属性面板切换
            if (FM.uikit.Config.isTip(geoLiveType)) {
                // tip编辑模式
                // 1.强制关闭左侧面板，包括tip查看面板
                // 2.关闭左侧浮动层
                closeLeftPanel(true);
                $scope.closeLeftFloatPanel();
                showInTipRightEditPanel();
            } else if (geoLiveType === 'IXPOI') {
                // 切换POI时关闭外业质检窗口
                delete $scope.dialogManager.ExternalQuality;
                delete $scope.dialogManager.DeepInfoQuality;
                showInPoiLeftViewPanel();
                showInPoiRightEditPanel();
            } else if (geoLiveType === 'IXPOINTADDRESS') {
                // index 下除了poi
                closeLeftPanel();
                $scope.closeLeftFloatPanel();
                showInIndexRightEditPanel();
            } else {
                // 道路要素编辑模式
                // 1.如果有tips正在查看，则不关闭左侧tips查看面板；否则关闭左侧面板
                // 2.关闭左侧浮动层
                closeLeftPanel();
                $scope.closeLeftFloatPanel();
                showInRoadRightEditPanel();
            }

            // 地图定位（向mapCtrl发定位指令）
            $scope.$broadcast('Map-LocateObject', {
                features: [data]
            });

            // 清除高亮(工具中用feedback加的高亮);
            eventCtrl.fire('clearHighLightINTool');

            // 地图高亮（向mapCtrl发高亮指令）
            $scope.$broadcast('Map-HighlightObject', {
                features: [objectEditCtrl.data]
            });

            // add by chenx on 2017-3-22
            // 显示地图顶部的操作按钮条，替代原来的鼠标周边半圆形工具条
            // 月编深度深度信息作业时不显示编辑工具
            // 不可编辑的要素不显示编辑工具
            if (!App.Temp.monthTaskType && $rootScope.Editable && topoEditor.canEdit($rootScope.CurrentObject)) {
                showEditTool(geoLiveType);
            } else {
                closeEditTool();
            }

            // commented by chenx on 2017-3-22
            // 如果是从地图选中，则显示地图编辑工具（向mapCtrl发指令）
            // if (selectEvent) {
            //     $scope.$broadcast('Map-LoadEditTool', {
            //         feature: objectEditCtrl.data,
            //         originalEvent: selectEvent
            //     });
            // }
        };

        var loadFeature = function (data) {
            var geoLiveType = data.feature.geoLiveType;
            var topoEditor = topoEditFactory.createTopoEditor(geoLiveType, null);
            if (!topoEditor) {
                swal({
                    title: geoLiveType + '类型要素未实现查询属性逻辑!',
                    type: 'error',
                    allowEscapeKey: false
                });
                return;
            }

            if (!topoEditor.canQuery(data.feature)) {
                return;
            }
            $scope.showLoading();
            topoEditor.query(data.feature)
                .then(function (res) {
                    if (res) {
                        _objectLoadedCallback(res, data.originalEvent);
                        $scope.hideLoading();
                    } else {
                        throw new Error('未查询到任何信息');
                    }
                })
                .catch(function (errMsg) {
                    closeDataPanel();
                    $scope.hideLoading();
                    swal('提示', errMsg, 'error');
                });
        };

        var loadTipForView = function (data) {
            // closeRightPanel();
            showInTipLeftViewPanel(data);
        };

        var loadTipForEdit = function (data) {
            var rowkey = data.feature.pid; // 兼容CanvasTip和Tip格式
            var geoLiveType = data.feature.geoLiveType;
            $scope.showLoading();
            dsFcc.getByRowkey(rowkey).then(function (rest) {
                _objectLoadedCallback(rest, data.originalEvent);
                $scope.hideLoading();
            });
        };

        var loadTip = function (data) {
            // 接边的Tip要进行编辑
            if (data.feature.geoLiveType === 'TIPBORDER') {
                loadTipForEdit(data);
            } else { // 其他的tips只是查看
                loadTipForView(data);
                eventCtrl.fire('clearHighLightINTool'); // 清除高亮(工具中用feedback加的高亮);
            }
        };

        var unifyFeature = function (features) {
            var _unify = function (feature) {
                var obj;
                if (feature instanceof FM.mapApi.render.DataModel) {
                    obj = FM.extend({}, {
                        pid: feature.properties.id,
                        geometry: feature.geometry
                    }, feature.properties);
                } else {
                    obj = FM.extend({}, feature);
                }
                return new FM.dataApi.Feature(obj);
            };

            var ret;
            if (FM.Util.isObject(features)) {
                ret = _unify(features);
            } else if (FM.Util.isArray(features)) {
                ret = [];
                for (var i = 0; i < features.length; i++) {
                    ret.push(_unify(features[i]));
                }
            } else {
                throw new Error('unifyObject: 不支持的数据类型');
            }
            return ret;
        };

        var loadObject = function (data) {
            // add by chenx on 2017-8-1, 针对不同大区库的数据的查询
            _tempDbId = data.feature.dbId || App.Temp.dbId;
            data.feature.dbId = _tempDbId;
            if (FM.uikit.Config.isTip(data.feature.geoLiveType)) {
                loadTip(data);
            } else if (FM.uikit.Config.isTrackPoint(data.feature.geoLiveType)) {
                $scope.$broadcast('reloadTrackPhoto', data.feature);
                eventCtrl.fire('clearHighLightINTool'); // 清除高亮(工具中用feedback加的高亮);
            } else {
                loadFeature(data);
            }
        };

        var _batchFeaturesLoadedCallback = function (data, batchType) {
            objectEditCtrl.setBatchData(data, batchType);

            $rootScope.CurrentObject = objectEditCtrl.data;
            $rootScope.GeoLiveType = objectEditCtrl.data.geoLiveType;
            $rootScope.OperationType = 'EDIT';

            // 显示左侧属性编辑面板切换
            showInLeftFloatPanel({
                type: 'BatchDataList',
                data: objectEditCtrl.datas
            });

            // 显示右侧属性编辑面板切换
            showInBatchRightPanel();

            // 地图高亮（向mapCtrl发高亮指令）
            $scope.$broadcast('Map-HighlightObject', {
                features: objectEditCtrl.datas
            });
            // 清除高亮(工具中用feedback加的高亮);
            eventCtrl.fire('clearHighLightINTool');

            if (!App.Temp.monthTaskType && batchType == 'trackSelect') {
                if ($rootScope.GeoLiveType.indexOf('LINK') >= 0) {
                    showEditTool('BATCHLINK');
                }
            } else {
                closeEditTool();
            }
        };

        var _batchTipsLoadedCallback = function (data) {
            var datas = [];
            for (var j = 0; j < data.length; j++) {
                datas.push(FM.dataApi.Tip.create(data[j]));
            }

            // 显示左侧属性编辑面板切换
            showInLeftFloatPanel({
                type: 'BatchTipsEditList',
                data: datas // datas // 为了不报错，暂时赋值未空数组;
            });
            
            // 清除高亮(工具中用feedback加的高亮);
            eventCtrl.fire('clearHighLightINTool');

            // 地图高亮（向mapCtrl发高亮指令）
            $scope.$broadcast('Map-HighlightObject', {
                features: datas
            });

            //  批量编辑tips状态时，关闭tips属性详情面板
            closeLeftPanel(true);
        };

        // 批量保存tips状态
        var _batchTipsSave = function (data) {
            dsFcc.batchTipsSave(data).then(function (rest) {

            });
        };

        // 查询tips
        var loadTipsForBatchEdit = function (data) {
            var rowkeys = [];
            for (var i = 0, len = data.features.length; i < len; i++) {
                // rowkeys.push(data[i].properties.id);
                rowkeys.push(data.features[i].id);
            }
            if (rowkeys.length > 0) {
                $scope.showLoading();
                dsFcc.getByRowkeys(rowkeys).then(function (rest) {
                    if (rest) {
                        _batchTipsLoadedCallback(rest);
                    }
                    $scope.hideLoading();
                });
            }
        };

        var testBatchRdLink = function (data, callback) {
            var form83Flag = false;
            data.forEach(function (it) {
                it.forms.forEach(function (itt) {
                    if (itt.formOfWay == 83) {
                        form83Flag = true;
                    }
                });
            });
            if (form83Flag) {
                swal({
                    title: '选择结果中包含移动式桥，请确认是否继续进行批量编辑？',
                    text: '移动式桥为无方向的道路限制，继续进行批量编辑可能产生错误数据。',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: true,
                    confirmButtonText: '确定',
                    confirmButtonColor: '#ec6c62'
                }, function (f) {
                    if (f) {
                        callback(data);
                    }
                });
            } else {
                callback(data);
            }
        };

        var loadFeaturesForBatchEdit = function (data) {
            // 批量编辑时，认为所有要素都在当前大区库，都可以编辑
            _tempDbId = App.Temp.dbId;

            // 目前只支持同一种要素的批量操作
            var pids = [];
            var geoLiveType = data.features[0].geoLiveType;
            for (var i = 0; i < data.features.length; i++) {
                pids.push(data.features[i].id || data.features[i].pid);
            }
            if (data.options) {
                $scope.batchType = data.options.type;
                if (pids.length > 0) {
                    $scope.showLoading();
                    dsEdit.getByPids(pids, geoLiveType).then(function (rest) {
                        if (rest) {
                            if (rest.length == 1) {
                                _objectLoadedCallback(rest[0]);
                            } else {
                                if (geoLiveType == 'RDLINK') {
                                    testBatchRdLink(rest, function (dd) {
                                        _batchFeaturesLoadedCallback(dd, $scope.batchType);
                                    });
                                } else {
                                    _batchFeaturesLoadedCallback(rest, $scope.batchType);
                                }
                            }
                        }
                        $scope.hideLoading();
                    });
                }
            }
        };

        var _getUpdatedFeatures = function (logs) {
            var ret = [];
            if (!logs) {
                return ret;
            }

            var types = [];
            var temp;
            for (var i = 0; i < logs.length; i++) {
                if (types.indexOf(logs[i].type) < 0) {
                    temp = FM.uikit.Config.Feature().getUIFeatureTypes(logs[i].type);
                    if (temp.length > 0) {
                        Array.prototype.push.apply(types, temp);
                    } else {
                        types.push(logs[i].type);
                    }
                }
            }
            var ftMap = FM.uikit.Config.getFeatureMapping();
            for (var k in ftMap) {
                if (ftMap.hasOwnProperty(k) && ret.indexOf(k) < 0) {
                    for (i = 0; i < types.length; i++) {
                        if (types[i].indexOf(k) >= 0) {
                            ret.push(k);
                            break;
                        }
                    }
                }
            }
            return ret;
        };

        var _getRelatedFeatures = function (data) {
            var ret = _getUpdatedFeatures(data.updateLogs);

            var dependOns;
            if (data.feature) {
                dependOns = FM.uikit.Config.getDependOn(data.feature.geoLiveType);
                dependOns.push(data.feature.geoLiveType);
            } else if (data.features && data.features.length > 0) {
                dependOns = FM.uikit.Config.getDependOn(data.features[0].geoLiveType);
                dependOns.push(data.features[0].geoLiveType);
            }
            if (dependOns) {
                for (var i = 0; i < dependOns.length; i++) {
                    if (ret.indexOf(dependOns[i]) < 0) {
                        ret.push(dependOns[i]);
                    }
                }
            }

            return ret;
        };

        /**
         * 执行保存后的页面处理：
         * 1.清理页面
         * 2.刷新关联图层
         * 3.重新加载对象
         * @param {Object} data 数据
         * @return {undefined}
         **/
        var afterSave = function (data) {
            $scope.$broadcast('Map-ClearMap');
            $scope.$broadcast('Map-RedrawFeatureLayer', {
                geoLiveTypes: _getRelatedFeatures(data)
            });
            loadObject({
                feature: data.feature
            });
        };

        var afterBatchSave = function (data) {
            $scope.$broadcast('Map-ClearMap');
            $scope.$broadcast('Map-RedrawFeatureLayer', {
                geoLiveTypes: _getRelatedFeatures(data)
            });
            loadFeaturesForBatchEdit(data);
        };

        var afterDelete = function (data) {
            $scope.$broadcast('Map-ClearMap');
            $scope.$broadcast('Map-RedrawFeatureLayer', {
                geoLiveTypes: _getRelatedFeatures(data)
            });
            refreshDataList(data);
            closeDataPanel();
            clearData();
        };

        $scope.openScenePanel = function () {
            showUtilityPage({
                type: 'ScenePanel'
            });
        };

        // 打开任务列表
        $scope.openTaskList = function () {
            var ctrl;
            var tmpl;
            var subTask = App.Util.getSessionStorage('SubTask');
            if (subTask.monthTaskType) { // 月编深度信息
                App.Temp.monthTaskType = subTask.monthTaskType;
                ctrl = './editor/components/left-panels/list/deepInfoListCtrl.js';
                tmpl = './editor/components/left-panels/list/deepInfoListTmpl.htm';
            } else { // 常规、点门牌
                // 左侧tips和poi列表显示
                ctrl = './editor/components/left-panels/list/leftListPanelCtrl.js';
                tmpl = './editor/components/left-panels/list/leftListPanelTmpl.htm';
            }
            dsLazyload.loadInclude($scope, 'leftListPanelTmpl', ctrl, tmpl).then(function () {
                if ($scope.leftListPanelFlag) {
                    $scope.leftListPanelFlag = false;
                } else {
                    closeLeftPanel(true);
                    $scope.closeLeftFloatPanel();
                    $scope.closeLeftAdvanceSearchPanel();
                    $scope.leftListPanelFlag = true;
                    $scope.$broadcast('resetActiveType', 1);
                    $scope.$broadcast('refreshTable', 1);
                }
            });
        };

        // 加载元数据
        var loadMetaData = function () {
            var promises = [];
            // 查询全部的小分类数据
            var param = {
                mediumId: '',
                region: 0
            };
            promises.push(dsMeta.getKindList(param).then(function (kindData) {
                $scope.metaData.kindFormat = {};
                $scope.metaData.kindList = [];
                for (var i = 0; i < kindData.length; i++) {
                    $scope.metaData.kindFormat[kindData[i].kindCode] = {
                        kindId: kindData[i].id,
                        kindName: kindData[i].kindName,
                        level: kindData[i].level,
                        extend: kindData[i].extend,
                        parentFlag: kindData[i].parent,
                        chainFlag: kindData[i].chainFlag,
                        dispOnLink: kindData[i].dispOnLink,
                        mediumId: kindData[i].mediumId
                    };
                    $scope.metaData.kindList.push({
                        value: kindData[i].kindCode,
                        text: kindData[i].kindName,
                        mediumId: kindData[i].mediumId
                    });
                }
            }));
            // 查询全部的品牌数据
            param = {
                kindCode: ''
            };
            promises.push(dsMeta.getChainList(param).then(function (chainData) {
                $scope.metaData.allChain = chainData;
            }));
            promises.push(dsMeta.getChargingChainList({
                kindCode: '230218'
            }).then(function (chargingData) {
                $scope.metaData.charingChain = chargingData;
            }));
            promises.push(dsMeta.getFocus().then(function (data) { // 可为父的poi的pid
                $scope.metaData.parentPoiNums = data;
            }));
            promises.push(dsMeta.getAllowContacts().then(function (data) {  // 查询允许输入的手机号码前缀
                $scope.metaData.allowContacts = data;
            }));

            return promises;
        };

        var buildWebsocket = function () {
            // 创建一个Socket实例
            var sock = new ReconnectingWebSocket('ws://' + App.Util.getFullUrl('sys/sysMsg/webSocketServer').substr(5));
            sock.onopen = function (e) {
                $timeout(function () {
                    $scope.$broadcast('sockStatus', e);
                });
            };
            sock.onmessage = function (e) {
                $timeout(function () {
                    $scope.$broadcast('getMessage', JSON.parse(e.data));
                });
            };
            sock.onclose = function (e) {
                $timeout(function () {
                    $scope.$broadcast('sockStatus', e);
                });
            };
            window.onbeforeunload = function () {
                $timeout(function () {
                    sock.close();
                });
            };
        };

        var loadComponents = function () {
            // // 右侧工具条-用户
            $scope.rightUserToolTmpl = './editor/components/toolbars/userToolTmpl.htm';
            $scope.searchToolTmpl = './editor/components/toolbars/searchToolTmpl.htm';
            // 消息推送
            $scope.logMsgTpl = '@components/tools/tpls/assist-tools/logMessageTpl.html';
            $timeout(function () {
                buildWebsocket();
            });

            $ocLazyLoad.load('./editor/components/toolbars/editToolCtrl.js').then(function () {
                $scope.editToolTmpl = './editor/components/toolbars/editToolTmpl.htm';
            });

            // 专题图图例
            $ocLazyLoad.load('./editor/components/toolbars/thematicFigureCtrl.js').then(function () {
                $scope.thematicFigureTmpl = './editor/components/toolbars/thematicFigureTmpl.html';
            });
        };

        var monthTaskInit = function () {
            // var poiData = {
            //     feature: new FM.dataApi.Feature({
            //         pid: App.Util.getUrlParam('pid'),
            //         geoLiveType: 'IXPOI'
            //     })
            // };
            // // loadFeature(poiData);
            // loadObject(poiData);
            $scope.openTaskList();
        };

        var getPidFromLog = function (obj, logs) {
            var ret = {};
            var features = FM.uikit.Config.Feature().getMapping();
            var flag = false;
            for (var i = 0; i < logs.length; i++) {
                if (obj.pid == logs[i].pid && obj.type == logs[i].type && logs[i].op == '删除') {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                for (var j = 0; j < logs.length; j++) {
                    if (features[logs[j].type] && logs[j].op == '新增') {
                        ret.pid = logs[j].pid;
                        ret.geoLiveType = logs[j].type;
                        break;
                    }
                }
            } else {
                ret.pid = obj.pid;
                ret.geoLiveType = obj.type;
            }
            return ret;
        };

        var _afterFeatureSaved = function (editType, resp) {
            var pid;
            var simpleFeature;
            if ($rootScope.OperationType === 'ADD') {
                // 只有分歧的branchType为5（实景图）或7（连续分歧）的时候传rowId;
                if ($rootScope.CurrentObject.geoLiveType === 'RDREALIMAGE' || $rootScope.CurrentObject.geoLiveType === 'RDSERIESBRANCH') {
                    pid = resp.log[0].rowId;
                } else {
                    pid = resp.pid;
                }
                simpleFeature = new FM.dataApi.Feature({
                    pid: pid,
                    geoLiveType: $rootScope.CurrentObject.geoLiveType
                });
            } else if ($rootScope.OperationType === 'EDIT') {
                if (editType === 'pathVertexMove') {
                    simpleFeature = new FM.dataApi.Feature({
                        pid: resp.pid,
                        geoLiveType: objectEditCtrl.data.geoLiveType
                    });
                } else if (editType === 'createLinkSpeedLimit') {
                    var test = featCodeCtrl.getFeatCode();
                    if (featCodeCtrl.getFeatCode().data.speedType === 3) {
                        simpleFeature = new FM.dataApi.Feature({
                            geoLiveType: 'RDLINKSPEEDLIMITDEPENDENT'
                        });
                    } else {
                        simpleFeature = new FM.dataApi.Feature({
                            pid: objectEditCtrl.data.linkPid,
                            direct: objectEditCtrl.data.direct,
                            geoLiveType: 'RDLINKSPEEDLIMIT'
                        });
                    }
                } else {
                    var snapObj = {
                        pid: objectEditCtrl.data.pid,
                        type: objectEditCtrl.data.geoLiveType
                    };
                    var newObj = getPidFromLog(snapObj, resp.log);
                    simpleFeature = new FM.dataApi.Feature({
                        pid: newObj.pid,
                        geoLiveType: newObj.geoLiveType
                    });
                }
            }
            if (simpleFeature) {
                afterSave({
                    feature: simpleFeature,
                    updateLogs: resp.log
                });
            }
        };

        var _afterTipSaved = function (editType, resp) {
            var simpleFeature = new FM.dataApi.Tip({
                pid: resp.rowkey,
                geoLiveType: $rootScope.CurrentObject.geoLiveType
            });

            afterSave({
                feature: simpleFeature,
                updateLogs: [{
                    type: $rootScope.CurrentObject.geoLiveType
                }]
            });
        };

        var onSelectObject = function (data) {
            loadObject(data);
            // add by chenx on 2017-9-4
            // 加载要素后，重启上一次启动的选择要素的流程
            if (selectCtrl && selectCtrl.status === 'Aborted') {
                selectCtrl.run();
            }
        };

        var initialize = function () {
            $scope.showLoading();
            var onlineJobStack = JSON.parse(sessionStorage.getItem('ON-LINE-JOB-STACK'));
            $rootScope.onLineJobStack = onlineJobStack ? onlineJobStack : null;
            App.Temp.sceneId = 1; // 默认显示常规场景

            // add by chenx on 2017-4-27
            // 解决切换任务后，地图不能正常加载的问题
            $timeout(function () {
                $scope.$broadcast('Map-Initialize');
            }, 100);

            var promises = loadMetaData();
            $q.all(promises).then(function () {
                $scope.sceneToolFlag = true;
                if (App.Temp.monthTaskType) {
                    $scope.sceneToolFlag = false;
                    monthTaskInit();
                }
                // 页面加载完成
                $scope.hideLoading();
            });

            loadComponents();
        };

        // 提交poi后刷新列表
        $scope.$on('SubmitPoiList', function (event, data) {
            $scope.$broadcast('refreshTable', data);
        });

        // 选中单个要素进行编辑
        $scope.$on('ObjectSelected', function (event, data) {
            data.feature = unifyFeature(data.feature); // 对渲染模型与数据模型进行格式统一
            onSelectObject(data);
        });

        // 单个要素保存完成
        $scope.$on('ObjectUpdated', function (event, data) {
            afterSave(data);
        });

        // 单个要素删除完成
        $scope.$on('ObjectDeleted', function (event, data) {
            afterDelete(data);
        });

        // 批量编辑
        $scope.$on('BatchEdit', function (event, data) {
            loadFeaturesForBatchEdit(data);
        });

        // 批量编辑TIPS状态
        $scope.$on('BatchEditTips', function (event, data) {
            // _batchTipsLoadedCallback(data);
            loadTipsForBatchEdit(data);
        });

        // 批量保存修改后的tips状态
        $scope.$on('BatchEditTipsSave', function (event, data) {
            _batchTipsSave(data);
        });

        // 批量编辑完成
        $scope.$on('BatchUpdated', function (event, data) {
            afterBatchSave(data);
        });

        // 关闭高级搜索面板;
        $scope.$on('closeLeftFloatAdvanceSearchPanel', function () {
            $scope.closeLeftAdvanceSearchPanel();
        });

        // 隐藏高级搜索结果面板;
        $scope.$on('hideAdvanceResultLeftPanel', function () {
            $scope.hideLeftAdvanceSearchPanel();
        });

        // tip切换
        $scope.$on('ViewedTipChanged', function (event, data) {
            // 定位tips
            $scope.$broadcast('Map-LocateObject', {
                features: [{
                    geometry: data.data.geometry.g_location
                }]
            });

            // 地图高亮（向mapCtrl发高亮指令）
            $scope.$broadcast('Map-HighlightObject', {
                features: [data.data]
            });
        });

        // 轨迹点切换
        $scope.$on('ViewedTrackNodeChanged', function (event, data) {
            $scope.$broadcast('Map-LocateObject', {
                features: [data]
            });
        });

        // 高亮多个tips
        $scope.$on('Multi-Highlight', function (event, datas) {
            $scope.$broadcast('Map-HighlightObject', {
                features: datas
            });
        });

        // 定位
        $scope.$on('LocateObject', function (event, data) {
            // 定位tips
            $scope.$broadcast('Map-LocateGeoJsonObject', {
                features: [data.feature]
            });
        });

        // 显示或隐藏左侧面板
        $scope.$on('LeftListPanel', function (event, data) {
            $scope.leftListPanelFlag = data;
        });
        
        // 精细化任务作业要素类型
        $scope.$on('RefreshWorkGeo', function (event, data) {
            $scope.workGeo = data;
        });
        
        // 全屏和左边显示列表
        $scope.$on('LeftPanelFullAndLeft', function (event, data) {
            if (data.flag) {
                $scope.leftListStyle = {
                    width: '100%'
                };
                $scope.leftContainerStyle = {
                    width: '100%',
                    'z-index': 11
                };
            } else {
                $scope.leftListStyle = {
                    width: '300px'
                };
                $scope.leftContainerStyle = {
                    width: '300px',
                    'z-index': 11
                };
            }
        });

        // 显示信息面板
        $scope.$on('ShowInfoPage', function (event, data) {
            showUtilityPage(data);
        });

        // 关闭信息面板
        $scope.$on('CloseInfoPage', function (event, data) {
            closeUtilityPage(data);
        });

        // 清理页面显示
        $scope.$on('ClearPage', function (event, data) {
            clearPage();
        });

        // 地图场景发生变化
        $scope.$on('SceneChanged', function (event, data) {
            $scope.$broadcast('Map-ClearMap');
        });

        /**
         * 监听数据加载请求事件
         */
        $scope.$on('Data-GetByPid', function (event, data) {
            dsEdit.getByPid(data.pid, data.geoLiveType).then(function (rest) {
                data.callback(rest);
            });
        });

        /**
         * 监听数据加载请求事件
         */
        $scope.$on('Data-GetByCondition', function (event, data) {
            dsEdit.getByCondition(data.param).then(function (rest) {
                data.callback(rest);
            });
        });

        // 道路作业面板是否展开
        $scope.$on('OPENRDLANE', function (event, data) {
            showInRoadRightEditPanel();
        });
        // 道路作业面板是否展开
        $scope.$on('OPENRDLANETOPO', function (event, data) {
            $scope.clmPanelOpened = true;
            $scope.rdLaneTopoPanelTpl = '@components/road/tpls/attr_lane_tpl/rdLaneTopoTpl.html';
            $timeout(function () {
                $scope.$broadcast('resetTopoMap');
            });
        });
        // 直接点关闭按钮，车道连通面板隐藏
        $scope.$on('CLOSERDLANETOPO', function (event, data) {
            $scope.clmPanelOpened = false;
        });
        // 保存后的关闭，需要有$apply()才能生效
        $scope.$on('CLOSERDLANETOPODETAIL', function (event, data) {
            $scope.clmPanelOpened = false;
            $scope.$apply();
        });

        /**
         * 监听数据保存请求事件
         */
        $scope.$on('Data-Save', function (event, data) {
            if (FM.uikit.Config.isTip($rootScope.CurrentObject.geoLiveType)) {
                if ($rootScope.CurrentObject.geoLiveType === 'TIPBORDER') {
                    dsFcc.addJoinBorder(data.param).then(function (rest) {
                        if (rest !== -1) {
                            _afterTipSaved(data.editType, rest);
                        }
                    });
                }
            } else {
                dsEdit.save(data.param).then(function (rest) {
                    if (rest) {
                        _afterFeatureSaved(data.editType, rest);
                    }
                });
            }
        });

        // 监听地图工具面板的打开/关闭
        $scope.$on('Map-ToolbarPanelOpened', function () {
            $scope.mapToolbarPanelFlag = true;
            $scope.closeRightFloatPanel();
        });

        $scope.$on('Map-ToolbarPanelClosed', function () {
            $scope.mapToolbarPanelFlag = false;
            resetRightPanelOpened();
        });

        $scope.$on('Dialog-Closed', function () {
            $scope.closeDialog();
        });

        $scope.$on('Dialog-ResetTitle', function (event, data) {
            var dlgKey = data.type;
            if ($scope.dialogManager[dlgKey]) {
                $scope.dialogManager[dlgKey].handler.resetTitle(data.title);
            }
        });

        // tips质检窗口弹出
        $scope.$on('switchQualityModal', function (event, data) {
            $scope.showQuality = data.flag;
            if (data.flag) {
                $scope.QuaPanelTmpl = '@components/road/tpls/attr_tips_tpl/enterErrorTpl.html';
                $timeout(function () {
                    $scope.$broadcast('refreshEnterError', data);
                });
            }
            if (data.close) {
                $scope.$broadcast('refreshEnterError', false);
            }
        });

        $scope.$on('getQuaCheckStatus', function (event, data) {
            $scope.quaCheckStatus = data;
        });

        // 质检新增
        $scope.$on('saveTipQualityData', function (event, data) {
            $scope.$broadcast('refreshTipQuality', data);
        });

        // 关闭质检窗口
        var closeQuaEnterModal = function () {
            $scope.showQuality = false;
            $scope.QuaPanelTmpl = null;
        };

        $scope.$on('CloseQualityModal', closeQuaEnterModal);

        // 传递tips数据
        $scope.$on('getTipDataEvent', function (event, data) {
            $scope.tipsData = data;
        });

        $scope.$on('afterSaveQuaData', function (event, data) {
            $scope.$broadcast('refreshTipsQuaPanel', true);
        });

        // 刷新poi照片页面
        $scope.$on('refreshPoiViewPanel', function (event, data) {
            $scope.$broadcast('PoiLeftViewPanelReload');
        });

        $scope.$on('Map-LocationByCoordinate', function (event, data) {
            $scope.$broadcast('LocationByCoordinate', data);
        });

        $scope.$on('Map-EnableTool', function (event, data) {
            // modified by chenx on 2017-8-25
            // 新地图工具启动时，清理页面
            // 2017-8-31：改为只关dataList，因为备选要素列表存在的情况下，可能存在编辑流程不能正常关闭的问题
            // clearPage();
            closeDataList();
            closeEditTool();
            if (data) {
                if (data.operation) {
                    $rootScope.OperationType = data.operation;
                }
                if (data.geoLiveType) {
                    $rootScope.GeoLiveType = data.geoLiveType;
                }
            }
        });

        $scope.$on('Map-ToolEnabled', function (event, data) {
            showEditTool();
            // add by chenx on 2017-9-4
            // 工具启动时，如果是选择工具则记录；如果不是则清空
            // 用于记录最近一次的选择流程，以便在编辑要素后重启该选择流程
            if (data && data.editCtrl && data.editCtrl instanceof FM.uikit.editControl.SelectControl) {
                selectCtrl = data.editCtrl;
            } else {
                selectCtrl = null;
            }
        });

        // 打开loading
        $scope.$on('Show-Loading', function (event, data) {
            $scope.loading.flag = data;
        });

        // 打开专题图图例面板
        $scope.$on('Open-ThematicFigureBar', function (event, data) {
            $scope.thematicFigureFlag = true;
            $scope.$broadcast('Reload-ThematicFigureBar', data);
        });

        // 关闭专题图图例面板
        $scope.$on('Close-ThematicFigureBar', function (event, data) {
            $scope.thematicFigureFlag = false;
        });

        // 关闭操作按钮栏
        $scope.$on('Close-EditTool', function (event, data) {
            closeEditTool();
        });

        //  获取轨迹照片 url 中转通信
        $scope.$on('Photo-Link-POI', function () {
            $scope.$broadcast('Photo-Link-POI-Query');
        });

        //  获取轨迹照片 url 中转通信
        $scope.$on('Photo-Link-POI-Url', function (event, data) {
            $scope.$broadcast('Photo-Link-POI-Upload', data);
        });

        // 接受地图移动后的事件，并向子窗体发送事件
        $scope.$on('LinkageChildWin', function (event, data) {
            if (window.newOpenWindow) {
                var center = data.target.getCenter();
                center = center.lat + ',' + center.lng;
                var zoom = data.target.getZoom();
                // var url = 'http://' + window.location.host + '/apps/webEditor/editorHis';
                var baseUrl = window.location.origin + window.location.pathname;
                var url = baseUrl + '#/editorHis';
                var message = {
                    center: center,
                    zoom: zoom
                };
                window.newOpenWindow.postMessage(message, url);
            }
        });

        var openNewWindow = function (hisDbId) {
            if (!hisDbId) {
                swal('历史版本的DBID有误！');
                return;
            }
            // var url = 'http://' + window.location.host + '/apps/webEditor/#/editorHis?access_token=' + App.Temp.accessToken + '&hisDbId=' + hisDbId;
            var baseUrl = window.location.origin + window.location.pathname;
            var url = baseUrl + '#/editorHis?access_token=' + App.Temp.accessToken + '&hisDbId=' + hisDbId;
            var param = 'width=' + (window.screen.width - 14) + ',height=' + (window.screen.height - 100);
            window.newOpenWindow = window.open(url, '历史版本页面', param); // 将打开的新窗体的对象存在window中
        };

        $scope.$on('ShowHistoryVersion', function (event, data) {
            var version = data.version;
            var key = Object.keys(version);
            if (key.length > 1) {
                showUtilityPage({
                    type: 'historyVersion',
                    data: data
                });
                return;
            }

            var dbIds = data.version[key[0]];
            var hisDbId;
            for (var i = 0; i < dbIds.length; i++) {
                if (App.Temp.dbId == dbIds[i].currentDbId) {
                    hisDbId = dbIds[i].hisDbId;
                }
            }
            openNewWindow(hisDbId);
        });

        $scope.$on('Selected-HistoryVersion', function (event, data) {
            var sersions = data.hisVersion;
            var hisDbId;
            for (var i = 0; i < sersions.length; i++) {
                if (App.Temp.dbId == sersions[i].currentDbId) {
                    hisDbId = sersions[i].hisDbId;
                }
            }
            openNewWindow(hisDbId);
        });


        /**
         * 获取App.Temp对象数据（此方法需要绑定到window中，原因是子窗体需要调用此方法来获取）
         * @method getWindowAppTemp
         * @author wuzhen
         * @date   2018-01-05
         * @return {Object} App.Temp
         */
        window.getWindowAppTemp = function () {
            return App.Temp;
        };

        // 接收子窗体通过window.postMessage发送过来的数据
        window.addEventListener('message', function (e) {
            $scope.$broadcast('Map-LocationOrZoom', e.data);
        });

        /* start 事件监听*******************************************************************/
        eventCtrl.on(FM.event.EventTypes.OBJECTSELECTED, function (data) {
            $scope.$broadcast('Map-ClearMap');
            if (data.features.length == 1) {
                closeDataList();
                onSelectObject({
                    feature: unifyFeature(data.features[0]), // 对渲染模型与数据模型进行格式统一
                    originalEvent: data.event ? data.event.originalEvent : null
                });
            } else {
                clearPage();
                data.features = unifyFeature(data.features);
                showInDataList(data);
            }
        });

        eventCtrl.on(FM.event.EventTypes.BATCHOBJECTSELECTED, function (data) {
            $scope.$broadcast('Map-ClearMap');
            clearPage();

            if (!data.features.length) {
                return;
            }

            var type = data.features[0].type;
            if (type === 'tips') {
                loadTipsForBatchEdit(data);
            } else {
                loadFeaturesForBatchEdit(data);
            }
        });

        eventCtrl.on(FM.event.EventTypes.SHOWOBJECT, function (data) {
            _objectLoadedCallback(data.data);
        });

        // 显示二级信息面板********/
        eventCtrl.on(FM.event.EventTypes.PARTSOPENPANEL, function (data) {
            showUtilityPage({
                type: data.panelName,
                data: data.data
            });
        });

        eventCtrl.on(FM.event.EventTypes.PARTSREFRESH, function (data) {
            showUtilityPage({
                type: data.panelName,
                data: data.data
            });
        });

        // 监听关闭二级信息面板
        eventCtrl.on(FM.event.EventTypes.PARTSCLOSEPANEL, function (data) {
            // 解决某些情况下不能关闭的问题（应该是angular与其他程序交互时可能不执行apply导致的，原因未知）
            $timeout(function () {
                closeUtilityPage({
                    type: data.panelName
                });
            }, 10);
        });

        // 响应选择要素类型变化事件，清除要素页面的监听事件
        eventCtrl.on(FM.event.EventTypes.SELECTEDFEATURETYPECHANGE, function (data) {
            eventCtrl.off(FM.event.EventTypes.SAVEPROPERTY);
            eventCtrl.off(FM.event.EventTypes.DELETEPROPERTY);
            eventCtrl.off(FM.event.EventTypes.CANCELEVENT);
            eventCtrl.off(FM.event.EventTypes.SELECTEDFEATURECHANGE);
        });

        $scope.$on('$destroy', function () {
            destorySingletons();
            // 在注销界面的时候，将对应事件off掉
            eventCtrl.off(FM.event.EventTypes.PARTSOPENPANEL);
            eventCtrl.off(FM.event.EventTypes.PARTSREFRESH);
            eventCtrl.off(FM.event.EventTypes.SHOWOBJECT);
            eventCtrl.off(FM.event.EventTypes.BATCHOBJECTSELECTED);
            eventCtrl.off(FM.event.EventTypes.OBJECTSELECTED);
        });

        initialize();
    }
]);
