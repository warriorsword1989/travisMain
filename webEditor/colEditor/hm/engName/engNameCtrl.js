/**
 * Created by mali on 2018/1/8.
 */

angular.module('app').controller('hmEngNameCtrl', ['$scope', '$sce', '$ocLazyLoad', 'ngDialog', 'dsColumn', 'dsEdit', '$interval', '$timeout', 'uiGridConstants', 'appPath',
    function ($scope, $sce, $ocLazyLoad, ngDialog, dsColumn, dsEdit, $interval, $timeout, uiGridConstants, appPath) {
        var height = document.documentElement.clientHeight - 136;
        $scope.tableBodyHeight = {
            height: height + 'px'
        };
        $scope.checkboxes = {
            checked: false
        };
        $scope.subtaskName = FM.ColumnUtils.config.workBatch[App.Temp.subTaskId];
        $scope.qcWorkType = App.Temp.qcTaskFlag == 1 ? '质检' : '作业';
        $scope.dataListType = 1; // 默认选中待作业
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.costomWorkNum = 10;
        $scope.costomWorkNumEum = [{ num: 10, desc: '每次10条' }, { num: 20, desc: '每次20条' },
            { num: 30, desc: '每次30条' }, { num: 100, desc: '每次100条' }];
        $scope.enableBatch = true; // 是否可以批量编辑
        $scope.enableClick = false; // 控制按钮时候可以点击
        $scope.batchType = 1; // 批量作业的类型
        $scope.batchSelDialog = false;
        $scope.searchObject = { };
        $scope.loadTableDataMsg = '数据加载中。。。';
        $scope.searchPlaceholder = '标准中文名称';
        var alreadyChecked = false; // 是否点击过在线检查
        var filterKey = { // 搜索内容变化时使用
            photoEngName: 'name11Cht',
            photoPorName: 'name11Cht',
            chiEngName: 'name11Cht',
            chiPorName: 'name11Cht',
            macaoEngName: 'name11Cht',
            engNameInvalidChar: 'name11Cht',
            portuNameInvalidChar: 'name11Cht',
            officalStandardEngName: 'name11Cht',
            officalStandardPortuName: 'name11Cht'
        };

        $scope.main.workType = 'photoEngName'; // 默认加载项
        $scope.main.jobIds = [];  // dialog查询的jobID

        // 设置每次作业条数
        $scope.selectNum = function (params, arg2) {
            $scope.costomWorkNum = params.num;
            $scope.popoverIsOpen = false;
        };
        /**
         * formatClassifyRules
         * @return {String} <div><div/>
        */
        function formatClassifyRules() {
            var html = '<div ng-bind-html="grid.appScope.getClassifyRules(row.entity)"></div>';
            return html;
        }
        $scope.getClassifyRules = function (row) {
            var html = '';
            if (row.classifyRules) {
                var type = row.classifyRules.split(',');
                for (var i = 0; i < type.length; i++) {
                    html += '<span class="badge">' + App.Config.Constant.poi.classifyRules[type[i]] + '</span>';
                }
            }
            return html;
        };
      /**
       * get12EngName
       * @return {String} <div><div/>
       */
        function get12EngName() {
            return '<div ng-if="row.entity.name12Eng && row.entity.name12Eng.name">{{row.entity.name12Eng.name}}</div>';
        }
        /**
         * get12PorName
         * @return {String} <div><div/>
         */
        function get12PorName() {
            return '<div ng-if="row.entity.name12Por && row.entity.name12Por.name">{{row.entity.name12Por.name}}</div>';
        }
      /**
       * get11EngName
       * @return {String} <div><div/>
       */
        function get11EngName() {
            return '<div ng-if="row.entity.name11Cht && row.entity.name11Cht.name">{{row.entity.name11Eng.name}}</div>';
        }
      /**
       * get11ChtName
       * @return {String} <div><div/>
       */
        function get11ChtName() {
            return '<div ng-if="row.entity.name11Cht && row.entity.name11Cht.name">{{row.entity.name11Cht.name}}</div>';
        }
      /**
       * formatCkRules
       * @return {String} <div><div/>
       */
        function formatCkRules() {
            return '<div ng-bind-html="grid.appScope.getCkRules(row.entity)"></div>';
        }
        $scope.getCkRules = function (row) {
            var ckRules = row.ckRules;
            var html = '';
            if (!ckRules.length) {
                html = '无';
            } else {
                for (var i = 0; i < ckRules.length; i++) {
                    html += (i + 1) + '.' + ckRules[i].log + '<br>';
                }
            }
            return html;
        };
      /**
       * formatQueData 查看质检问题
       * @return {String} <div><div/>
       */
        function formatQueData() {
            return '<div><span class="badge show-info-text" style="background-color: #ffcc00; cursor: pointer;" ng-click="grid.appScope.showQueInfo(row.entity.classifyRules, row.entity.pid, row.entity.namePinyin.pid);">{{grid.appScope.getQueData(row.entity)}}</span></div>';
        }
        $scope.getQueData = function (row) {
            var quaStatusArray = ['', '查看', '已查看'];
            var _text = '';
            if (row.isProblem) {
                _text = quaStatusArray[row.isProblem.other];
            }
            return _text;
        };
        // 获取质检信息
        $scope.showQueInfo = function (rule, pid) {
            var oneLevel = JSON.parse(sessionStorage.getItem('FM-Quality-one-level')).label;
            var twoLevel = $scope.main.selectedItem.name;
            var threeLevel = '';
            if (rule) {
                var type = rule.split(',');
                for (var i = 0; i < type.length; i++) {
                    if (i == 0) {
                        threeLevel = App.Config.Constant.poi.classifyRules[type[i]];
                    } else {
                        threeLevel += '+' + App.Config.Constant.poi.classifyRules[type[i]];
                    }
                }
            }
            $scope.showQuaModalTitle = oneLevel + ' — ' + twoLevel + ' — ' + threeLevel;
            $scope.showQuaModal = true;
            $ocLazyLoad.load('./colEditor/common/showQuaDataCtrl.js').then(function () {
                $scope.quaInfoModalTpl = './colEditor/common/showQuaDataTpl.html';
                $timeout(function () {
                    $scope.$broadcast('refreshShowQua', { rule: rule, id: pid, nameId: '' });
                }, 500);
            });
        };
        // 关闭质检弹窗
        $scope.closeQuaInfoModal = function () {
            $scope.showQuaModal = false;
        };
        $scope.$on('closeQuaInfoModal', function (event, data) {
            $scope.closeQuaInfoModal();
        });

        $scope.toggleVisible = function () {
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };
        // 表格显示的列
        $scope.cols = [];

        var conbineCols = function () {
            $scope.cols = [];
            // 配置显示的列
            var engNameCols = {
                // 前公共列
                primaryCols: [
                    { field: 'selector',
                        headerCellTemplate: '<div><input type="checkbox" ng-model="grid.appScope.checkboxes.checked" class="fm-control"/></div>',
                        cellTemplate: '<div><input type="checkbox" ng-model="row.entity.checked" class="fm-control"/></div>',
                        displayName: '选择',
                        visible: true,
                        maxWidth: 30 },
                    { field: 'classifyRules', displayName: '作业类型', cellTemplate: formatClassifyRules, visible: true, minWidth: 150 },
                    { field: 'kindName', displayName: '分类', enableSorting: true, visible: true, minWidth: 150 }
                ],
                // 照片录入英文名
                photoEngName: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: get12EngName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 照片录入葡文名
                photoPorName: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name12Por.name', displayName: '原始葡文名称', enableSorting: true, cellTemplate: get12PorName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 中文即是英文
                chiEngName: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: get12EngName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 中文即是葡文
                chiPorName: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name12Por.name', displayName: '原始葡文名称', enableSorting: true, cellTemplate: get12PorName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 澳门英文名作业
                macaoEngName: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: get12EngName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 英文名非法字符
                engNameInvalidChar: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: get12EngName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 葡文名非法字符
                portuNameInvalidChar: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name12Por.name', displayName: '原始葡文名称', enableSorting: true, cellTemplate: get12PorName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 官方标准英文名
                officalStandardEngName: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name11Eng.name', displayName: '标准英文名称', enableSorting: true, cellTemplate: get11EngName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 官方标准葡文名
                officalStandardPortuName: [
                    { field: 'name11Cht.name', displayName: '标准中文名称', enableSorting: true, cellTemplate: get11ChtName, visible: true },
                    { field: 'name12Por.name', displayName: '原始葡文名称', enableSorting: true, cellTemplate: get12PorName, visible: true },
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 后公共列
                lastCols: [
                    { field: 'pid', displayName: 'PID', visible: false, minWidth: 100 }
                ],
                // 待提交（质检问题）
                // 修改pid重名问题
                pending: [
                    { field: 'isQuality', displayName: '质检问题', enableSorting: true, visible: true, minWidth: 100, cellTemplate: formatQueData }
                ]
            };

            $scope.cols = $scope.cols.concat(engNameCols.primaryCols);
            if (engNameCols[$scope.main.workType] && engNameCols[$scope.main.workType].length > 0) {
                $scope.cols = $scope.cols.concat(engNameCols[$scope.main.workType]);
            }
            $scope.cols = $scope.cols.concat(engNameCols.lastCols);
            var isQuality = App.Temp.qcTaskFlag;
            // 如果是待提交增加质检问题
            if ($scope.dataListType == 2 && isQuality) {
                $scope.cols = $scope.cols.concat(engNameCols.pending);
            }
            return $scope.cols;
        };
      /**
       * formatRow 格式化row(为了给row绑定事件)
       * @return {String} <div><div/>
       */
        function formatRow() {
            var html = '<div ng-dblClick="grid.appScope.selectData(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
      /**
       * getData 获取表格数据;
       * @param {Object} options 参数
       * @return {undefined}
       */
        function getData(options) {
            $scope.gridOptions.totalItems = 0;
            $scope.gridOptions.data = [];
            var param = {
                firstWorkItem: 'poi_englishname',
                secondWorkItem: $scope.main.workType, // 'nameUnify',
                status: $scope.dataListType
            };
            var params = $.extend(param, options);
            $scope.loadingFlag = true;
            dsColumn.queryColumnDataList(params).then(function (data) {
                $scope.loadTableDataMsg = '列表无数据';
                var temp = new FM.dataApi.ColPoiList(data.rows);
                $scope.allTableList = temp.dataList;
                if (temp.dataList.length > 0) {
                    $scope.enableClick = true;
                } else {
                    $scope.enableClick = false;
                }
                $scope.gridOptions.totalItems = data.total;
                $scope.gridOptions.data = $scope.allTableList;
                $scope.loadingFlag = false;
            }, function () { $scope.loadingFlag = false; });
        }
      /**
       * initTable 初始化表格
       * @return {undefined}
       */
        function initTable() {
            $scope.gridOptions = {
                enableColumnMenus: false,
                useExternalPagination: false,
                paginationPageSizes: [15, 25, 50], // 每页显示个数选项
                paginationCurrentPage: 1, // 当前的页码
                paginationPageSize: 15, // 每页显示个数
                paginationTemplate: '@components/tools/uiGridPager/uiGridPagerTmpl.htm',
                enableFullRowSelection: true,
                enableRowHeaderSelection: false,
                // useExternalFiltering: false,
                multiSelect: false,
                totalItems: 0,
                modifierKeysToMultiSelect: false,
                noUnselect: false,
                rowTemplate: formatRow(),
                columnDefs: conbineCols(),
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    // 搜索事件
                    $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 400);
                }
            };
            // 初始化表格;
            getData();
        }

        $scope.$watch('searchText', function (newValue, oldewValue) {
            $scope.searchField = filterKey[$scope.main.workType];
            $scope.gridApi.grid.refresh();
        });
        $scope.singleFilter = function (renderableRows) {
            $scope.searchField = filterKey[$scope.main.workType];
            var matcher = new RegExp($scope.searchText);
            renderableRows.forEach(function (row) {
                var match = false;
                [$scope.searchField].forEach(function (field) {
                    if ($scope.searchText && !FM.Util.isEmptyObject(row.entity[field]) && row.entity[field].name.match(matcher)) {
                        match = true;
                    } else if (!$scope.searchText) {
                        match = true;
                    }
                });
                if (!match) {
                    row.visible = false;
                }
            });
            // 手动同步表格显示数据和 返回数据
            var currentResult = [];
            renderableRows.forEach(function (item, index) {
                if (item.visible) {
                    currentResult.push(item.entity);
                }
            });
            $scope.allTableList = currentResult;
            return renderableRows;
        };
        $scope.changeDataList = function (type) {
            $scope.loadTableDataMsg = '数据加载中。。。';
            $scope.dataListType = type;
            initTable();
        };

        // 二级项提交
        $scope.submitData = function () {
            if (!$scope.enableClick) {
                return;
            }
            // 如果存在未查看，不允许提交
            for (var i = 0; i < $scope.allTableList.length; i++) {
                if ($scope.allTableList[i].isProblem) {
                    if ($scope.allTableList[i].isProblem.other == '1') {
                        swal('提示', '存在未查看的数据！', 'warning');
                        return;
                    }
                }
            }
            $scope.showLoading.flag = true;
            dsColumn.submitData('poi_englishname', $scope.main.workType).then(function (jobId) {
                if (jobId) {
                    var timer = $interval(function () {
                        dsEdit.getJobById(jobId).then(function (data) {
                            if (data.status == 3 || data.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                $scope.showLoading.flag = false;
                                $interval.cancel(timer);
                                if (data.status == 3) {
                                    alreadyChecked = true;
                                    initTable();
                                    $scope.$emit('refreshMainPage');
                                } else {
                                    swal('提示', '数据提交失败！' + data.resultMsg, 'warning');
                                }
                            }
                        });
                    }, 600);
                }
            });
        };

        // 启动进度条
        var progressTimer;
        var executeProgress = function () {
            $scope.progress.value = 0;
            progressTimer = $interval(function () {
                $scope.progress.value += 5;
                if ($scope.progress.value > 100) {
                    $scope.progress.value = 0;
                }
            }, 500);
        };
        // 关闭进度条
        var closeProgress = function () {
            $scope.progress.value = 100;
            if (progressTimer) {
                $interval.cancel(progressTimer);
            }
        };
        // 重置进度条
        var resertProgress = function () {
            $scope.progress.value = 0;
        };
        // 在线检查
        $scope.doCheckData = function () {
            if (!$scope.enableClick) {
                return;
            }
            $scope.showLoading.flag = true;
            executeProgress();
            var param = {
                subtaskId: App.Temp.subTaskId,
                checkType: 2, // 1 poi粗编 ;2 poi精编 ; 3 道路粗编 ; 4道路精编 ; 5道路名 ; 6 其他
                firstWorkItem: 'poi_englishname',
                secondWorkItem: $scope.main.selectedItem.id,
                status: $scope.dataListType
            };
            dsColumn.checkDeepData(param).then(function (jobId) {
                if (jobId) {
                    var timer = $interval(function () {
                        dsEdit.getJobById(jobId).then(function (data) {
                            if (data.status == 3 || data.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                $interval.cancel(timer);
                                closeProgress();
                                $scope.showLoading.flag = false;
                                if (data.status == 3) {
                                    alreadyChecked = true;
                                    initTable();
                                } else {
                                    swal('提示', '检查执行失败,' + data.resultMsg, 'warning');
                                }
                            }
                        });
                    }, 600);
                }
            });
        };

        // 监控全选;
        $scope.$watch(function () {
            return $scope.checkboxes.checked;
        }, function (value) {
            angular.forEach($scope.allTableList, function (item) {
                item.checked = value;
            });
        });

        // 预加载，实际到ngDialog.open的时候才用到，
        $ocLazyLoad.load('./colEditor/hm/engName/engNameEditCtrl.js');


        // 获取当前页要编辑的条数
        $scope.combiPerPageEditData = function (allData) {
            if ($scope.allTableList.length > $scope.costomWorkNum) {
                // 当前页要编辑的数据
                var resultArr = $scope.allTableList.splice(0, $scope.costomWorkNum);
                $scope.currentEdited = resultArr;
            } else {
                $scope.currentEdited = $scope.allTableList;
                $scope.allTableList = [];
            }
            return $scope.currentEdited;
        };

        var openEditDialog = function (isCollectData) {
            $scope.isCollectData = false;
            if (isCollectData) {
                $scope.isCollectData = true;
            }

            $scope.combiPerPageEditData();

            var dialog = ngDialog.open({
                template: 'colEditor/hm/engName/engNameEditTpl.html',
                controller: 'hmEngNameEditCtrl',
                className: 'ngdialog-theme-default ngdialog-theme-plain dialog-edit',
                width: '100%',
                height: '100%',
                closeByDocument: false,
                scope: $scope,
                preCloseCallback: function () {
                    if ($scope.main.jobIds.length != 0) {
                        $scope.showLoading.flag = true;
                        var timer = $interval(function () {
                            dsEdit.getByJobIds($scope.main.jobIds).then(function (data) {
                                for (var i = $scope.main.jobIds.length - 1; i >= 0; i--) {
                                    var status = data[$scope.main.jobIds[i]].status;
                                    if (status == 3 || status == 4) {
                                        $scope.main.jobIds.splice(i, 1);
                                    }
                                }
                                if ($scope.main.jobIds.length === 0) {
                                    $scope.showLoading.flag = false;
                                    $interval.cancel(timer);
                                    initTable();
                                    $scope.$emit('refreshMainPage');
                                }
                            });
                        }, 600);
                    } else {
                        initTable();
                    }
                }
            });
        };

        $scope.selectData = function (row, index) {
            var temp = $scope.allTableList;
            var checkedArr = [];
            for (var i = 0, len = temp.length; i < len; i++) {
                if (temp[i].checked) {
                    checkedArr.push(temp[i]);
                }
            }
            var editArr = [];
            if (checkedArr.length > 0) {
                editArr = checkedArr;
            } else {
                editArr = temp;
            }
            $scope.allTableList = editArr;
            openEditDialog();
        };

        var setSearchPlaceholder = function () {
            var index = ['photoEngName', 'photoPorName', 'chiEngName', 'chiPorName', 'macaoEngName', 'engNameInvalidChar', 'portuNameInvalidChar', 'officalStandardEngName', 'officalStandardPortuName'].indexOf($scope.main.workType);
            if (index > -1) {
                $scope.searchPlaceholder = '标准中文名称';
            } else {
                $scope.searchPlaceholder = '搜索';
            }
        };
        $scope.doRefresh = function () {
            initTable();
        };

        // ----------- 批量 ----------
        var originalengReplace = [{ id: 'originalengname', label: '原始英文名称' }];
        var originalporReplace = [{ id: 'originalporname', label: '原始葡文名称' }];
        var offiStandengReplace = [{ id: 'standardengname', label: '官方标准英文名' }];
        var offiStandporReplace = [{ id: 'standardporname', label: '官方标准葡文名' }];
        var originalengSearch = [{ id: 'originalengname', label: '原始英文名称' }, { id: 'standardname', label: '官方标准中文名称' }];
        var originalporSearch = [{ id: 'originalporname', label: '原始葡文名称' }, { id: 'standardname', label: '官方标准中文名称' }];
        var offiStandengSearch = [{ id: 'standardengname', label: '官方标准英文名' }, { id: 'standardname', label: '官方标准中文名称' }];

        $scope.replaceList = originalengReplace;
        $scope.searchList = originalengSearch;

        $scope.searchObject.searchType = 'originalengname'; // 搜索下拉框默认选中 ‘原始英文名称’
        $scope.closeBatchSelDialog = function () {
            $scope.clearSearch();
        };

        $scope.batchWork = function () {
            if (!$scope.enableClick) {
                return;
            }
            $scope.batchSelDialog = true;
        };

        $scope.clearSearch = function () {
            $scope.searchObject.searchText = '';
            $scope.searchObject.replaceText = '';
            $scope.batchSelDialog = false;
        };
        /**
         * @param {Number} type 1 提取数据 2 搜索作业
         * @return {undefined}
         */
        $scope.collectData = function (type) {
            var isCollectData = false; // 用户控制打开编辑页面后是否弹出批量编辑框
            if (type == 1) {
                if (!($scope.searchObject.searchText || $scope.searchObject.replaceText)) {
                    swal('提示', '‘搜索’和‘替换为’字段至少需要填一项！', 'warning');
                    return;
                }
                isCollectData = true;
            }

            var searchText = $scope.searchObject.searchText;
            var searchTextDbc = Utils.ToDBC(searchText);
            var searchTextCbd = Utils.ToCDB(searchText);

            var tempArr = [];
            for (var i = 0; i < $scope.allTableList.length; i++) {
                var temp = $scope.allTableList[i];
                var name = '';
                if ($scope.searchObject.searchType === 'originalengname') {
                    name = temp.name12Eng.name; // 原始英文
                } else if ($scope.searchObject.searchType === 'originalporname') {
                    name = temp.name12Por.name; // 原始葡文
                } else if ($scope.searchObject.searchType === 'standardengname') {
                    name = temp.name11Eng.name; // 标准英文
                } else if ($scope.searchObject.searchType === 'standardporname') {
                    name = temp.name11Por.name; // 标准葡文
                } else if ($scope.searchObject.searchType === 'standardname') {
                    name = temp.name11Cht.name; // 标准中文
                }
                if (searchText) {
                    if ((name && name.indexOf(searchTextDbc) != -1) || (name && name.indexOf(searchTextCbd) != -1)) {
                        tempArr.push(temp);
                    }
                } else {
                    if (!name) {
                        tempArr.push(temp);
                    }
                }
            }
            if (tempArr.length > 0) {
                $scope.allTableList = tempArr;
                openEditDialog(isCollectData);
                $scope.batchSelDialog = false;
            } else {
                swal('提示', '当前没有符合条件的数据!', 'warning');
            }
        };

        $scope.batchSelected = function (value) {
            $scope.batchType = value;
            $scope.searchObject.searchType = $scope.replaceList[0].id;
        };

        $scope.$on('refreshChildrenPage', function (event, obj) {
            if ($scope.main.workType === 'photoEngName' || $scope.main.workType === 'chiEngName' || $scope.main.workType === 'engNameInvalidChar') { // 官方标准英文名
                $scope.replaceList = originalengReplace;
                $scope.searchList = originalengSearch;
                $scope.enableBatch = true;
            } else if ($scope.main.workType === 'officalStandardEngName') {
                $scope.replaceList = offiStandengReplace;
                $scope.searchList = offiStandengSearch;
                $scope.enableBatch = true;
            } else if ($scope.main.workType === 'officalStandardPortuName') {
                $scope.replaceList = offiStandporReplace;
                $scope.searchList = originalporSearch;
                $scope.enableBatch = true;
            } else {
                $scope.replaceList = originalporReplace;
                $scope.searchList = originalporSearch;
                $scope.enableBatch = true;
            }
            $scope.searchObject.searchType = $scope.replaceList[0].id;

            setSearchPlaceholder();
            if (obj && obj.showErrMsg == 1) {  // 表示的是提交后需要显示错误信息列
                alreadyChecked = true;
            } else {
                alreadyChecked = false;
                $scope.dataListType = 1; // 待作业
            }
            $scope.searchText = ''; // 清空搜索条件
            $scope.batchSelDialog = false;
            resertProgress();
            if (obj && obj.pid) {
                for (var i = 0; i < $scope.allTableList.length; i++) {
                    if ($scope.allTableList[i].pid === obj.pid) {
                        $scope.allTableList[i].isQuality = 2;
                        if ($scope.allTableList[i].isProblem) {
                            $scope.allTableList[i].isProblem.other = '2';
                        }
                    }
                }
            } else {
                initTable();
            }
        });

        initTable();
    }]);
