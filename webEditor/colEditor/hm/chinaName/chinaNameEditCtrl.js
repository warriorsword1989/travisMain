/**
 * Created by mali on 2018/1/8.
 */

angular.module('app').controller('hmChinaNameEditCtrl', ['$scope', '$sce', 'dsColumn', 'ngDialog', 'dsLazyload', '$timeout', 'appPath', 'hotkeys',
    function ($scope, $sce, dsColumn, ngDialog, dsLazyload, $timeout, appPath, hotkeys) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var height = document.documentElement.clientHeight;
        $scope.panelBodyHight = {
            height: (height - 105) + 'px'
        };
        $scope.tableBodyHeight = {
            height: (height - 146) + 'px'
        };
        $scope.popViewFlag = false;
        $scope.searchObject.searchType = 'standardname';
        $scope.batchEditDialog = $scope.isCollectData;
        $scope.closePop = function () {
            $scope.popViewFlag = false;
        };
      /**
       * get12Name
       * @return {String} <div><div/>
       */
        function get12Name() {
            return '<div>{{row.entity.name12Cht.name}}</div>';
        }
      /**
       * get11NameInput
       * @return {String} <div><div/>
       */
        function get11NameInput() {
            var html = "<div><input type='text' maxlength='64' value='{{row.entity.name11Cht.name}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"name11Cht\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.name11Cht.name' /></div>";
            return html;
        }
      /**
       * get11Name
       * @return {String} <div><div/>
       */
        function get11Name() {
            return '<div>{{row.entity.name11Cht.name}}</div>';
        }
      /**
       * formatRefMsg
       * @return {String} <div><div/>
       */
        function formatRefMsg() {
            var html = '<div ng-bind-html="grid.appScope.getRefMsg(row.entity)"></div>';
            return html;
        }
        $scope.getRefMsg = function (row) {
            var refMsgs = row.chiNameList;
            var html = '';
            for (var i = 0; i < refMsgs.length; i++) {
                if (refMsgs[i].result) {
                    html += (i + 1) + '."' + refMsgs[i].key + '"应为"' + refMsgs[i].result + '";<br>';
                } else {
                    html += (i + 1) + '."' + refMsgs[i].key + '"请确认;<br>';
                }
            }
            return '<span>' + html + '</span>';
        };
      /**
       * getDetails
       * @return {String} <a><a/>
       */
        function getDetails() {
            return '<a class="cursor-point" style="color: #636ef5" ng-click="grid.appScope.showDetail(row.entity);">详情</a>';
        }
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
       * getClassifyRules
       * @param {Object} scope scope
       * @param {Object} row row
       * @return {String} <span><span/>
       */
        function getClassifyRules(scope, row) {
            var html = '';
            if (row.classifyRules) {
                var type = row.classifyRules.split(',');
                for (var i = 0; i < type.length; i++) {
                    html += '<span class="badge">' + App.Config.Constant.poi.classifyRules[type[i]] + '</span>';
                }
            }
            return html;
        }

      /**
       * formatCkRules
       * @return {String} <div><div/>
       */
        function formatCkRules() { // 1 不可忽略 2可忽略
            var html = '<div ng-if="row.entity.ckRules.length>0" ng-repeat="item in row.entity.ckRules"><span>' +
                '{{$index+1 + ".[" + item.ruleId + "]" + item.log}}' +
                '<button ng-if="item.level==2" ng-disabled="item.disabled" class="btn btn-primary btn-xs" ng-click="grid.appScope.doIgnorError(item.md5Code,$event,item)">忽略</button>' +
                '</span></div>' +
                '<div ng-if="row.entity.ckRules.length<1">无</div>';
            return html;
        }
        $scope.doIgnorError = function (md5Code, e, item) {
            swal({
                title: '确定忽略？',
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '确定',
                confirmButtonColor: '#ec6c62'
            }, function (f) {
                if (f) {
                    var param = {
                        md5Code: md5Code,
                        type: 2,
                        oldType: 0 // 精编传0哦
                    };
                    dsColumn.ignoreError(param).then(function (res) {
                        if (res) {
                            e.target.disabled = true;
                            item.disabled = true;
                        }
                    });
                }
            });
        };
      /**
       * formatShortName
       * @return {String} <div><div/>
       */
        function formatShortName() {
            var html = '<div style="display: flex;">' +
                '<div><div ng-repeat="item in row.entity.name51ChtArr">' +
                '<div class="input-group" style="margin-right: 3px;margin-bottom: 3px">' +
                '<input type="text" maxlength="200" class="form-control" style="height:30px;" ng-model="item.name">' +
                '<span  class="input-group-addon" style="padding:6px 6px;cursor: pointer;"><a ng-click="grid.appScope.deleteShortName(row.entity,$index)"><span class="glyphicon glyphicon-remove"></span></a></span></div></div>' +
                '</div><div><button type="button" ng-click="grid.appScope.addShortName(row.entity, $event);" style="padding: 6px 5px;height:100%" class="btn btn-info"><span class="glyphicon glyphicon-plus"></span></button></div></div>';
            return html;
        }

        $scope.deleteShortName = function (row, index) {
            row.name51ChtArr.splice(index, 1);
        };
        /**
         * 过去groupNameId
         * 处理规则:官方标准必须是1，官方原始必须是2,其他的依次增加。
         * 处理方式：是在同组names中找最大的nameGroupId，然后加一
         * @param {Object} row row
         * @returns {number} nameGroupId
         */
        var getNameGroupId = function (row) {
            var names = row.namesTemp;
            var nameGroupId = 2;
            if (names.length > 2) {
                for (var i = 0; i < names.length; i++) {
                    if (names[i].langCode == 'CHI' || names[i].langCode == 'CHT') { // 兼容港澳大陆，港澳和大陆不可能同时存在
                        if (names[i].nameGroupid >= nameGroupId) {
                            nameGroupId = names[i].nameGroupid;
                        }
                    }
                }
            }
            nameGroupId++;
            return nameGroupId;
        };
        $scope.addShortName = function (row, e) { // 中文简称
            var groupId = getNameGroupId(row); // 获取namegroupId
            var shortName = new FM.dataApi.ColPoiName({ nameClass: 5, nameType: 1, langCode: 'CHT', poiPid: row.pid, nameGroupid: groupId });
            row.namesTemp.push(shortName);
            row.name51ChtArr.unshift(shortName);
        };
      /**
       * formatAliasName 别名编辑框
       * @return {String} <div><div/>
      */
        function formatAliasName() {
            var html = '<div style="display: flex;">' +
                '<div><div ng-repeat="item in row.entity.name31ChtArr">' +
                '<div class="input-group" style="margin-right: 2px;margin-bottom: 3px"><input type="text" maxlength="200" class="form-control" style="height:30px;" ng-model="item.name">' +
                '<span  class="input-group-addon" style="padding:6px 6px;cursor: pointer;"><a ng-click="grid.appScope.deleteAliasName(row.entity,$index)"><span class="glyphicon glyphicon-remove"></span></a></span></div></div></div>' +
                '<div><button type="button" ng-click="grid.appScope.addAliasName(row.entity, $event);" style="padding: 6px 5px;height: 100%;" class="btn btn-info"><span class="glyphicon glyphicon-plus"></span></button></div></div>';
            return html;
        }
        $scope.addAliasName = function (row, e) {
            var groupId = getNameGroupId(row); // 获取namegroupId
            var shortName = new FM.dataApi.ColPoiName({ nameClass: 3, nameType: 1, langCode: 'CHT', poiPid: row.pid, nameGroupid: groupId });
            row.namesTemp.push(shortName);
            row.name31ChtArr.unshift(shortName);
            console.log($scope.currentEdited);
        };
        $scope.deleteAliasName = function (row, index) {
            row.name31ChtArr.splice(index, 1);
        };
        $scope.addOldName = function (row, e) {
            var groupId = getNameGroupId(row); // 获取namegroupId
            var shortName = new FM.dataApi.ColPoiName({ nameClass: 6, nameType: 1, langCode: 'CHI', poiPid: row.pid, nameGroupid: groupId });
            row.namesTemp.push(shortName);
            row.name61ChtArr.unshift(shortName);
        };
        $scope.deleteOldName = function (row, index) {
            row.name61ChtArr.splice(index, 1);
        };
        $scope.showDetail = function (row) {
            $scope.viewOjbect = {
                pid: row.pid,
                whole: row.whole,
                worker: row.userName,
                meshId: row.meshId,
                photos: row.photos,
                poiNum: row.poiNum
            };
            $scope.popViewFlag = true;
            $scope.imageModal = false;
        };

        $scope.showPhoto = function (photos) {
            if (photos && photos.length > 0) {
                $scope.imageModal = true;
                var ctrl = './colEditor/common/showImageCtrl.js';
                var tmpl = './colEditor/common/showImageTpl.html';
                dsLazyload.loadInclude($scope, 'imageModalTpl', ctrl, tmpl).then(function () {
                    $scope.$broadcast('imageModalReload');
                });
            }
        };
        $scope.closeImageModal = function () {
            $scope.imageModal = false;
        };
        /**
         * 根据中文下标，计算拼音下标
         * @param {String} pinyin 拼音
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
                        var perPYF = Utils.ToDBC(pinyinArr[i]);// 半角转全角，进行匹配
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
        $scope.changePinyin = function (row, e) {
            var value = e.target.value;
            var valueStr = value.split('_');
            var pinyin = valueStr[0];
            var index = valueStr[1];
            var namePinyin = row.namePinyin.namePhonetic;
            var name = row.namePinyin.name;
            var nameMultiPinyin = row.namePinyin.multiPinyin;
            var indexArr = calculateIndex(namePinyin, name, nameMultiPinyin);
            var temp = namePinyin.split(' ');
            temp[indexArr[index]] = pinyin;
            temp = temp.join(' ');
            row.namePinyin.namePhonetic = temp;
        };
      /**
       * formatPinyinRefMsg
       * @return {String} <div><div/>
       */
        function formatPinyinRefMsg() {
            var html = '<div ng-bind-html="grid.appScope.getPinyinRefMsg(row.entity)" ng-click="grid.appScope.changePinyin(row.entity,$event);"></div>';
            return html;
        }

        $scope.getPinyinRefMsg = function (row) {
            var yinArr = row.namePinyin.multiPinyin;
            var pinyinArr;
            var html = '';
            for (var j = 0; j < yinArr.length; j++) {
                var yin = yinArr[j].toString();
                var str = yin.substr(yin.indexOf(',') + 3);
                pinyinArr = str.split(',');
                var multiPYindex = yinArr[j][0];
                for (var i = 0; i < pinyinArr.length; i++) {
                    if (pinyinArr[i] == $scope.radioDefaultVal[j]) {
                        html += pinyinArr[i] + '<input type="radio" style="margin-right: 3px;width: auto;" checked= true   name="' + row.namePinyin.pid + '_' + j + '"  value="' + pinyinArr[i] + '_' + j + '" >';
                    } else {
                        html += pinyinArr[i] + '<input type="radio" style="margin-right: 3px;width: auto;"  name="' + row.namePinyin.pid + '_' + j + '"  value="' + pinyinArr[i] + '_' + j + '" >';
                    }
                }
                html += '<br>';
            }
            return $sce.trustAsHtml('<span>' + html + '</span>');
        };

        // 配置显示的列
        var chinaNameCols = {
            // 前公共列
            primaryCols: [
                { field: 'num_index', displayName: '序号', visible: true, minWidth: 50, maxWidth: 60, cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' },
                { field: 'classifyRules', displayName: '作业类型', cellTemplate: formatClassifyRules, visible: true, minWidth: 150 },
                { field: 'kindName', displayName: '分类', enableSorting: true, visible: true, minWidth: 90 }
            ],
            nameUnify: [
                { field: 'brandName', displayName: '品牌', enableSorting: true, visible: true, minWidth: 80 },
                { field: 'name12Cht.name', displayName: '官方原始名称', enableSorting: true, cellTemplate: get12Name, visible: true, minWidth: 220 },
                { field: 'parentName', displayName: '父名称', enableSorting: true, visible: true, minWidth: 180 },
                { field: 'name11Cht.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11NameInput, visible: true, minWidth: 200 }, // html: true 表示会显示成input框
                { field: 'refMsg', displayName: '参考信息', cellTemplate: formatRefMsg, visible: true, minWidth: 200 }
            ],
            shortName: [
                { field: 'name11Cht.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, visible: true, minWidth: 240 },
                { field: 'name51ChtArr', displayName: '简称', cellTemplate: formatShortName, visible: true, minWidth: 200 },
                { field: 'refMsg', displayName: '参考信息', cellTemplate: formatRefMsg, visible: true, minWidth: 240 }
            ],
            aliasName: [
                { field: 'name11Cht.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, visible: true, minWidth: 250 },
                { field: 'name31ChtArr', displayName: '别名', cellTemplate: formatAliasName, visible: true, minWidth: 240 },
                { field: 'refMsg', displayName: '参考信息', cellTemplate: formatRefMsg, visible: true, minWidth: 240 }
            ],
            namePinyin: [
                { field: 'namePinyin.name', displayName: '名称', enableSorting: true, cellTemplate: $scope.getNameStr, visible: true, minWidth: 200 },
                { field: 'namePinyin.namePhonetic', displayName: '拼音', enableSorting: true, cellTemplate: $scope.getPinyin, visible: true, minWidth: 200 },
                { field: 'refMsg', displayName: '参考信息', cellTemplate: formatPinyinRefMsg, visible: true, minWidth: 200 }
            ],
            // 后公共列
            lastCols: [
                { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, visible: true, minWidth: 200 },
                { field: 'details', displayName: '详情', cellTemplate: getDetails, visible: true, minWidth: 50 }
            ]
        };


        // 表格显示的列
        $scope.cols = [];

        var conbineCols = function () {
            $scope.cols = [];
            $scope.cols = $scope.cols.concat(chinaNameCols.primaryCols);
            if (chinaNameCols[$scope.main.workType] && chinaNameCols[$scope.main.workType].length > 0) {
                $scope.cols = $scope.cols.concat(chinaNameCols[$scope.main.workType]);
            }
            $scope.cols = $scope.cols.concat(chinaNameCols.lastCols);
            return $scope.cols.concat(chinaNameCols.lastCols);
        };
      /**
       * getData 获取表格数据
       * @return {undefined}
       */
        function getData() {
            $scope.editGridOptions.totalItems = $scope.currentEdited.length;
            $scope.editGridOptions.data = $scope.currentEdited;
        }
      /**
       * initTable
       * @return {undefined}
       */
        function initTable() {
            $scope.editGridOptions = {
                enableColumnMenus: false,
                useExternalPagination: false,
                paginationPageSizes: [15, 25, 50], // 每页显示个数选项
                paginationCurrentPage: 1, // 当前的页码
                paginationPageSize: 15, // 每页显示个数
                paginationTemplate: '@components/tools/uiGridPager/uiGridPagerTmpl.htm',
                enableFullRowSelection: false,
                enableRowHeaderSelection: false,
                multiSelect: false,
                totalItems: 0,
                modifierKeysToMultiSelect: false,
                noUnselect: false,
                enableCellEditOnFocus: true,
                columnDefs: conbineCols(),
                onRegisterApi: function (gridApi) {
                    gridApi.grid.registerRowsProcessor(FM.ColumnUtils.uiGridAutoHight, 200);
                }
            };
            // 初始化表格;
            getData();
        }

        // 中文拼音特殊处理
        var specialProcess = function (change) {
            // 拼音作业是一个poi如果有多个拼音，会分成多行编辑，保存的时候需要将多个拼音合并成一行进行保存
            if ($scope.main.selectedItem.id === 'namePinyin') {
                for (var i = change.dataList.length - 1; i > 0; i--) {
                    var cur = change.dataList[i];
                    var next = change.dataList[i - 1];
                    if (cur.pid === next.pid) {
                        if (cur.hasOwnProperty('names')) {
                            if (!next.hasOwnProperty('names')) {
                                next.names = [];
                            }
                            next.names = next.names.concat(cur.names);
                            change.dataList.splice(i, 1);
                        } else {
                            change.dataList.splice(i, 1);
                        }
                    }
                }
            }
        };
        /**
         * 获取改变的属性，并根据接口需要的格式进行组装
         * @return {Array} dataList
         */
        var getListchanges = function () {
            var allChangeData = {};
            allChangeData.dataList = [];

            for (var i = 0; i < $scope.currentEdited.length; i++) {
                $scope.currentEdited[i]._chiNameToDBC(); // 中文名称转全角
                var oriData = $scope.currentEdited[i].originData;
                var changeData = $scope.currentEdited[i].getChanges();
                if (changeData) {
                    allChangeData.dataList.push(changeData);
                } else {
                    var temp = {};
                    if (oriData.rowId) {
                        temp.rowId = oriData.rowId;
                    }
                    if (oriData.pid) {
                        temp.pid = oriData.pid;
                    }
                    temp.objStatus = 'UPDATE';
                    allChangeData.dataList.push(temp);
                }
            }
            specialProcess(allChangeData);
            var dataList = $scope.main.combiSaveParam(allChangeData);
            return dataList;
        };
        var save = function () {
            var dataList = getListchanges();
            var param = {
                firstWorkItem: 'poi_name',
                secondWorkItem: $scope.main.workType,
                dataList: dataList
            };
            $scope.showLoading.flag = true;
            dsColumn.saveData(param).then(function (res) {
                $scope.showLoading.flag = false;
                if (res) {
                    $scope.main.jobIds.push(res);
                    var leave = $scope.combiPerPageEditData();
                    if (leave && leave.length === 0) {
                        swal({
                            title: '提示',
                            text: '保存成功，已经是最后一页数据了！',
                            type: 'info'
                        }, function () {
                            ngDialog.close();
                        });
                    } else {
                        swal('提示', '保存成功！', 'info');
                        initTable();
                    }
                }
            });
        };

        /**
         * 判断名称是否为空，官方标准中文名只会有一个直接判断name属性，简称和别名都是数组需要判断数组中的每一项的name属性
         * @param {Array} dataList 数据列表
         * @returns {boolean} flag
         */
        var nameIsEmpty = function (dataList) {
            var flag = false;
            var i,
                j,
                len,
                nameObj;
            if ($scope.main.workType === 'nameUnify') {
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name11Cht;
                    if (nameObj.name === '') {
                        flag = true;
                        break;
                    }
                }
            } else if ($scope.main.workType === 'shortName') {
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name51ChtArr;
                    for (j = 0; j < nameObj.length; j++) {
                        if (nameObj[j].name === '') {
                            flag = true;
                            break;
                        }
                    }
                }
            } else if ($scope.main.workType === 'aliasName') {
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name31ChtArr;
                    for (j = 0; j < nameObj.length; j++) {
                        if (nameObj[j].name === '') {
                            flag = true;
                            break;
                        }
                    }
                }
            }
            return flag;
        };

        /**
         * 删除name字段为空的简称和别名数组对象
         * @param {Array} dataList 数据列表
         * @return {undefined}
         */
        var deleteEmptyName = function (dataList) {
            var i,
                j,
                len,
                nameObj;
            if ($scope.main.workType === 'shortName') {
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name51ChtArr;
                    for (j = 0; j < nameObj.length; j++) {
                        if (nameObj[j].name === '') {
                            nameObj.splice(j, 1);
                            j--;
                        }
                    }
                }
            } else if ($scope.main.workType === 'aliasName') {
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name31ChtArr;
                    for (j = 0; j < nameObj.length; j++) {
                        if (nameObj[j].name === '') {
                            nameObj.splice(j, 1);
                            j--;
                        }
                    }
                }
            }
        };

        $scope.doSave = function () {
            var workType = $scope.main.workType;
            var flag = nameIsEmpty($scope.currentEdited);
            if (workType === 'nameUnify' && flag) {
                swal({ title: '提示', text: '官方标准中文名称不能为空！', type: 'info' });
                return;
            } else if ((workType === 'shortName' || workType === 'aliasName') && flag) {
                swal({
                    title: '提示',
                    text: '确定要清空？',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                    confirmButtonColor: '#ec6c62'
                }, function (f) {
                    if (f) {
                        deleteEmptyName($scope.currentEdited);
                        save();
                    }
                });
                return;
            }
            save();
        };

        // ----- 以下为批量编辑的代码-----
        var currentReplaceIndex = 0; // 当前替换的行数

        // 设置光标显示的位置
        var setFocusByIndex = function () {
            $('.chinaNameTable .ui-grid-row:eq(' + currentReplaceIndex + ') .ui-grid-cell:eq(6) input').focus();
        };

        $scope.batchEdit = function () {
            $scope.batchEditDialog = true;
            currentReplaceIndex = 0;
            $scope.searchObject.searchText = '';
            $scope.searchObject.replaceText = '';
            $scope.isCollectData = false;
            setFocusByIndex();
        };

        // 下一行
        $scope.nextLine = function () {
            if ($scope.currentEdited.length > currentReplaceIndex + 1) {
                currentReplaceIndex++;
            } else {
                currentReplaceIndex = 0;
            }
            setFocusByIndex();
        };
        /**
         * 批量编辑取消功能
         * @return {undefined}
         */
        $scope.clearSearch = function () {
            $scope.searchObject.searchText = '';
            $scope.searchObject.replaceText = '';
            $scope.batchEditDialog = false;
            $scope.isCollectData = false;
            currentReplaceIndex = 0;
        };
        /**
         * 替换
         * @return {undefined}
         */
        $scope.doReplace = function () {
            var searchText = $scope.searchObject.searchText;
            var searchTextDbc = Utils.ToDBC(searchText);
            var searchTextCbd = Utils.ToCDB(searchText);
            var replaceVal = $scope.searchObject.replaceText;
            if (!(searchText || replaceVal)) {
                swal('提示', '‘将’和‘替换为’字段至少需要填一项！', 'warning');
                return;
            }

            var currentData = $scope.currentEdited[currentReplaceIndex];

            if ($scope.searchObject.searchType === 'standardname') {
                var name = currentData.name11Cht.name; // 官方标准
                var finalyValue = name.split(searchTextDbc).join(replaceVal);
                if (searchText) {
                    if (finalyValue == name) {
                        finalyValue = name.split(searchTextCbd).join(replaceVal);
                    }
                } else {
                    if (!name) {
                        finalyValue = replaceVal;
                    }
                }

                currentData.name11Cht.name = finalyValue;
            }
            setFocusByIndex();
        };
        /**
         * 全部替换
         * @return {undefined}
         */
        $scope.doReplaceAll = function () {
            var searchText = $scope.searchObject.searchText;
            var searchTextDbc = Utils.ToDBC(searchText);
            var searchTextCbd = Utils.ToCDB(searchText);
            var replaceVal = $scope.searchObject.replaceText;
            if (!(searchText || replaceVal)) {
                swal('提示', '‘将’和‘替换为’字段至少需要填一项！', 'warning');
                return;
            }
            var count = 0;
            for (var i = 0; i < $scope.currentEdited.length; i++) {
                var temp = $scope.currentEdited[i];
                if ($scope.searchObject.searchType === 'standardname') {
                    var name = temp.name11Cht.name; // 官方标准
                    if (searchText) {
                        if ((name && name.indexOf(searchTextDbc) > -1) || (name && name.indexOf(searchTextCbd) > -1)) {
                            count += 1;
                            var finalyValue = name.split(searchTextDbc).join(replaceVal);
                            if (finalyValue == name) {
                                finalyValue = name.split(searchTextCbd).join(replaceVal);
                            }
                            temp.name11Cht.name = finalyValue;
                        }
                    } else {
                        if (!name) {
                            count += 1;
                            temp.name11Cht.name = replaceVal;
                        }
                    }
                }
            }
            swal('提示', '全部替换完成，共进行了' + count + '处替换!', 'info');
        };

        // alt+down 自动替换下面的输入框
        $scope.autoCopyValue = function (type, row, attr) {
            if (type) {
                hotkeys.bindTo($scope).add({
                    combo: 'alt+down',
                    description: '自动赋值下一个',
                    allowIn: ['INPUT'],
                    callback: function (event) {
                        for (var i = 0; i < $scope.currentEdited.length; i++) {
                            if ($scope.currentEdited[i].pid === row.entity.pid) {
                                currentReplaceIndex = i + 1;
                                if (currentReplaceIndex < $scope.currentEdited.length) {
                                    $scope.currentEdited[currentReplaceIndex][attr].name = row.entity[attr].name;
                                    setFocusByIndex();
                                    break;
                                }
                            }
                        }
                    }
                });
            } else {
                hotkeys.del('alt+down');
            }
        };
        // ----- 以上为批量编辑的代码 -----

        $scope.$on('refreshChildrenPage', function () {
            initTable();
            currentReplaceIndex = 0;
        });

        // 页面初始化
        initTable();
    }]);

