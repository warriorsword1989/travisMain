/**
 * Created by wangmingdong on 2017/8/25.
 */

angular.module('app').controller('deepInfoTableCtrl', ['$scope', 'uibButtonConfig', 'dsEdit', 'dsColumn', 'appPath', '$timeout', 'uiGridConstants',
    function ($scope, uibBtnCfg, dsEdit, dsColumn, appPath, $timeout, uiGridConstants) {
        var eventCtrl = fastmap.event.EventController.getInstance();
        $scope.leftPanelAll = false;
        $scope.isLoading = false;
        // 由于切换全屏后会导致高度变化，用它来控制表格显示隐藏。当放大或错小后再显示表格，防止抖动；
        $scope.showTable = true;
        $scope.wHeight = document.documentElement.clientHeight - 110;
        $scope.searchModel = { status: 1, pidName: $scope.searchText };
        $scope.currentPage = 1;
        $scope.currentPageSize = 15;
        // 获取ui-grid所需的数据;
        var getData = (function () {
            var cache = {};
            return function (flag) {
                if (flag) cache = {};
                var cacheType = $scope.searchModel.status + '-' + ($scope.searchModel.searchText ? $scope.searchModel.searchText : 'all');
                if (cache[cacheType] && !$scope.applyDataCount) {
                    $scope.gridOptions.totalItems = cache[cacheType].total;
                    $scope.gridOptions.data = cache[cacheType].data;
                } else {
                    $scope.isLoading = true;
                    // 记录查询状态，防止频繁切换，出现错位
                    var _status = $scope.searchModel.status;
                    dsColumn.queryDeepDataList($scope.searchModel).then(function (data) {
                        if (data) {
                            $scope.gridOptions.totalItems = data.total;
                            var currentResult = [];
                            var poiPids = [];
                            $scope.gridOptions.data = data.rows.forEach(function (item, index) {
                                poiPids.push(item.pid);
                                currentResult.push(item);
                            });
                            $scope.gridOptions.data = currentResult;
                            // 缓存数据;
                            cache[cacheType] = {};
                            cache[cacheType].total = data.total;
                            cache[cacheType].data = currentResult;
                            sessionStorage.setItem('deepPids', poiPids);
                        } else {
                            sessionStorage.setItem('deepPids', []);
                        }
                        $scope.isLoading = false;
                        $scope.$emit('resetActiveType', _status);
                    });
                }
            };
        }());
        // 显示poi详情
        $scope.showPoi = function (e, item) {
            $scope.$emit('ObjectSelected', {
                feature: { pid: item.pid, geoLiveType: 'IXPOI' }
            });
            $scope.$emit('LeftListPanel', false);
            sessionStorage.setItem('listSelectedPid', item.pid); // 从列表中选中的poi
        };
        // 全屏搜索结果
        $scope.$on('getSearchTable', function (event, data) {
            $scope.searchText = data;
            $scope.gridApi.grid.refresh();
        });
        // 搜索列表(改变搜索)
        $scope.doSearchPoiList = function (e) {
            $scope.gridApi.grid.refresh();
        };
        // 按下搜索符号搜索;
        $scope.searchContent = function () {
            $scope.gridApi.grid.refresh();
        };
        // 格式化row(为了给row绑定事件)
      /**
       * formatRow
       * @return {String} <div><div/>
      */
        function formatRow() {
            var html = '<div ng-dblClick="grid.appScope.showPoi($event, row.entity)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
        // 格式化状态;
      /**
       * getStatus
       * @return {String} <div><div/>
       */
        function getStatus() {
            var html = '<div ng-show="row.entity.state===0" class="ui-grid-cell-contents">无</div>' +
                '<div class="ui-grid-cell-contents" ng-show="row.entity.state===1" style="color: #33cc99">增</div>' +
                '<div class="ui-grid-cell-contents" ng-show="row.entity.state===2" style="color: #ff6699">删</div>' +
                '<div class="ui-grid-cell-contents" ng-show="row.entity.state===3" style="color: #ffcc00">改</div>';
            return html;
        }
        // 审查状态
        $scope.getCheckStatus = function (row) {
            var temp = '';
            if (row.status === 1) {
                temp = '待审核';
            } else {
                temp = '已审核';
            }
            return temp;
        };
      /**
       * getCheckStatusHtml
       * @return {String} <div><div/>
       */
        function getCheckStatusHtml() {
            return '<div class="ui-grid-cell-contents">{{grid.appScope.getCheckStatus(row.entity)}}</div>';
        }
        $scope.formatTime = function (row) {
            return Utils.dateFormatShort(row.entity.collectTime);
        };
        /* 采集时间*/
      /**
       * getCollectTime
       * @return {String} <div><div/>
       */
        function getCollectTime() {
            var html = '<div ng-show="row.entity.collectTime" class="ui-grid-cell-contents">{{grid.appScope.formatTime(row)}}</div>' +
                '<div ng-show="!row.entity.collectTime" class="ui-grid-cell-contents">无</div>';
            return html;
        }
        /* 新鲜度验证*/
      /**
       * getFreshnessVefication
       * @return {String} <div><div/>
       */
        function getFreshnessVefication() {
            return '<div class="ui-grid-cell-contents">{{row.entity.freshnessVefication == 0 ? "否" : "是"}}</div>';
        }
        $scope.formatKindName = function (row) {
            if (row.kindCode) {
                if ($scope.metaData.kindFormat[row.kindCode] && $scope.metaData.kindFormat[row.kindCode].kindName) {
                    return $scope.metaData.kindFormat[row.kindCode].kindName;
                }
                return '无';
            }
            return '无';
        };
        /* 分类*/
      /**
       * getKindName
       * @return {String} <div><div/>
       */
        function getKindName() {
            return '<div class="ui-grid-cell-contents">{{grid.appScope.formatKindName(row.entity)}}</div>';
        }
        // 过滤数据;
        $scope.singleFilter = function (renderAbleRows) {
            var matcher = new RegExp($scope.searchText);
            renderAbleRows.forEach(function (row) {
                var match = false;
                ['name'].forEach(function (field) {
                    if (row.entity[field].match(matcher)) {
                        match = true;
                    }
                });
                if (!match) {
                    row.visible = false;
                }
            });
            // 排序后保证下一条正确;
            var currentResult = [];
            var poiPids = [];
            renderAbleRows.forEach(function (item, index) {
                poiPids.push(item.entity.pid);
                currentResult.push(item.entity);
            });
            sessionStorage.setItem('deepPids', poiPids);

            return renderAbleRows;
        };
        // 初始化表格;
      /**
       * initPoiTable
       * @return {undefined}
       */
        function initPoiTable() {
            $scope.gridOptions = {
                enableColumnMenus: false,
                useExternalPagination: false,
                paginationPageSizes: [50, 100, 200], // 每页显示个数选项
                paginationCurrentPage: 1, // 当前的页码
                paginationPageSize: 50, // 每页显示个数
                paginationTemplate: '@components/tools/uiGridPager/uiGridPagerTmpl.htm',
                enableFullRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                modifierKeysToMultiSelect: false,
                noUnselect: false,
                // enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: formatRow(),
                columnDefs: $scope.tabHeader,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    // 分页事件;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.currentPage = newPage;
                        $scope.currentPageSize = pageSize;
                        gridApi.core.scrollTo($scope.gridOptions.data[0]);
                    });
                    // 监表格渲染;
                    $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
                }
            };
            // 初始化表格;
            getData();
        }

        // 全屏和左边 样式控制
        var changeListStyle = function (flag) {
            if (flag) {
                $scope.expandPanelStyle = {
                    transform: 'rotate(0)',
                    left: 'auto',
                    right: '0'
                };
            } else {
                $scope.expandPanelStyle = {
                    transform: 'rotate(180deg)',
                    left: '280px',
                    right: 'auto'
                };
            }
        };

        // 全屏和左边显示切换
        $scope.switchFullAndLeft = function () {
            $scope.showTable = false;
            $scope.leftPanelAll = !$scope.leftPanelAll;
            $scope.wHeight = document.documentElement.clientHeight - ($scope.leftPanelAll ? 80 : 110);
            $scope.$emit('LeftPanelFullAndLeft', {
                flag: $scope.leftPanelAll,
                headerConfig: $scope.gridOptions.columnDefs,
                childScope: $scope
            });
            $timeout(function () {
                $scope.changeTableHeadConfig();
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            });
            changeListStyle($scope.leftPanelAll);
        };

        // 表头;
        $scope.tabHeader = [
            {
                field: 'pageIndex',
                displayName: '序号',
                minWidth: '50',
                visible: true,
                cellTemplate: '<div class="ui-grid-cell-contents">{{(grid.appScope.currentPage-1)*grid.appScope.currentPageSize+grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
            },
            {
                field: 'name',
                displayName: '名称',
                minWidth: '150',
                visible: true
            },
            {
                field: 'checkErrorTotal',
                displayName: '错误',
                minWidth: '50',
                visible: true
            },
            {
                field: 'photoTotal',
                displayName: '照片',
                minWidth: '50',
                visible: true
            },
            {
                field: 'state',
                displayName: '状态',
                minWidth: '50',
                cellTemplate: getStatus(),
                visible: true
            },
            {
                field: 'kindCode',
                displayName: '分类',
                minWidth: '120',
                cellTemplate: getKindName(),
                visible: true
            },
            {
                field: 'fid',
                displayName: 'POINum',
                minWidth: '90',
                visible: false
            },
            {
                field: 'pid',
                displayName: 'PID',
                minWidth: '90',
                visible: false
            },
            {
                field: 'status',
                displayName: '审核状态',
                minWidth: '70',
                cellTemplate: getCheckStatusHtml(),
                visible: false
            },
            {
                field: 'memo',
                displayName: '备注',
                minWidth: '100',
                visible: false
            }
        ];
        // 设置表头的显示隐藏;
        $scope.tableHeaderVisible = function () {
            var outerArgument = Array.prototype.slice.call(arguments);
            $scope.gridOptions.columnDefs.forEach(function (item) {
                if (outerArgument.length) {
                    item.visible = outerArgument.indexOf(item.field) > -1;
                } else {
                    item.visible = true;
                }
            });
        };
        // 切换表头以及改变表头的配置;
        $scope.changeTableHeadConfig = function () {
            $scope.showTable = true;
            $scope.gridOptions.columnDefs = $scope.tabHeader;
            if (!$scope.leftPanelAll) {
                $scope.tableHeaderVisible('pageIndex', 'name', 'checkErrorTotal', 'photoTotal', 'state', 'kindCode');
            } else {
                $scope.tableHeaderVisible();
            }
        };

        initPoiTable();
        // 切换作业类型，刷新表格
        var unbindHandler = $scope.$on('refreshTable', function (event, type) {
            $scope.showTable = false;
            $scope.searchModel.status = type;
            // 切换表头;
            $scope.changeTableHeadConfig();
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            getData();
        });

        window.onresize = function () {
            $scope.wHeight = document.documentElement.clientHeight - ($scope.leftPanelAll ? 80 : 110);
        };

        eventCtrl.off('refreshDeepInfoTable');
        eventCtrl.on('refreshDeepInfoTable', function (data) {
            $scope.searchModel.status = data.status;
            getData(true);
        });

        $scope.$on('$destroy', function () {
            $scope.leftPanelAll = false;
            unbindHandler = null;
            window.onresize = '';
        });
    }
]);
