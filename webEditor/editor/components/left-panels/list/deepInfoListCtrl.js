/**
 * Created by wangmingdong on 2017/8/25.
 */

angular.module('app').controller('deepInfoListCtrl', ['$scope', 'dsColumn', '$ocLazyLoad', 'uiGridConstants',
    function ($scope, dsColumn, $ocLazyLoad, uiGridConstants) {
        var eventController = fastmap.event.EventController.getInstance();
        // 显示列表类型
        $scope.typeList = [
            { name: 'POI', id: 1 }
        ];

        // poi tab名称
        $scope.tabNames = [
            { name: '待作业', id: 1 },
            { name: '待提交', id: 2 }
        ];

        $scope.initData = function () {
            // $scope.tabNames = $scope.tabPoiName;
            var subTask = App.Util.getSessionStorage('SubTask');
            $scope.subQuality = subTask.qcTaskFlag;
            $scope.activeType = 1;
            $scope.listTitleContainerStyle = {
                'background-image': "url('../../images/webEditor/left-panel/bg2.png')",
                width: '300px'
            };
            $scope.leftPanelFull = false;
            $scope.$emit('LeftPanelFullAndLeft', false);
            eventController.fire('getDeepList', { status: $scope.activeType });
            $ocLazyLoad.load('./editor/components/left-panels/list/deepInfoTableCtrl.js').then(function () {
                $scope.loadDeepTableTpl = './editor/components/left-panels/list/deepInfoTableTmpl.htm';
            });
        };

        // 申请数据
        $scope.applyData = function () {
            $scope.$emit('Show-Loading', true);
            var param = {
                dbId: App.Temp.dbId,
                taskId: App.Temp.subTaskId,
                secondWorkItem: App.Temp.monthTaskType,
                firstWorkItem: 'poi_deep',
                isQuality: App.Temp.qcTaskFlag
            };
            dsColumn.applyDeepData(param).then(function (data) {
                $scope.$emit('Show-Loading', false);
                /*
                *  data = -1 data.data返回null情况，直接提示errorMsg
                *  data > 1 申请0或者大于0
                * */
                if (data > -1) {
                    swal('提示', '申请成功，共申请到' + data + '条数据。', 'info');
                    $scope.applyDataCount = data;
                    if (data) {
                        $scope.$emit('SubmitPoiList', $scope.activeType);
                    }
                }
            });
        };
        
        // 抽取数据
        $scope.extractData = function () {
            $scope.$emit('Show-Loading', true);
            var param = {
                dbId: App.Temp.dbId,
                subTaskId: App.Temp.subTaskId,
                secondWorkItem: App.Temp.monthTaskType,
                isQuality: App.Temp.qcTaskFlag,
                firstWorkItem: 'poi_deep'
            };
            dsColumn.extractData(param).then(function (data) {
                $scope.$emit('Show-Loading', false);
                swal('提示', '抽取成功，共抽取到' + data + '条数据。', 'info');
                $scope.applyDataCount = data;
                if (data) {
                    $scope.$emit('SubmitPoiList', $scope.activeType);
                }
            });
        };

        // 回车搜索POI
        $scope.doSearchParPoiList = function (e) {
            var code = e.keyCode;
            if (code == 13) { // 按enter键时触发，并且只对poi标签有效
                $scope.searchParContent();
            }
        };
        
        // 搜索POI
        $scope.searchParContent = function () {
            $scope.$broadcast('getSearchTable', $scope.searchParText);
        };

        // 切换作业类型
        $scope.changeType = function (type) {
            $scope.activeType = type;
            $scope.$broadcast('refreshTable', type);
            // $scope.$emit('SubmitPoiList', type);
            eventController.fire('getDeepList', { status: $scope.activeType });
        };

        $scope.openTipList = function () {
            eventController.fire(FM.event.EventTypes.PARTSOPENPANEL, { panelName: 'tipListPanel' });
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
