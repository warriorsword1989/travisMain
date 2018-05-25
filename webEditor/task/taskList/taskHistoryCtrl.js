/**
 * Created by zhaohang on 2016/12/6.
 */

angular.module('app').controller('taskHistoryCtrl', ['$scope', 'dsManage', '$timeout', function ($scope, dsManage, $timeout) {
    $scope.taskHistoryData = [];
    var param = {
        platForm: 1,
        snapshot: 1,
        status: 0,
        pageSize: 1000
    };
    dsManage.getSubtaskListByUser(param).then(function (item) {
        var data = item.data.result;
        for (var i = 0; i < data.length; i++) {
            switch (data[i].type) {
                case 0:
                    data[i].type = 'POI子任务';
                    break;
                case 1:
                    data[i].type = '道路子任务';
                    break;
                case 2:
                    data[i].type = '一体化子任务';
                    break;
                case 3:
                    data[i].type = '一体化_GRID粗编子任务';
                    break;
                case 4:
                    data[i].type = '一体化_区域粗编子任务';
                    break;
                case 5:
                    data[i].type = '多源POI子任务';
                    break;
                case 6:
                    data[i].type = '代理店子任务';
                    break;
                case 7:
                    data[i].type = 'POI专项子任务';
                    break;
                case 8:
                    data[i].type = '道路_GRID精编子任务';
                    break;
                case 9:
                    data[i].type = '道路_GRID粗编子任务';
                    break;
                case 10:
                    data[i].type = '道路区域专项子任务';
                    break;
                default:
                    break;
            }
            data[i].planStartDate = Utils.dateFormat(data[i].planStartDate);
            data[i].planEndDate = Utils.dateFormat(data[i].planEndDate);
        }
        $scope.taskHistoryData = data;
        $scope.gridOptions.totalItems = data.length;
        $scope.gridOptions.data = data;
    });

    /**
     * 序号展示
     * @returns {string} <div><div/>
     */
    function getIndex() {
        return '<div class="ui-grid-cell-contents"><span style="vertical-align: middle">{{grid.appScope.caculateIndex(grid,row)}}</span></div>';
    }
    $scope.caculateIndex = function (grid, row) {
        var index = (grid.appScope.currentPage - 1) * grid.appScope.currentPageSize + grid.renderContainers.body.visibleRowCache.indexOf(row) + 1;
        if (index < 10) {
            index = '0' + index;
        }
        return index;
    };

    /**
     * 状态列格式化
     * @returns {string} <div><div/>
     */
    function getStatus() {
        var html = '<div class="ui-grid-cell-contents">已关闭</div>';
        return html;
    }
    $scope.currentPage = 1;
    $scope.currentPageSize = 20;
    $scope.loadingFlag = false;
    /**
     * 初始化历史任务列表表格
     * @method initHisTaskTable
     * @return {undefined}
     */
    function initHisTaskTable() {
        $scope.gridOptions = {
            enableFiltering: true,
            enableColumnMenus: false,
            useExternalPagination: false,
            paginationPageSizes: [20], // 每页显示个数选项
            paginationCurrentPage: 1, // 当前的页码
            paginationPageSize: 20, // 每页显示个数
            paginationTemplate: './task/taskGridPagerTmpl.htm',
            // paginationTemplate: '@components/tools/uiGridPager/uiGridPagerTmpl.htm',
            noUnselect: false,
            enableFullRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: true,
            modifierKeysToMultiSelect: false,
            columnDefs: [{
                field: 'pageIndex',
                displayName: '序号',
                minWidth: 30,
                visible: true,
                enableSorting: false,
                enableFiltering: false,
                cellTemplate: getIndex
            }, {
                field: 'subtaskId',
                displayName: 'subtaskId',
                minWidth: 30,
                enableFiltering: false,
                visible: true,
                enableSorting: false
            }, {
                field: 'name',
                displayName: '子任务名称',
                minWidth: 400,
                enableFiltering: false,
                enableSorting: false,
                visible: true
            }, {
                field: 'type',
                displayName: '子任务类型',
                minWidth: 50,
                enableFiltering: false,
                enableSorting: false,
                visible: true
            }, {
                field: 'planStartDate',
                displayName: '开始时间',
                minWidth: 50,
                enableFiltering: false,
                enableSorting: false,
                visible: true
            }, {
                field: 'planEndDate',
                displayName: '结束时间',
                minWidth: 50,
                enableFiltering: false,
                enableSorting: false,
                visible: true
            }, {
                field: 'status',
                displayName: '状态',
                minWidth: 50,
                enableFiltering: false,
                enableSorting: false,
                visible: true,
                cellTemplate: getStatus
            }],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                // 分页事件;
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    $scope.currentPage = newPage;
                    $scope.currentPageSize = pageSize;
                });
            }
        };
    }

    /**
     * 获取当前屏幕高度
     * @method getClientHeight
     * @return {undefined}
     */
    var getClientHeight = function () {
        $scope.wHeight = document.documentElement.clientHeight;
    };

    /**
     * 监听窗口缩放
     */
    $scope.$on('resizeTaskTable', function (event, data) {
        getClientHeight();
    });

    getClientHeight();
    initHisTaskTable();
}]);
