/**
 * 左侧点门牌列表界面ctrl
 * @file    leftPointAddressListPanelCtrl.js
 * @author  mali
 * @date    2017-09-26
 *
 * @copyright @Navinfo, all rights reserved.
 */

angular.module('app').controller('leftPointAddressListPanelCtrl', ['$scope', 'uibButtonConfig', 'dsEdit', 'appPath', '$timeout', 'uiGridConstants',
    function ($scope, uibBtnCfg, dsEdit, appPath, $timeout, uiGridConstants) {
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
                var cacheType = App.Temp.dbId + '-' + $scope.searchModel.status + '-' + ($scope.searchModel.searchText ? $scope.searchModel.searchText : 'all');
                if (cache[cacheType]) {
                    $scope.gridOptions.totalItems = cache[cacheType].total;
                    $scope.gridOptions.data = cache[cacheType].data;
                } else {
                    $scope.isLoading = true;
                    dsEdit.getPointAddressList($scope.searchModel).then(function (data) {
                        if (data) {
                            $scope.gridOptions.totalItems = data.total;
                            var currentResult = [];
                            var pointAddressPids = [];
                            $scope.gridOptions.data = data.rows.forEach(function (item, index) {
                                pointAddressPids.push(item.pid);
                                currentResult.push(item);
                            });
                            $scope.gridOptions.data = currentResult;
                            // 缓存数据;
                            cache[cacheType] = {};
                            cache[cacheType].total = data.total;
                            cache[cacheType].data = currentResult;
                            sessionStorage.setItem('indexPids', pointAddressPids);
                        } else {
                            cache[cacheType] = {};
                            cache[cacheType].total = 0;
                            cache[cacheType].data = [];
                            sessionStorage.setItem('indexPids', []);
                        }
                        $scope.isLoading = false;
                    });
                }
            };
        }());

        /**
         * 显示点门牌详情
         * @param {Object} e 事件对象
         * @param {Object} item 点门牌对象
         * @return {undefined}
         */
        $scope.showPointAddress = function (e, item) {
            $scope.$emit('ObjectSelected', {
                feature: { pid: item.pid, geoLiveType: 'IXPOINTADDRESS' }
            });
            $scope.$emit('LeftListPanel', false);
            sessionStorage.setItem('indexListSelectedPid', item.pid); // 从列表中选中的点门牌
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
            var html = '<div ng-dblClick="grid.appScope.showPointAddress($event, row.entity)">' +
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
            var html = '<div ng-show="row.entity.status===0" class="ui-grid-cell-contents">无</div>' +
                '<div class="ui-grid-cell-contents" ng-show="row.entity.status===1" style="color: #33cc99">增</div>' +
                '<div class="ui-grid-cell-contents" ng-show="row.entity.status===2" style="color: #ff6699">删</div>' +
                '<div class="ui-grid-cell-contents" ng-show="row.entity.status===3" style="color: #ffcc00">改</div>';
            return html;
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

        /**
         * 状态由数字转化为汉子;
         * @param {Boolean} status 状态
         * @returns {*} obj[status]
         */
        function transFromStatus(status) {
            var obj = { 0: '无', 1: '增', 2: '删', 3: '改' };
            return obj[status];
        }

        /**
         * 鲜度验证由数组转化为汉子;
         * @param {Number} code code
         * @returns {string} '否' or '是'
         */
        function transFormFreshnessVefication(code) {
            return code == 0 ? '否' : '是';
        }
        // 过滤数据;
        $scope.singleFilter = function (renderAbleRows) {
            var matcher = new RegExp($scope.searchText);
            renderAbleRows.forEach(function (row) {
                var match = false;
                var matchArray = [];
                var excludeArray = ['pageIndex'];
                $scope.gridOptions.columnDefs.forEach(function (item) {
                    if (item.visible && excludeArray.indexOf(item.field) === -1) {
                        matchArray.push(item.field);
                    }
                });

                matchArray.forEach(function (field) {
                    var matchValue = row.entity[field].toString();
                    if (field === 'status') {
                        matchValue = transFromStatus(row.entity.status);
                    }
                    if (field === 'freshnessVefication') {
                        matchValue = transFormFreshnessVefication(row.entity.freshnessVefication);
                    }
                    if (field === 'collectTime') {
                        matchValue = Utils.dateFormatShort(row.entity.collectTime);
                    }
                    if (matchValue.match(matcher)) {
                        match = true;
                    }
                });

                if (!match) {
                    row.visible = false;
                }
            });
            // 排序后保证下一条正确;
            var currentResult = [];
            var pointAddressPids = [];
            renderAbleRows.forEach(function (item, index) {
                pointAddressPids.push(item.entity.pid);
                currentResult.push(item.entity);
            });
            sessionStorage.setItem('indexPids', pointAddressPids);

            return renderAbleRows;
        };
        // 初始化表格;
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
            columnDefs: $scope.tab1_2_tHeader,
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

      /**
       * initPointAddressTable
       * @return {undefined}
       */
        function initPointAddressTable() {
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

        // $scope.initData = function () {
        //     initPointAddressTable();
        // };

        // tab3的表头; 已提交
        $scope.tab_3_tHeader = [
            {
                field: 'pageIndex',
                displayName: '序号',
                minWidth: '50',
                visible: true,
                cellTemplate: '<div class="ui-grid-cell-contents">{{(grid.appScope.currentPage-1)*grid.appScope.currentPageSize+grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
            },
            {
                field: 'dprName',
                displayName: '外业道路名',
                minWidth: '160',
                visible: true
            },
            {
                field: 'status',
                displayName: '状态',
                minWidth: '50',
                cellTemplate: getStatus(),
                visible: true
            },
            {
                field: 'dpName',
                displayName: '外业门牌号',
                minWidth: '160',
                visible: false
            },
            {
                field: 'pid',
                displayName: 'PID',
                minWidth: '100',
                visible: false
            },
            {
                field: 'memo',
                displayName: '备注',
                minWidth: '150',
                visible: false
            },
            {
                field: 'freshnessVefication',
                displayName: '鲜度验证',
                cellTemplate: getFreshnessVefication(),
                minWidth: '70',
                visible: false
            },
            {
                field: 'collectTime',
                displayName: '采集时间',
                cellTemplate: getCollectTime(),
                minWidth: '150',
                visible: false
            }
        ];
        // 待提交、待作业
        $scope.tab1_2_tHeader = [
            {
                field: 'pageIndex',
                displayName: '序号',
                minWidth: '50',
                visible: true,
                cellTemplate: '<div class="ui-grid-cell-contents">{{(grid.appScope.currentPage-1)*grid.appScope.currentPageSize+grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
            },
            {
                field: 'dprName',
                displayName: '外业道路名',
                minWidth: '100',
                visible: true
            },
            {
                field: 'errorCount',
                displayName: '错误',
                minWidth: '90',
                visible: true
            },
            {
                field: 'status',
                displayName: '状态',
                minWidth: '50',
                cellTemplate: getStatus(),
                visible: false
            },
            {
                field: 'dpName',
                displayName: '外业门牌号',
                minWidth: '160',
                visible: false
            },
            {
                field: 'pid',
                displayName: 'PID',
                minWidth: '100',
                visible: false
            },
            {
                field: 'memo',
                displayName: '备注',
                minWidth: '150',
                visible: false
            },
            {
                field: 'freshnessVefication',
                displayName: '鲜度验证',
                cellTemplate: getFreshnessVefication(),
                minWidth: '70',
                visible: false
            },
            {
                field: 'collectTime',
                displayName: '采集时间',
                cellTemplate: getCollectTime(),
                minWidth: '150',
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
            if ($scope.searchModel.status != 3) {
                $scope.gridOptions.columnDefs = $scope.tab1_2_tHeader;
                if (!$scope.leftPanelAll) {
                    $scope.tableHeaderVisible('pageIndex', 'dprName', 'errorCount');
                } else {
                    $scope.tableHeaderVisible();
                }
            } else {
                $scope.gridOptions.columnDefs = $scope.tab_3_tHeader;
                if (!$scope.leftPanelAll) {
                    $scope.tableHeaderVisible('pageIndex', 'dprName', 'status');
                } else {
                    $scope.tableHeaderVisible();
                }
            }
        };

        // 切换作业类型，刷新表格
        var unbindHandler = $scope.$on('refreshTable', function (event, type) {
            $scope.showTable = false;
            $scope.searchModel.status = type;
            // 切换表头;
            $scope.changeTableHeadConfig();
            $timeout(function () {
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                getData();
            });
        });

        window.onresize = function () {
            $scope.wHeight = document.documentElement.clientHeight - ($scope.leftPanelAll ? 80 : 110);
        };

        var refreshPointAddressTable = function () {
            getData(true);
        };
        eventCtrl.off('refreshPointAddressTable', refreshPointAddressTable);
        eventCtrl.on('refreshPointAddressTable', refreshPointAddressTable);

        $scope.$on('$destroy', function () {
            $scope.leftPanelAll = false;
            unbindHandler = null;
            window.onresize = '';
        });
    }
]);
