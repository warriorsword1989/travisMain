/**
 * Created by lingLong on 2017/7/12.
 */

angular.module('app').controller('leftPoiListPanelCtrl', ['$scope', 'uibButtonConfig', 'dsEdit', 'appPath', '$timeout', 'uiGridConstants',
    function ($scope, uibBtnCfg, dsEdit, appPath, $timeout, uiGridConstants) {
        var eventCtrl = fastmap.event.EventController.getInstance();
        var objCtrl = fastmap.uikit.ObjectEditController();
        $scope.leftPanelAll = false;
        $scope.isLoading = false;
        // 由于切换全屏后会导致高度变化，用它来控制表格显示隐藏。当放大或错小后再显示表格，防止抖动；
        $scope.showTable = true;
        $scope.wHeight = document.documentElement.clientHeight - 110;
        $scope.searchModel = { type: 1, pidName: $scope.searchText };
        $scope.currentPage = 1;
        $scope.currentPageSize = 15;
        // 获取ui-grid所需的数据;
        var getData = (function () {
            var cache = {};
            return function (flag) {
                if (flag) cache = {};
                var cacheType = App.Temp.dbId + '-' + $scope.searchModel.type + '-' + ($scope.searchModel.searchText ? $scope.searchModel.searchText : 'all');
                if (cache[cacheType]) {
                    $scope.gridOptions.totalItems = cache[cacheType].total;
                    $scope.gridOptions.data = cache[cacheType].data;
                } else {
                    $scope.isLoading = true;
                    dsEdit.getPoiList($scope.searchModel).then(function (data) {
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
                            sessionStorage.setItem('poiPids', poiPids);
                            sessionStorage.setItem('listSelectedPid', '');
                        } else {
                            cache[cacheType] = {};
                            cache[cacheType].total = 0;
                            cache[cacheType].data = [];
                            sessionStorage.setItem('poiPids', []);
                            sessionStorage.setItem('listSelectedPid', '');
                        }
                        $scope.isLoading = false;
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
         * doQuality
         * @return {String} <div><div/>
         */
        function doQuality() {
            return '<div class="ui-grid-cell-contents" ng-click="grid.appScope.showQuality(row.entity)"' +
                ' ng-if="row.entity.checkCount > 0" style="color: #23527c;text-decoration: underline;cursor: pointer">查看</div>';
        }

        /**
         * 弹出质检弹框;
         * @param {object} row 行数据
         * @returns {undefined}
         */
        $scope.showQuality = function (row) {
            $scope.selectPoiRow = row;
            $scope.$emit('ObjectSelected', {
                feature: { pid: row.pid, geoLiveType: 'IXPOI' }
            });
        };
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

        /**
         * 状态由数字转化为汉子;
         * @param {boolean} status 状态
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
                    if (field === 'kindCode') {
                        var temp = $scope.metaData.kindFormat[matchValue];
                        matchValue = temp ? temp.kindName : '无';
                    }
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
            var poiPids = [];
            renderAbleRows.forEach(function (item, index) {
                poiPids.push(item.entity.pid);
                currentResult.push(item.entity);
            });
            sessionStorage.setItem('poiPids', poiPids);

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
            columnDefs: $scope.tab1_3_tHeader,
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
       * initPoiTable
       * @return {undefined}
      */
        function initPoiTable() {
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

        // tab1,3的表头;
        $scope.tab1_3_tHeader = [
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
                minWidth: '100',
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
                field: 'kindCode',
                displayName: '分类',
                minWidth: '150',
                cellTemplate: getKindName(),
                visible: false
            },
            {
                field: 'poiNum',
                displayName: 'POI num',
                minWidth: '150',
                visible: false
            },
            {
                field: 'pid',
                displayName: 'PID',
                minWidth: '100',
                visible: false
            },
            {
                field: 'flag',
                displayName: '标记',
                minWidth: '50',
                visible: false
            },
            {
                field: 'photo',
                displayName: '照片',
                minWidth: '50',
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
        // 待提交
        $scope.tab_2_tHeader = [
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
                field: 'errorType',
                displayName: '错误类型',
                minWidth: '50',
                visible: false
            },
            {
                field: 'status',
                displayName: '状态',
                minWidth: '50',
                cellTemplate: getStatus(),
                visible: false
            },
            {
                field: 'kindCode',
                displayName: '分类',
                minWidth: '150',
                cellTemplate: getKindName(),
                visible: false
            },
            {
                field: 'poiNum',
                displayName: 'POI num',
                minWidth: '150',
                visible: false
            },
            {
                field: 'pid',
                displayName: 'PID',
                minWidth: '100',
                visible: false
            },
            {
                field: 'flag',
                displayName: '标记',
                minWidth: '50',
                visible: false
            },
            {
                field: 'photo',
                displayName: '照片',
                minWidth: '50',
                visible: false
            },
            {
                field: 'memo',
                displayName: '备注',
                minWidth: '150',
                visible: false
            },
            {
                field: 'auditProblem',
                displayName: '监察问题',
                minWidth: '80',
                visible: false
            },
            {
                field: 'auditStatus',
                displayName: '问题状态',
                minWidth: '70',
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
                field: 'checkCount',
                displayName: '质检问题',
                cellTemplate: doQuality(),
                minWidth: '50',
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
        /**
         * 设置表头的隐藏
         * @method tableHeaderHidden
         * @return {undefined}
         */
        $scope.tableHeaderHidden = function () {
            let outerArgument = Array.prototype.slice.call(arguments);
            $scope.gridOptions.columnDefs.forEach(function (item) {
                if (outerArgument.indexOf(item.field) > -1) {
                    item.visible = false;
                }
            });
        };
        // 切换表头以及改变表头的配置;
        $scope.changeTableHeadConfig = function () {
            $scope.showTable = true;
            if ($scope.searchModel.type != 2) {
                $scope.gridOptions.columnDefs = $scope.tab1_3_tHeader;
                if (!$scope.leftPanelAll) {
                    $scope.tableHeaderVisible('pageIndex', 'name', 'status');
                } else {
                    $scope.tableHeaderVisible();
                }
            } else {
                $scope.gridOptions.columnDefs = $scope.tab_2_tHeader;
                if (!$scope.leftPanelAll) {
                    $scope.tableHeaderVisible('pageIndex', 'name', 'errorCount');
                } else {
                    $scope.tableHeaderVisible();
                    if (!App.Temp.qcTaskFlag) {
                        $scope.tableHeaderHidden('checkCount');
                    }
                }
            }
        };

        // 切换作业类型，刷新表格
        var unbindHandler = $scope.$on('refreshTable', function (event, type) {
            $scope.showTable = false;
            $scope.searchModel.type = type;
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

        eventCtrl.off('refreshPoiTable');
        eventCtrl.on('refreshPoiTable', function () {
            getData(true);
        });

        $scope.$on('ObjectLoaded', function (event, data) {
            let handler;
            if ($scope.selectPoiRow && data.pid === $scope.selectPoiRow.pid) {
                if (App.Temp.qcTaskFlag) {
                    if (App.Temp.taskType === 0 || App.Temp.taskType === 2) {
                        handler = $scope.$on('DoSaveOfExQuality', function (p1, p2) {
                            if (p2 === 'ExternalQuality') {
                                handler();
                                handler = null;
                            }
                        });
                        $timeout(function () {
                            $scope.$emit('ShowInfoPage', { type: 'ExternalQuality' });
                        });
                    }
                }
            }
        });

        $scope.$on('$destroy', function () {
            $scope.leftPanelAll = false;
            unbindHandler = null;
            window.onresize = '';
        });
    }
]);
