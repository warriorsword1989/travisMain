/**
 * Created by wuzhen on 2016/12/7.
 */

angular.module('app').controller('chinaNameCtrl', ['$scope', '$sce', '$ocLazyLoad', 'ngDialog', 'dsColumn', '$interval', 'dsEdit', '$timeout', 'uiGridConstants', 'appPath',
    function ($scope, $sce, $ocLazyLoad, ngDialog, dsColumn, $interval, dsEdit, $timeout, uiGridConstants, appPath) {
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
        $scope.batchType = 1; // 批量作业的类型
        $scope.batchSelDialog = false;
        $scope.searchObject = { };
        $scope.loadTableDataMsg = '数据加载中。。。';
        $scope.searchPlaceholder = '官方原始名称';
        var alreadyChecked = false; // 是否点击过在线检查
        var filterKey = { // 搜索内容变化时使用
            nameUnify: 'name12Chi',
            shortName: 'name11Chi',
            aliasName: 'name11Chi',
            namePinyin: 'namePinyin'
        };
        $scope.main.workType = 'nameUnify'; // 默认加载项
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
       * get12Name
       * @return {String} <div><div/>
       */
        function get12Name() {
            var html = '<div ng-if="row.entity.name12Chi && row.entity.name12Chi.name" >{{row.entity.name12Chi.name}}</div>';
            return html;
        }
      /**
       * get11Name
       * @return {String} <div><div/>
       */
        function get11Name() {
            var html = '<div ng-if="row.entity.name11Chi && row.entity.name11Chi.name" >{{row.entity.name11Chi.name}}</div>';
            return html;
        }
      /**
       * getCkRules
       * @return {String} <div><div/>
       */
        function getCkRules() {
            var html = '<div ng-if="row.entity.ckRules.length" ng-repeat="item in row.entity.ckRules">{{$index+1 +\',\'+item.log}}</div><div class="ui-grid-cell-contents" ng-if="!row.entity.ckRules.length" >无</div>';
            return html;
        }
      /**
       * formatShortName
       * @return {String} <div><div/>
       */
        function formatShortName() {
            var html = '<div ng-if="row.entity.name51ChiArr.length">{{grid.appScope.getShortName(row.entity.name51ChiArr)}}</div>';
            return html;
        }

        $scope.getShortName = function (name51ChiArr) {
            var namestrArr = [];
            if (name51ChiArr.length > 0) {
                for (var i = 0; i < name51ChiArr.length; i++) {
                    namestrArr.push(name51ChiArr[i].name);
                }
            }
            return namestrArr.join(',');
        };
        // 别名
      /**
       * combinAliasName
       * @param {Object} scope scope
       * @param {Object} row row
       * @return {String} <div><div/>
       */
        function combinAliasName(scope, row) {
            var html = '<div>{{grid.appScope.getCombinAliasName(row.entity.name31ChiArr)}}</div>';
            return html;
        }

        $scope.getCombinAliasName = function (name31ChiArr) {
            var namestrArr = [];
            if (name31ChiArr.length > 0) {
                for (var i = 0; i < name31ChiArr.length; i++) {
                    if (name31ChiArr[i].name) {
                        namestrArr.push(name31ChiArr[i].name);
                    }
                }
            }
            return namestrArr.join(',');
        };
        // 查看质检问题
      /**
       * formatQueData
       * @return {String} <span><span/>
       */
        function formatQueData() {
            return '<span class="badge show-info-text" style="background-color: #ffcc00; cursor: pointer;" ng-click="grid.appScope.showQueInfo(row.entity.classifyRules, row.entity.pid, row.entity.namePinyin.pid);">{{grid.appScope.getQueData(row.entity)}}</span>';
        }
        $scope.getQueData = function (row) {
            var quaStatusArray = ['', '查看', '已查看'];
            var _text = '';
            if (row.isProblem) {
                if (row.isProblem.py) {
                    _text = quaStatusArray[row.isProblem.py[row.namePinyin.pid]];
                } else {
                    _text = quaStatusArray[row.isProblem.other];
                }
            }
            return _text;
        };
        // 获取质检信息
        $scope.showQueInfo = function (rule, pid, id) {
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
                    $scope.$broadcast('refreshShowQua', { rule: rule, id: pid, nameId: id ? id + '' : '' });
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
        // 存放在$scope中的目的是在弹出面板中也可以使用此方法
        $scope.getNameStr = function () {
            var html = '<div ng-bind-html="grid.appScope.heightLightCn(row.entity.namePinyin.name, row.entity.namePinyin.multiPinyin)"></div>';

            return html;
        };
        $scope.getPinyin = function () {
            var html = '<div ng-if="row.entity.namePinyin && row.entity.namePinyin.name" ng-bind-html="grid.appScope.heightLightPin(row.entity.namePinyin.namePhonetic, row.entity.namePinyin.name, row.entity.namePinyin.multiPinyin)"></div>';
            return html;
        };
        /**
         * 递归寻找出现重复的元素，将下标放入集合中
         * @param {String} str 目标字符串 去空格后的中文
         * @param {Array} ele 重复元素 如行
         * @param {array} arrList 存放的集合 用于存储 多音字在str中重复出现的下标
         * @param {Number} startIndex 开始下标
         * @return {undefined}
         */
        var resu = function (str, ele, arrList, startIndex) {
            var index = str.indexOf(ele, startIndex);
            if (index != -1) {
                arrList.push(index);
                resu(str, ele, arrList, index + 1);
            }
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
         * 高亮多音字
         * @param {String} zhongwen 中文
         * @param {String} duoyinzi 多音字
         * @returns {*} value
         */
        $scope.heightLightCn = function (zhongwen, duoyinzi) {
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
                    value = value.substr(0, realIndex - 1) + '<span class="redWord">' + chiV + '</span>' + value.substr(realIndex);
                }
            }
            return value;
        };
        /**
         * 高亮拼音方法
         * @param {Array} pinyin 拼音内容
         * @param {Array} zhongwen 中文内容
         * @param {Array} duoyinzi 多音字数组
         * @returns {Array} pinyinArr
         */
        $scope.heightLightPin = function (pinyin, zhongwen, duoyinzi) {
            // 多音字默认值
            var perRadioDefaultVal = [];
            // 获取用空格拆分的拼音数组
            var pinyinArr = pinyin.split(' ');
            // pyIndexArray 用于保存需要高亮的拼音下标
            var pyIndexArray = [];
            if (duoyinzi != undefined) {
                for (var j = 0; j < duoyinzi.length; j++) {
                    var index = 0;
                    var addFlag = false;
                    // 中文多音字下标，去空格后的中文多音字下标
                    var zhongwenIndex = duoyinzi[j][0];
                    // 循环每个拼音
                    var tmpIndex = -1;
                    for (var i = 0; i < pinyinArr.length; i++) {
                        // 将当前的词半角转全角
                        var perPYF = Utils.ToDBC(pinyinArr[i]);
                        // indexOf(目标字符串,开始位置) 中文去空格后匹配 全角拼音 判断是否有类似ABC
                        var perIndex = zhongwen.replace(/\s/g, '').indexOf(perPYF, tmpIndex);
                        // 判断是否含有中文中为No.重，拼音中为No.chong的情况
                        if (pinyinArr[i].toUpperCase().indexOf('NO.') > -1 && perIndex < 0) {
                            var NoArr = [];
                            var lastIndex = pinyinArr[i].lastIndexOf('.');
                            NoArr[0] = pinyinArr[i].substring(0, lastIndex + 1);
                            NoArr[1] = pinyinArr[i].substring(lastIndex + 1);
                            var Arr1 = pinyinArr.slice(0, i);
                            var Arr2 = pinyinArr.slice(i + 1, pinyinArr.length);
                            pinyinArr = Arr1.concat(NoArr).concat(Arr2);
                        }
                        // 数组重拼后，重新取值，重新匹配
                        perPYF = Utils.ToDBC(pinyinArr[i]);
                        // indexOf(目标字符串,开始位置) 中文去空格后匹配 全角拼音 判断是否有类似ABC
                        perIndex = zhongwen.replace(/\s/g, '').indexOf(perPYF, tmpIndex);
                        // 只有下标小于当前zhongwenIndex的perPYF才需要计算差值
                        if (perIndex != -1 && perIndex < zhongwenIndex) {
                            // 计算下次匹配的起始位置
                            tmpIndex = perIndex + 1;   // ABCD中ABC行
                            // 当是A时 不影响拼音下标
                            if (perPYF.length > 1) {
                                addFlag = true;
                                // 当前拼音单词与给出的中文下标的插值
                                index += perPYF.length - 1;
                                tmpIndex = perIndex + perPYF.length - 1; // 开始检索的位置需要同步调整
                            }
                        }
                    }
                    // 当addFlag为true代表有差值
                    if (addFlag) {
                        // 如果有差值，重新计算拼音的下标
                        pyIndexArray.push(zhongwenIndex - index);
                    } else {
                        // 中文有空格不影响拼音的位置
                        pyIndexArray.push(zhongwenIndex);
                    }
                }
            }
            // 按下标高亮拼音
            for (var m = 0; m < pyIndexArray.length; m++) {
                perRadioDefaultVal.push(pinyinArr[pyIndexArray[m]]);
                pinyinArr[pyIndexArray[m]] = "<span class='redWord'>" + pinyinArr[pyIndexArray[m]] + '</span>';
            }
            $scope.radioDefaultVal = perRadioDefaultVal;
            return pinyinArr.join(' ');
        };
        // 由于拼音作业的特殊性，需要将有多音字的拆成多行
        var parseNamesMultiPinyin = function (list) {
            var returnList = [];
            var i = 0;
            var j = 0;
            for (;i < list.length; i++) {
                var nameArr = list[i].names;
                for (j = 0; j < nameArr.length; j++) {
                    // 存在多音字，并且是大陆,港澳暂时不支持
                    if (nameArr[j].multiPinyin && nameArr[j].multiPinyin.length > 0 && nameArr[j].langCode === 'CHI') {
                        var row = Utils.clone(list[i]);
                        row.names = [];
                        var composeStr = nameArr[j].nameClass + '' + nameArr[j].nameType;
                        switch (composeStr) {
                            case '11': // 官方标准
                            case '31': // 别名
                            case '51': // 中文简称
                            // case '61': // 曾用
                                nameArr[j].nameClass = 'A';
                                nameArr[j].nameType = 'A';
                                nameArr[j].langCode = 'A';
                                row.names.push(nameArr[j]);
                                returnList.push(row);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            return returnList;
        };

        $scope.toggleVisible = function () {
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        // 表格显示的列
        $scope.cols = [];

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
                    { field: 'classifyRules', displayName: '作业类型', cellTemplate: formatClassifyRules, visible: true, minWidth: 150 },
                    { field: 'kindName', displayName: '分类', enableSorting: true, visible: true, minWidth: 150 }
                ],
                // 名称统一
                nameUnify: [
                    { field: 'name12Chi.name', displayName: '官方原始名称', enableSorting: true, cellTemplate: get12Name, visible: true, minWidth: 150 },
                    { field: 'name11Chi.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, visible: true, minWidth: 150 },
                    { field: 'ckRules', displayName: '错误', cellTemplate: getCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 简称作业
                shortName: [
                    { field: 'name11Chi.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, visible: true, minWidth: 150 },
                    { field: 'name12Chi.name', displayName: '简称', cellTemplate: formatShortName, visible: true, minWidth: 150 },
                    { field: 'ckRules', displayName: '错误', cellTemplate: getCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 别名作业
                aliasName: [
                    { field: 'name11Chi.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, visible: true, minWidth: 150 },
                    { field: 'name31ChiArr', displayName: '别名', cellTemplate: combinAliasName, visible: true, html: true, inputType: 'text', minWidth: 150 },
                    { field: 'parentGroupId', displayName: '父组', visible: true, minWidth: 100 },
                    { field: 'childrenGroupId', displayName: '子组', visible: true, minWidth: 100 },
                    { field: 'ckRules', displayName: '错误', cellTemplate: getCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 拼音作业
                namePinyin: [
                    { field: 'namePinyin.name', displayName: '名称', enableSorting: true, cellTemplate: $scope.getNameStr, visible: true, minWidth: 150 },
                    { field: 'namePinyin.namePhonetic', displayName: '拼音', enableSorting: true, cellTemplate: $scope.getPinyin, visible: true, minWidth: 150 },
                    { field: 'ckRules', displayName: '错误', cellTemplate: getCkRules, visible: alreadyChecked, minWidth: 200 }
                ],
                // 后公共列
                lastCols: [
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
        // 格式化row(为了给row绑定事件)
      /**
       * formatRow
       * @return {String} <div><div/>
      */
        function formatRow() {
            var html = '<div ng-dblClick="grid.appScope.selectData(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
        $scope.searchModel = {
            firstWorkItem: 'poi_name',
            secondWorkItem: $scope.main.workType, // 'nameUnify',
            status: $scope.dataListType
            
        };
        // 获取表格数据;
      /**
       * formatRow
       * @param {Object} options 多参
       * @return {undefined}
       */
        function getData(options) {
            $scope.gridOptions.totalItems = 0;
            $scope.gridOptions.data = [];
            var param = {
                firstWorkItem: 'poi_name',
                secondWorkItem: $scope.main.workType, // 'nameUnify',
                status: $scope.dataListType
            };
            var params = $.extend(param, options);
            $scope.loadingFlag = true;
            dsColumn.queryColumnDataList(params).then(function (data) {
                var temp = [];
                if ($scope.main.workType === 'namePinyin') {
                    temp = new FM.dataApi.ColPoiList(parseNamesMultiPinyin(data.rows)); // 名称存在一个POI有多个拼音要作业，所以需要将存在多个拼音的POI转换成多行
                } else {
                    temp = new FM.dataApi.ColPoiList(data.rows);
                }
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
        // 初始化表格;
        var initTable = function () {
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
        };
        // 搜索
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
            $scope.searchText = '';
            // 如果是待提交增加质检问题
            conbineCols();
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
                    if ($scope.main.workType == 'namePinyin') {
                        if ($scope.allTableList[i].isProblem.py[$scope.allTableList[i].namePinyin.pid] == '1') {
                            swal('提示', '存在未查看的数据！', 'warning');
                            return;
                        }
                    } else {
                        if ($scope.allTableList[i].isProblem.other == '1') {
                            swal('提示', '存在未查看的数据！', 'warning');
                            return;
                        }
                    }
                }
            }
            $scope.showLoading.flag = true;
            dsColumn.submitData('poi_name', $scope.main.workType).then(function (jobId) {
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
                firstWorkItem: 'poi_name',
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

        // 预加载，实际到ngDialog.open的时候才用到，
        $ocLazyLoad.load('./colEditor/ml/chinaName/chinaNameEditCtrl.js');

        var openEditDialog = function (isCollectData) {
            $scope.isCollectData = false;
            if (isCollectData) {
                $scope.isCollectData = true;
            }

            $scope.combiPerPageEditData();

            var dialog = ngDialog.open({
                template: 'colEditor/ml/chinaName/chinaNameEditTpl.html',
                controller: 'chinaNameEditCtrl',
                className: 'ngdialog-theme-plain dialog-edit',
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

        var selectPinyinData = function (arr, allData) {
            var returnArr = [];
            var rowIdObj = {};
            var i = 0;
            for (i = 0; i < arr.length; i++) { // 根据rowId去重
                rowIdObj[arr[i].rowId] = true;
            }
            for (var key in rowIdObj) {
                if (rowIdObj.hasOwnProperty(key)) {
                    for (i = 0; i < allData.length; i++) {
                        if (key == allData[i].rowId) {
                            returnArr.push(allData[i]);
                        }
                    }
                }
            }
            return returnArr;
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
                if ($scope.main.workType == 'namePinyin') { // 对拼音的特殊处理，主要解决一个poi有多个拼音时，如果用户选择了一个拼音，程序需要将这个poi的所有拼音一次进行编辑
                    checkedArr = selectPinyinData(checkedArr, temp);
                }
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

        $scope.searchObject.searchType = 'standardname'; // 搜索下拉框默认选中standardname
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
                    name = temp.name11Chi.name; // 官方标准
                } else if ($scope.searchObject.searchType === 'originalname') {
                    name = temp.name12Chi.name; // 官方原始
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
            $scope.searchObject.searchType = 'standardname';
        };

        $scope.$on('refreshChildrenPage', function (event, obj) {
            if ($scope.main.workType === 'nameUnify') {
                $scope.searchPlaceholder = '官方原始名称';
                $scope.enableBatch = true;
            } else if ($scope.main.workType === 'shortName') {
                $scope.searchPlaceholder = '官方标准名称';
                $scope.enableBatch = false;
            } else if ($scope.main.workType === 'aliasName') {
                $scope.searchPlaceholder = '官方标准名称';
                $scope.enableBatch = false;
            } else if ($scope.main.workType === 'namePinyin') {
                $scope.searchPlaceholder = '名称';
                $scope.enableBatch = false;
            }
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
                    if ($scope.main.workType === 'namePinyin') {
                        if ($scope.allTableList[i].namePinyin.pid === obj.nameId) {
                            $scope.allTableList[i].isQuality = 2;
                            if ($scope.allTableList[i].isProblem) {
                                $scope.allTableList[i].isProblem.py[$scope.allTableList[i].namePinyin.pid] = '2';
                            }
                        }
                    } else {
                        if ($scope.allTableList[i].pid === obj.pid) {
                            $scope.allTableList[i].isQuality = 2;
                            if ($scope.allTableList[i].isProblem) {
                                $scope.allTableList[i].isProblem.other = '2';
                            }
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
