/**
 * Created by mali on 2017/11/21.
 */

angular.module('app').controller('pointAddrChiCtrl', ['$scope', '$sce', '$ocLazyLoad', 'ngDialog', 'dsColumn', 'dsEdit', '$interval', '$timeout', 'uiGridConstants', 'appPath',
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
        $scope.loadTableDataMsg = '数据加载中。。。';
        $scope.searchPlaceholder = '点门牌';
        var alreadyChecked = false;
        $scope.main.workType = 'pointAddrSplit'; // 默认加载项
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
         * 获取多音字的下标
         * @param {String} pinyin pinyin
         * @param {String} zhongwen zhongwen
         * @param {String} duoyinzi duoyinzi
         * @return {Array} 下标
         */
        $scope.getMutiIndex = function (pinyin, zhongwen, duoyinzi) {
            var perRadioDefaultVal = []; // 多音字默认值
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
            return pyIndexArray;
        };

        /**
         * 高亮拼音方法
         * @param {Object} row 行内容
         * @param {String} key 字段名
         * @returns {Array} key
         */
        $scope.heightLightPin = function (row, key) {
            var pinyin = row.nameChi[key + 'Phonetic'];
            var zhongwen = row.nameChi[key];
            var duoyinzi = row.nameChi[key + 'MultiPinyin'];

            var pinyinArr = pinyin.split(' ');
            var pyIndexArray = $scope.getMutiIndex(pinyin, zhongwen, duoyinzi);
            // 按下标高亮拼音
            for (var m = 0; m < pyIndexArray.length; m++) {
                pinyinArr[pyIndexArray[m]] = "<span class='redWord'>" + pinyinArr[pyIndexArray[m]] + '</span>';
            }
            return pinyinArr.join(' ');
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
         * 格式化外业Lable
         * @return {String} <div><div/>
         */
        function getMemoire() {
            var html = '<div ng-if="row.entity.memoire && row.entity.memoire" >{{row.entity.memoire}}</div>';
            return html;
        }

        /**
         * 格式化nameId
         * @return {String} <div><div/>
         */
        function getName() {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.nameId" >{{row.entity.nameChi.nameId}}</div>';
            return html;
        }

        $scope.getTypeText = function (row) {
            var obj = {
                0: '未调查',
                1: '楼栋门牌',
                2: '楼门门牌',
                3: '地址门牌'
            };
            return '<div>' + obj[row.type] + '</div>';
        };

        /**
         * 格式化 门牌地址号
         * @return {string} div
         */
        function getPoint() {
            var html = '<div ng-bind-html="grid.appScope.getPointText(row.entity)"></div>';
            return html;
        }

        /**
         * 获取门牌地址号 规则是 外业道路名 + 外业门牌号
         * @param {Object} row 行数据
         * @return {undefined} div
         */
        $scope.getPointText = function (row) {
            return '<div>' + row.dprName + '+' + row.dpName + '</div>';
        };

        /**
         * 获取门牌类型
         * @return {String} <div><div/>
         */
        function getType() {
            var html = '<div ng-bind-html="grid.appScope.getTypeText(row.entity)"></div>';
            return html;
        }

        /**
         * 获取检查规则信息
         * @return {String} <div><div/>
         */
        function getCkRules() {
            var html = '<div ng-if="row.entity.ckRules.length" ng-repeat="item in row.entity.ckRules">{{$index+1 +\',\'+item.log}}</div><div class="ui-grid-cell-contents" ng-if="!row.entity.ckRules.length" >无</div>';
            return html;
        }

        /**
         * 高亮拼音
         * @return {String} <div><div/>
         */
        $scope.getStreetStr = function () {
            var html = '<div ng-bind-html="grid.appScope.heightLightCn(row.entity.nameChi.street, row.entity.nameChi.streetMultiPinyin)"></div>';
            return html;
        };

        $scope.getPrefixStr = function () {
            var html = '<div ng-bind-html="grid.appScope.heightLightCn(row.entity.nameChi.prefix, row.entity.nameChi.prefixMultiPinyin)"></div>';
            return html;
        };

        $scope.formatCombinePinyin = function () {
            var html = '<div ng-bind-html="grid.appScope.getCombinePinyin(row.entity)"></div>';
            return html;
        };

        $scope.toggleVisible = function () {
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        /**
         * 格式化row(为了给row绑定事件)
         * @return {String} <div><div/>
         */
        function formatRow() {
            var html = '<div ng-dblClick="grid.appScope.selectData(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }

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
                    { field: 'nameChi.point', displayName: '点门牌', cellTemplate: getPoint, visible: true, minWidth: 100 },
                    { field: 'nameChi.nameId', displayName: '名称号码', enableSorting: true, cellTemplate: getName, visible: true, minWidth: 100 }
                ],
                // 地址作业
                pointAddrSplit: [
                    { field: 'memoire', displayName: '外业Lable', enableSorting: true, cellTemplate: getMemoire, visible: true, minWidth: 100 },
                    { field: 'type', displayName: '门牌类型', enableSorting: true, cellTemplate: getType, visible: true, minWidth: 100 }
                ],
                // 拼音作业
                pointAddrPinyin: [
                    { field: 'nameChi.town', displayName: '乡镇街道办', enableSorting: true, minWidth: 160 },
                    { field: 'nameChi.town', displayName: '乡镇街道办', enableSorting: true, minWidth: 160 },
                    { field: 'nameChi.place', displayName: '地名小区名', enableSorting: true, minWidth: 100 },
                    { field: 'nameChi.streetPinyin', displayName: '街巷名', cellTemplate: $scope.getStreetStr, minWidth: 100 },
                    { field: 'nameChi.prefix', displayName: '前缀--拼音', cellTemplate: $scope.getPrefixStr, enableSorting: true, minWidth: 100 },
                    { field: 'nameChi.housenum', displayName: '门牌号', enableSorting: true, minWidth: 100 },
                    { field: 'nameChi.type', displayName: '类型名', enableSorting: true, minWidth: 100 },
                    { field: 'nameChi.subnum', displayName: '子号', enableSorting: true, minWidth: 100 },
                    { field: 'nameChi.surfix', displayName: '后缀', enableSorting: true, minWidth: 100 },
                    { field: 'nameChi.estab', displayName: '附属设施名', enableSorting: true, minWidth: 100 },
                    { field: 'nameChi.building', displayName: '楼栋号', enableSorting: true, minWidth: 100 },
                    { field: 'nameChi.unit', displayName: '楼门号', enableSorting: true, minWidth: 100 }
                ],
                // 后公共列
                lastCols: [
                    { field: 'ckRules', displayName: '错误', cellTemplate: getCkRules, visible: alreadyChecked, minWidth: 240 },
                    { field: 'pid', displayName: 'PID', enableSorting: true, visible: false, minWidth: 100 }
                ]
            };

            $scope.cols = [];
            $scope.cols = $scope.cols.concat(chinaNameCols.primaryCols);
            if (chinaNameCols[$scope.main.workType] && chinaNameCols[$scope.main.workType].length > 0) {
                $scope.cols = $scope.cols.concat(chinaNameCols[$scope.main.workType]);
            }
            $scope.cols = $scope.cols.concat(chinaNameCols.lastCols);
            return $scope.cols;
        };

        /**
         * 获取表格数据;
         * @return {undefined}
         */
        function getData() {
            $scope.gridOptions.totalItems = 0;
            $scope.gridOptions.data = [];
            var param = {
                firstWorkItem: 'pointAddr_chiAddr',
                secondWorkItem: $scope.main.workType,
                status: $scope.dataListType
            };
            $scope.loadingFlag = true;
            dsColumn.queryPointAddressDataList(param).then(function (data) {
                var temp = new FM.dataApi.ColPointAddressList(data.rows);
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
         * 中文点门牌数据列表
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
            $scope.gridApi.grid.refresh();
        });
        $scope.singleFilter = function (renderableRows) {
            var matcher = new RegExp($scope.searchText);
            renderableRows.forEach(function (row) {
                var match = false;
                if ($scope.searchText && (row.entity.dprName.match(matcher) || row.entity.dpName.match(matcher))) {
                    match = true;
                } else if (!$scope.searchText) {
                    match = true;
                }
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
            $scope.showLoading.flag = true;
            dsColumn.submitPointAddressData('pointAddr_chiAddr', $scope.main.workType).then(function (jobId) {
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
                checkType: 10, // 1 poi粗编 ;2 poi精编 ; 3 道路粗编 ; 4道路精编 ; 5道路名 ; 6 其他； 10 点门牌月编
                firstWorkItem: 'pointAddr_chiAddr',
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
                $scope.currentEditOrig = angular.copy(resultArr);
                $scope.currentEdited = angular.copy(resultArr);
            } else {
                $scope.currentEditOrig = angular.copy($scope.allTableList);
                $scope.currentEdited = angular.copy($scope.allTableList);
                $scope.allTableList = [];
            }
            return $scope.currentEditOrig;
        };

        $ocLazyLoad.load('./colEditor/ml/index/pointAddress/pointAddrChi/pointAddrChiEditCtrl.js');

        var openEditDialog = function (isCollectData) {
            $scope.isCollectData = false;
            if (isCollectData) {
                $scope.isCollectData = true;
            }
            $scope.combiPerPageEditData();

            var dialog = ngDialog.open({
                template: 'colEditor/ml/index/pointAddress/pointAddrChi/pointAddrChiEditTpl.html',
                controller: 'pointAddrChiEditCtrl',
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

        $scope.$on('refreshChildrenPage', function (event, obj) {
            $scope.searchText = ''; // 清空搜索条件
            if (obj && obj.showErrMsg == 1) {  // 表示的是提交后需要显示错误信息列
                alreadyChecked = true;
            } else {
                alreadyChecked = false;
                $scope.dataListType = 1; // 待作业
            }
            resertProgress();
            initTable();
        });

        initTable();
    }]);
