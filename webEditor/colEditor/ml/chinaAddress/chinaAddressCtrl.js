/**
 * 大陆中文地址作业数据列表页面的ctrl
 */

angular.module('app').controller('chinaAddressCtrl', ['$scope', '$sce', '$ocLazyLoad', 'ngDialog', 'dsColumn', 'dsEdit', '$interval', '$timeout', 'uiGridConstants', 'appPath',
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
        // $scope.subtaskName = App.Temp.subtaskName;
        // $scope.subTaskId = App.Temp.subTaskId;
        $scope.dataListType = 1; // 默认选中待作业
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.costomWorkNum = 10;
        $scope.costomWorkNumEum = [{ num: 10, desc: '每次10条' }, { num: 20, desc: '每次20条' },
            { num: 30, desc: '每次30条' }, { num: 100, desc: '每次100条' }];
        $scope.enableBatch = true; // 是否可以批量编辑
        $scope.enableClick = false; // 控制按钮时候可以点击
        $scope.loadTableDataMsg = '数据加载中。。。';
        $scope.searchPlaceholder = '地址全称';
        $scope.batchType = 1; // 批量作业的类型
        $scope.batchSelDialog = false;
        $scope.searchObject = { };
        var alreadyChecked = false;
        $scope.radioDefaultVal = [];
        $scope.languageFlag = 'addressChi'; // addressChi--大陆 addressCht--港澳
        var filterKey = { // 搜索内容变化时使用
            addrSplit: 'addressChi',
            addrPinyin: 'name11Chi'
        };

        $scope.main.workType = 'addrSplit'; // 默认加载项
        $scope.main.jobIds = [];  // dialog查询的jobID

        // 设置每次作业条数
        $scope.selectNum = function (params, arg2) {
            $scope.costomWorkNum = params.num;
            $scope.popoverIsOpen = false;
        };

        /**
         * 根据多音字在中文中出现的次数查找其在中文中对应的下标
         * @param {String} str 中文内容
         * @param {String} ele 多音字中文字
         * @param {Number} count 中文中多音字的出现次数
         * @returns {Number} tmpIndex
         */
        function findMulitEleByNum(str, ele, count) {
            if (count <= 0) {
                return 0;
            }
            var tmpIndex = 0;
            for (var i = 0; i < count; i++) {
                tmpIndex = str.indexOf(ele, tmpIndex);
                tmpIndex++;
            }
            return tmpIndex--;
        }
        /**
         * 递归寻找出现重复的元素，将下标放入集合中
         * @param {String} str 目标字符串 去空格后的中文
         * @param {Array} ele 重复元素 如行
         * @param {Array} arrList 存放的集合 用于存储 多音字在str中重复出现的下标
         * @param {Number} startIndex 开始下标
         * @returns {undefined}
         */
        var resu = function (str, ele, arrList, startIndex) {
            var index = str.indexOf(ele, startIndex);
            if (index != -1) {
                arrList.push(index);
                resu(str, ele, arrList, index + 1);
            }
        };
        /**
         * 高亮多音字
         * @param {String} zhongwen 中文
         * @param {String} duoyinzi 多音字
         * @returns {*} value
         */
        var heightLightCn = function (zhongwen, duoyinzi) {
            if (!zhongwen || !duoyinzi) {
                return '';
            }
            var i,
                j;
            var value = zhongwen;
            var trimZW = zhongwen.replace(/\s/g, ''); // 中文去空格
            // for (var item in duoyinzi) {
            for (i = 0; i < duoyinzi.length; i++) {
                var indexArr = [];
                // 中文多音字下标
                var index = duoyinzi[i].toString().split(',')[0];
                // 中文多音字 如行
                var chiV = trimZW.substr(index, 1);
                // 获取chiV在trimZW中重复出现的下标数组indexArr
                resu(trimZW, chiV, indexArr, -1);
                if (indexArr.length == 1) {
                    // 如果indexArr长度为1,说明chiV在trimZW中没有重复,则直接将此chiV替换为高亮后的
                    value = value.replace(chiV, "<span class='redWord'>" + chiV + '</span>');
                } else if (indexArr.length > 1) {
                    var count = 0;
                    // 循环indexArr,查找多音字在数组中出现的次数
                    for (j = 0; j < indexArr.length; j++) {
                        count++;
                        if (indexArr[j] == index) {
                            break;
                        }
                    }
                    // 根据中文中此多音字出现的次数确定其在中文中的下标
                    var realIndex = findMulitEleByNum(value, chiV, count);
                    // 高亮
                    value = value.substr(0, realIndex - 1) + "<span class='redWord'>" + chiV + '</span>' + value.substr(realIndex);
                }
            }
            return value;
        };
        var replaceVal = function (targetVal) {
            var valArr = targetVal.split('|');
            for (var i = 0; i < valArr.length; i++) {
                if (/^[\s]+$/.test(valArr[i]) && valArr[i].length > 1) {
                    valArr[i] = ' ';
                }
            }
            return valArr.join('|');
        };
        /**
         * 根据中文下标，计算拼音下标
         * @param {Array} pinyin 拼音
         * @param {Array} zhongwen 中文
         * @param {Array} duoyinzi 多音字
         * @returns {Array} pyIndexArray
         */
        var calculateIndex = function (pinyin, zhongwen, duoyinzi) {
            var pinyinArr = pinyin.split(' ');
            // pyIndexArray 用于保存需要高亮的拼音下标
            var pyIndexArray = [];
            if (duoyinzi && duoyinzi.length > 0) {
                for (var j = 0; j < duoyinzi.length; j++) {
                    var index = 0;
                    var addFlag = false;
                    var zhongwenIndex = duoyinzi[j][0];// 中文多音字下标
                    // 循环每个拼音
                    var tmpIndex = -1;
                    for (var i = 0; i < pinyinArr.length; i++) {
                        var perPYF = Utils.colPyToDBC(pinyinArr[i]);// 半角转全角，进行匹配
                        // indexOf(目标字符串,开始位置)
                        var perIndex = zhongwen.indexOf(perPYF, tmpIndex);
                        // 只有下标小于当前zhongwenIndex的perPYF才需要计算差值
                        if (perIndex != -1 && perIndex < zhongwenIndex) {
                            tmpIndex = perIndex + 1;   // ABCD中ABC行
                            if (perPYF.length > 1) {
                                addFlag = true;
                                index += perPYF.length - 1;
                                tmpIndex = perIndex + perPYF.length - 1; // 开始检索的位置需要同步调整
                            }
                        }
                    }
                    // 当addFlag为true代表有差值
                    if (addFlag) {
                        pyIndexArray.push(zhongwenIndex - index);
                    } else {
                        pyIndexArray.push(zhongwenIndex);
                    }
                }
            }
            return pyIndexArray;
        };

        /**
         * 地址拼音高亮方法
         * @param {String} pinyin 拼音地址合并
         * @param {String} zhongwen 中文地址合并
         * @param {Array} duoyinzi 多音字
         * @param {Object} type 标识道路地址 'road' 'addr'
         * @returns {Array} 含有高亮样式的拼音html
         */
        var heightLightPinAddress = function (pinyin, zhongwen, duoyinzi, type) {
            // 多音字默认值
            var perRadioDefaultVal = [];
            if (pinyin.substr(0, 1) == ' ') {
                pinyin = pinyin.substr(1);
            }
            pinyin = replaceVal(pinyin);
            var pinyinArr = pinyin.split(' ');
            var pyIndexArray = calculateIndex(pinyin, zhongwen, duoyinzi);

            // 按下标高亮拼音
            for (var i = 0; i < pyIndexArray.length; i++) {
                perRadioDefaultVal.push(pinyinArr[pyIndexArray[i]]);
                pinyinArr[pyIndexArray[i]] = "<span class='redWord'>" + pinyinArr[pyIndexArray[i]] + '</span>';
            }
            if (type == 'road') {
                $scope.radioDefaultValRoad = perRadioDefaultVal;
            } else {
                $scope.radioDefaultValAddr = perRadioDefaultVal;
            }
            return pinyinArr.join(' ');
        };
      /**
       * 获取详细信息
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
       * 获取名称
       * @return {String} <div><div/>
       */
        function get11Name() {
            var html = '<div ng-if="row.entity.name11Chi && row.entity.name11Chi.name" >{{row.entity.name11Chi.name}}</div>';
            return html;
        }
      /**
       * 获取全名
       * @return {String} <div><div/>
       */
        function getFullName() {
            var html = '<div>{{row.entity.addressChi.fullname}}</div>';
            return html;
        }
      /**
       * 获取详细信息
       * @return {String} <div><div/>
       */
        function getCkRules() {
            var html = '<div ng-if="row.entity.ckRules.length" ng-repeat="item in row.entity.ckRules">{{$index+1 +\',\'+item.log}}</div><div class="ui-grid-cell-contents" ng-if="!row.entity.ckRules.length" >无</div>';
            return html;
        }
        $scope.formatCombineName = function () {
            var html = '<div ng-bind-html="grid.appScope.getCombineName(row.entity)"></div>';
            return html;
        };
        $scope.getCombineName = function (row) {
            var html = '';
            if (row[$scope.languageFlag].roadnameStr && row[$scope.languageFlag].addrnameStr) {
                html = heightLightCn(row[$scope.languageFlag].roadnameStr, row[$scope.languageFlag].roadNameMultiPinyin) + '|' + heightLightCn(row[$scope.languageFlag].addrnameStr, row[$scope.languageFlag].addrNameMultiPinyin);
                return '<span>' + html + '<span>';
            } else if (row.roadnameStr) {
                html = heightLightCn(row[$scope.languageFlag].roadnameStr, row[$scope.languageFlag].roadNameMultiPinyin);
                return '<span>' + html + '<span>';
            } else if (row.addrnameStr) {
                html = heightLightCn(row[$scope.languageFlag].addrnameStr, row[$scope.languageFlag].addrNameMultiPinyin);
                return '<span>' + html + '<span>';
            }
            return html;
        };

        $scope.formatCombinePinyin = function () {
            var html = '<div ng-bind-html="grid.appScope.getCombinePinyin(row.entity)"></div>';
            return html;
        };
        $scope.getCombinePinyin = function (row) {
            var roadnamepinyin = row[$scope.languageFlag].roadnamePhoneticStr;
            var addrnamepinyin = row[$scope.languageFlag].addrnamePhoneticStr;
            var roadnameV = '';
            var addrnameV = '';
            if (roadnamepinyin && addrnamepinyin) {
                roadnamepinyin = roadnamepinyin.replace(/\s/g, ' ');
                roadnameV = heightLightPinAddress(roadnamepinyin.replace(/\|/g, ' | '), row[$scope.languageFlag].roadnameStr, row[$scope.languageFlag].roadNameMultiPinyin, 'road');
                roadnameV = roadnameV.replace(/(\s\|\s)/g, '|').replace(/(\|\s)/g, '|');
                addrnamepinyin = addrnamepinyin.replace(/\s/g, ' ');
                addrnameV = heightLightPinAddress(addrnamepinyin.replace(/\|/g, ' | '), row[$scope.languageFlag].addrnameStr, row[$scope.languageFlag].addrNameMultiPinyin, 'addr');
                addrnameV = addrnameV.replace(/(\s\|\s)/g, '|').replace(/(\|\s)/g, '|');
                return '<span>' + roadnameV + '|' + addrnameV + '</span>';
            } else if (roadnamepinyin) {
                roadnamepinyin = roadnamepinyin.replace(/\s/g, ' ');
                roadnameV = heightLightPinAddress(roadnamepinyin.replace(/\|/g, ' | '), row[$scope.languageFlag].roadnameStr, row[$scope.languageFlag].roadNameMultiPinyin, 'road');
                roadnameV = roadnameV.replace(/(\s\|\s)/g, '|').replace(/(\|\s)/g, '|');
                return '<span>' + roadnameV + '</span>';
            } else if (addrnamepinyin) {
                addrnamepinyin = addrnamepinyin.replace(/\s/g, ' ');
                addrnameV = heightLightPinAddress(addrnamepinyin.replace(/\|/g, ' | '), row[$scope.languageFlag].addrnameStr, row[$scope.languageFlag].addrNameMultiPinyin, 'addr');
                addrnameV = addrnameV.replace(/(\s\|\s)/g, '|').replace(/(\|\s)/g, '|');
                return '<span>' + addrnameV + '</span>';
            }
            return '';
        };
        // 查看质检问题
      /**
       * @return {String} <span><span/>
       */
        function formatQueData() {
            return '<span class="badge show-info-text" style="background-color: #ffcc00; cursor: pointer;" ng-click="grid.appScope.showQueInfo(row.entity.classifyRules, row.entity.pid, row.entity.namePinyin.pid);">{{grid.appScope.getQueData(row.entity)}}</span>';
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
        // 格式化row(为了给row绑定事件)
      /**
       * @return {String} <div><div/>
       */
        function formatRow() {
            var html = '<div ng-dblClick="grid.appScope.selectData(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
        var conbineCols = function () {
            var chinaNameCols = { // 配置显示的列
                // 前公共列
                primaryCols: [
                    { field: 'selector',
                        headerCellTemplate: '<div><input type="checkbox" ng-model="grid.appScope.checkboxes.checked" class="fm-control"/></div>',
                        cellTemplate: '<div><input type="checkbox" ng-model="row.entity.checked" class="fm-control"/></div>',
                        displayName: '选择',
                        visible: true,
                        maxWidth: 30 },
                    { field: 'classifyRules', displayName: '作业类型', enableSorting: true, cellTemplate: formatClassifyRules, visible: true, minWidth: 150 },
                    { field: 'kindName', displayName: '分类', enableSorting: true, visible: true, minWidth: 150 }
                ],
                // 地址作业
                addrSplit: [
                    { field: 'name11Chi.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, visible: true, minWidth: 150 },
                    { field: 'addressChi.fullname', displayName: '地址全称', enableSorting: true, cellTemplate: getFullName, visible: true, minWidth: 150 }
                ],
                // 拼音作业
                addrPinyin: [
                    { field: 'name11Chi.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, visible: true, minWidth: 170 },
                    { field: 'addressChi.roadnameStr', displayName: '中文地址合并', enableSorting: true, cellTemplate: $scope.formatCombineName, visible: true, minWidth: 150 },
                    { field: 'addressChi.roadnamePhoneticStr', displayName: '拼音地址合并', cellTemplate: $scope.formatCombinePinyin, visible: true, minWidth: 150 }
                ],
                // 后公共列
                lastCols: [
                    { field: 'ckRules', displayName: '错误', cellTemplate: getCkRules, visible: alreadyChecked, minWidth: 200 },
                    { field: 'pid', displayName: 'PID', enableSorting: true, visible: false, minWidth: 100 }
                ],
                // 待提交（质检问题）
                // 修改pid重名问题
                pending: [
                    { field: 'isQuality', displayName: '质检问题', enableSorting: true, visible: true, minWidth: 100, cellTemplate: formatQueData }
                ]
            };

            $scope.cols = [];
            $scope.cols = $scope.cols.concat(chinaNameCols.primaryCols);
            if (chinaNameCols[$scope.main.workType] && chinaNameCols[$scope.main.workType].length > 0) {
                $scope.cols = $scope.cols.concat(chinaNameCols[$scope.main.workType]);
            }
            $scope.cols = $scope.cols.concat(chinaNameCols.lastCols);
            var isQuality = App.Temp.qcTaskFlag;
            // 如果是待提交增加质检问题
            if ($scope.dataListType == 2 && isQuality) {
                $scope.cols = $scope.cols.concat(chinaNameCols.pending);
            }
            return $scope.cols;
        };
        // 获取表格数据;
      /**
       * @return {undefined}
       */
        function getData() {
            $scope.gridOptions.totalItems = 0;
            $scope.gridOptions.data = [];
            var param = {
                firstWorkItem: 'poi_address',
                secondWorkItem: $scope.main.workType, // 'addrPinyin',
                status: $scope.dataListType
            };
            $scope.loadingFlag = true;
            dsColumn.queryColumnDataList(param).then(function (data) {
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

        // 搜索
        $scope.$watch('searchText', function (newValue, oldewValue) {
            $scope.searchField = filterKey[$scope.main.workType];
            $scope.gridApi.grid.refresh();
        });
        $scope.singleFilter = function (renderableRows) {
            $scope.searchField = filterKey[$scope.main.workType];
            var searchTextDbc = Utils.ToDBC($scope.searchText);
            var searchTextCbd = Utils.ToCDB($scope.searchText);
            renderableRows.forEach(function (row) {
                var match = false;
                [$scope.searchField].forEach(function (field) {
                    if ($scope.searchText && !FM.Util.isEmptyObject(row.entity[field]) && field == 'addressChi' && (row.entity[field].fullname.indexOf(searchTextDbc) > -1 || row.entity[field].fullname.indexOf(searchTextCbd) > -1)) {
                        match = true;
                    } else if ($scope.searchText && !FM.Util.isEmptyObject(row.entity[field]) && field == 'name11Chi' && (row.entity[field].name.indexOf(searchTextDbc) > -1 || row.entity[field].name.indexOf(searchTextCbd) > -1)) {
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
            $scope.searchText = '';
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
            dsColumn.submitData('poi_address', $scope.main.workType).then(function (jobId) {
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
                firstWorkItem: 'poi_address',
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

        $ocLazyLoad.load('./colEditor/ml/chinaAddress/chinaAddressEditCtrl.js');

        var openEditDialog = function (isCollectData) {
            $scope.isCollectData = false;
            if (isCollectData) {
                $scope.isCollectData = true;
            }
            $scope.combiPerPageEditData();

            var dialog = ngDialog.open({
                template: 'colEditor/ml/chinaAddress/chinaAddressEditTpl.html',
                controller: 'chinaAddressEditCtrl',
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

        $scope.doRefresh = function () {
            initTable();
        };

        // ----------- 批量 -----------
        $scope.replaceList = [{ id: 'province', label: '省名' }, { id: 'city', label: '市名' }, { id: 'county', label: '区县名' }, { id: 'town', label: '乡镇街道办' }, { id: 'place', label: '地区小区名' }, { id: 'street', label: '街巷名' }, { id: 'landmark', label: '标志物名' },
            { id: 'prefix', label: '前缀' }, { id: 'housenum', label: '门牌号' }, { id: 'type', label: '类型名' }, { id: 'subnum', label: '子号' }, { id: 'surfix', label: '后缀' }, { id: 'estab', label: '附属设施名' }, { id: 'building', label: '楼栋号' }, { id: 'floor', label: '楼层' },
            { id: 'unit', label: '楼门号' }, { id: 'room', label: '房间号' }, { id: 'addons', label: '附加' }];
        $scope.searchList = [{ id: 'standardname', label: '官方标准化中文名称' }, { id: 'fullname', label: '地址全称' }];

        $scope.searchObject.searchType = 'province'; // 搜索下拉框默认选中 ‘省名’
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
         * @param {Object} type 1 提取数据 2 搜索作业
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
            // else if (type == 2) {
            //     if (!($scope.searchObject.searchText)) {
            //         swal('提示', '‘搜索’字段为必填项！', 'warning');
            //         return;
            //     }
            // }

            var searchText = $scope.searchObject.searchText;
            var searchTextDbc = Utils.ToDBC(searchText);
            var searchTextCbd = Utils.ToCDB(searchText);

            var tempArr = [];
            for (var i = 0; i < $scope.allTableList.length; i++) {
                var temp = $scope.allTableList[i];
                var name = '';
                if ($scope.searchObject.searchType === 'standardname') {
                    name = temp.name11Chi.name; // 官方标准中文
                } else if ($scope.searchObject.searchType === 'fullname') {
                    name = temp.addressChi.fullname; // 地址全称
                } else { // 地址的18个字段
                    name = temp.addressChi[$scope.searchObject.searchType]; // 原始英文
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
            if (value == 1) {
                $scope.searchObject.searchType = 'province';
            } else {
                $scope.searchObject.searchType = 'standardname';
            }
        };

        $scope.$on('refreshChildrenPage', function (event, obj) {
            if ($scope.main.workType === 'addrSplit') {
                $scope.enableBatch = true;
            } else if ($scope.main.workType === 'addrPinyin') {
                $scope.enableBatch = false;
                $scope.searchPlaceholder = '官方标准中文名称';
            }
            $scope.searchText = ''; // 清空搜索条件
            if (obj && obj.showErrMsg == 1) {  // 表示的是提交后需要显示错误信息列
                alreadyChecked = true;
            } else {
                alreadyChecked = false;
                $scope.dataListType = 1; // 待作业
            }
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

        // 打开任务列表
        // $scope.goTaskMenu = function () {
        //     ngDialog.open({
        //         template: 'task/taskGeneralPage.html',
        //         controller: 'taskGeneralPageCtrl',
        //         className: 'ngdialog-theme-default',
        //         width: '100%',
        //         height: '100%',
        //         closeByEscape: false,
        //         closeByDocument: false
        //     });
        // };

        initTable();
    }]);
