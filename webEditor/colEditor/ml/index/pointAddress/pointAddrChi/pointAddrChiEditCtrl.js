/**
 * Created by mali on 2017/11/21.
 */

angular.module('app').controller('pointAddrChiEditCtrl', ['$scope', '$sce', 'dsColumn', 'ngDialog', 'dsLazyload', 'appPath', 'hotkeys',
    function ($scope, $sce, dsColumn, ngDialog, dsLazyload, appPath, hotkeys) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var height = document.documentElement.clientHeight;
        $scope.panelBodyHight = {
            height: (height - 105) + 'px'
        };
        $scope.tableBodyHeight = {
            height: (height - 146) + 'px'
        };
        $scope.batchEditDialog = $scope.isCollectData;

        /**
         * 获取城镇
         * @return {String} <div><div/>
         */
        function getTown() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"town\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"town\")'" +
                " ng-model='row.entity.nameChi.town' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.town}}</div></div>";
            return html;
        }
        /**
         * 获取地点
         * @return {String} <div><div/>
         */
        function getPlace() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"place\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"place\")'" +
                " ng-model='row.entity.nameChi.place' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.place}}</div></div>";
            return html;
        }
        /**
         * 获取街道
         * @return {String} <div><div/>
         */
        function getStreet() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"street\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"street\")'" +
                " ng-model='row.entity.nameChi.street' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.street}}</div></div>";
            return html;
        }

        /**
         * 获取前缀
         * @return {String} <div><div/>
         */
        function getPrefix() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"prefix\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"prefix\")'" +
                " ng-model='row.entity.nameChi.prefix' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.prefix}}</div></div>";
            return html;
        }
        /**
         * 获取房屋数量
         * @return {String} <div><div/>
         */
        function getHousenum() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"housenum\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"housenum\")'" +
                " ng-model='row.entity.nameChi.housenum' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.housenum}}</div></div>";
            return html;
        }
        /**
         * 获取type
         * @return {String} <div><div/>
         */
        function getType() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"type\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"type\")'" +
                " ng-model='row.entity.nameChi.type' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.type}}</div></div>";
            return html;
        }
        /**
         * 获取subnum
         * @return {String} <div><div/>
         */
        function getSubnum() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"subnum\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"subnum\")'" +
                " ng-model='row.entity.nameChi.subnum' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.subnum}}</div></div>";
            return html;
        }
        /**
         * 获取surfix
         * @return {String} <div><div/>
         */
        function getSurfix() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"surfix\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"surfix\")'" +
                " ng-model='row.entity.nameChi.surfix' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.surfix}}</div></div>";
            return html;
        }
        /**
         * 获取Estab
         * @return {String} <div><div/>
         */
        function getEstab() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"estab\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"estab\")'" +
                " ng-model='row.entity.nameChi.estab' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.estab}}</div></div>";
            return html;
        }
        /**
         * 获取building
         * @return {String} <div><div/>
         */
        function getBuilding() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"building\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"building\")'" +
                " ng-model='row.entity.nameChi.building' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.building}}</div></div>";
            return html;
        }
        /**
         * 获取Unit
         * @return {String} <div><div/>
         */
        function getUnit() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"unit\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"unit\")'" +
                " ng-model='row.entity.nameChi.unit' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.nameChi.unit}}</div></div>";
            return html;
        }


        var errors = [];    //  用途：点击保存时，验证是否存在长度超限的情况
        $scope.updateContent = function (event, row, prop) {
            var str = event.target.innerText;

            hotkeys.del('alt+down');
            if (str.length > 64) {
                swal('提示', '文本长度不能超过64个字符。', 'info');
                event.target.style.backgroundColor = '#faecc3';
                errors.push(prop);
                return;
            }

            if (row.entity.nameChi[prop] !== str) {
                row.entity.nameChi[prop] = str;
                event.target.innerText = str;   //  不知道为啥，如果文本框里本来没数据，新填入数据时，会在已填入文本之后再显示一遍文本，这里重新赋值
                event.target.style.backgroundColor = 'white';

                var index = errors.indexOf(prop);
                if (index > -1) {
                    errors.splice(index, 1);
                }
            }
        };

        /**
         * 根据中文下标，计算拼音下标
         * @param {String} pinyin 拼音
         * @param {String} zhongwen 中文
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

        // 注意 ng-click="grid.appScope.changePinyin(row,$event);"事件只能放在当前div中，不能放置在getRefMsg方法中（不会触发ng-click）

        /**
         * 格式化检查结果
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

        $scope.getTownMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.town" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'town\')"></div>';
            return html;
        };

        $scope.getPlaceMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.place" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'place\')"></div>';
            return html;
        };

        $scope.getStreetMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.street" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'street\')"></div>';
            return html;
        };

        $scope.getPrefixMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.prefix" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'prefix\')"></div>';
            return html;
        };

        $scope.getHousenumMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.housenum" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'housenum\')"></div>';
            return html;
        };

        $scope.getTypeMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.type" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'type\')"></div>';
            return html;
        };

        $scope.getSubnumMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.subnum" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'subnum\')"></div>';
            return html;
        };

        $scope.getSurfixMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.surfix" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'surfix\')"></div>';
            return html;
        };

        $scope.getEstabMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.estab" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'estab\')"></div>';
            return html;
        };

        $scope.getBuildingMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.building" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'building\')"></div>';
            return html;
        };

        $scope.getUnitMultiStr = function () {
            var html = '<div ng-if="row.entity.nameChi && row.entity.nameChi.unit" ng-bind-html="grid.appScope.heightLightPin(row.entity, \'unit\')"></div>';
            return html;
        };

        /**
         * 生成多音字
         * @param {String} key 字段
         * @return {string} html
         */
        function formatPinyinRefMsg(key) {
            var html = '<div ng-bind-html="grid.appScope.getPinyinRefMsg(row.entity, \'' + key + '\')" ng-click="grid.appScope.changePinyin(row.entity, $event, \'' + key + '\');"></div>';
            return html;
        }

        var getDefaultVal = function (pinyin, zhongwen, duoyinzi) {
            var pyIndexArray = $scope.getMutiIndex(pinyin, zhongwen, duoyinzi);
            var defaultArr = [];
            var pinyinArr = pinyin.split(' ');
            // 按下标高亮拼音
            for (var m = 0; m < pyIndexArray.length; m++) {
                defaultArr.push(pinyinArr[pyIndexArray[m]]);
            }
            return defaultArr;
        };

        $scope.getPinyinRefMsg = function (row, key) {
            var pinyin = row.nameChi[key + 'Phonetic'];
            var zhongwen = row.nameChi[key];
            var duoyinzi = row.nameChi[key + 'MultiPinyin'];
            var defaultArr = getDefaultVal(pinyin, zhongwen, duoyinzi);

            var yinArr = row.nameChi[key + 'MultiPinyin'];
            var pinyinArr;
            var html = '';
            for (var j = 0; j < yinArr.length; j++) {
                var yin = yinArr[j].toString();
                var str = yin.substr(yin.indexOf(',') + 3);
                pinyinArr = str.split(',');
                for (var i = 0; i < pinyinArr.length; i++) {
                    if (pinyinArr[i] == defaultArr[j]) {
                        html += pinyinArr[i] + '<input type="radio" style="margin-right: 3px;width: auto;" checked= true name="' + row.nameChi.pid + '_' + j + '_' + key + '"  value="' + pinyinArr[i] + '_' + j + '_' + key + '" >';
                    } else {
                        html += pinyinArr[i] + '<input type="radio" style="margin-right: 3px;width: auto;"  name="' + row.nameChi.pid + '_' + j + '_' + key + '"  value="' + pinyinArr[i] + '_' + j + '_' + key + '" >';
                    }
                }
                html += '<br>';
            }
            return $sce.trustAsHtml('<span>' + html + '</span>');
        };

        $scope.changePinyin = function (row, e, key) {
            var value = e.target.value;
            if (!value) {
                return;
            }
            var valueStr = value.split('_');
            var pinyin = valueStr[0];
            var index = valueStr[1];
            var namePinyin = row.nameChi[key + 'Phonetic'];
            var name = row.nameChi[key];
            var nameMultiPinyin = row.nameChi[key + 'MultiPinyin'];
            var indexArr = calculateIndex(namePinyin, name, nameMultiPinyin);
            var temp = namePinyin.split(' ');
            temp[indexArr[index]] = pinyin;
            temp = temp.join(' ');
            row.nameChi[key + 'Phonetic'] = temp;
        };


        // 配置显示的列
        var chinaNameCols = {
            // 前公共列
            primaryCols: [
                { field: 'num_index', displayName: '序号', visible: true, minWidth: 50, maxWidth: 60, cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' },
                { field: 'nameChi.nameId', displayName: '名称号码', enableSorting: true, cellTemplate: getName, visible: true, minWidth: 100 }
            ],
            pointAddrSplit: [
                { field: 'memoire', displayName: '外业Lable', enableSorting: true, cellTemplate: getMemoire, visible: true, minWidth: 100 },
                { field: 'nameChi.town', displayName: '乡镇街道办', enableSorting: true, cellTemplate: getTown, minWidth: 100 },
                { field: 'nameChi.place', displayName: '地名小区名', enableSorting: true, cellTemplate: getPlace, minWidth: 100 },
                { field: 'nameChi.street', displayName: '街巷名', enableSorting: true, cellTemplate: getStreet, minWidth: 100 },
                { field: 'nameChi.prefix', displayName: '前缀', enableSorting: true, cellTemplate: getPrefix, minWidth: 100 },
                { field: 'nameChi.housenum', displayName: '门牌号', enableSorting: true, cellTemplate: getHousenum, minWidth: 100 },
                { field: 'nameChi.type', displayName: '类型名', enableSorting: true, cellTemplate: getType, minWidth: 100 },
                { field: 'nameChi.subnum', displayName: '子号', enableSorting: true, cellTemplate: getSubnum, minWidth: 100 },
                { field: 'nameChi.surfix', displayName: '后缀', enableSorting: true, cellTemplate: getSurfix, minWidth: 100 },
                { field: 'nameChi.estab', displayName: '附属设施名', enableSorting: true, cellTemplate: getEstab, minWidth: 100 },
                { field: 'nameChi.building', displayName: '楼栋号', enableSorting: true, cellTemplate: getBuilding, minWidth: 100 },
                { field: 'nameChi.unit', displayName: '楼门号', enableSorting: true, cellTemplate: getUnit, minWidth: 100 }
            ],
            pointAddrPinyin: [
                { field: 'nameChi.town', displayName: '乡镇街道办', enableSorting: true, minWidth: 160 },
                { field: 'nameChi.townPinyin', displayName: '乡镇街道办-拼音', cellTemplate: $scope.getTownMultiStr, minWidth: 160 },
                { field: 'nameChi.townRefMsg', displayName: '乡镇街道办-参考', cellTemplate: formatPinyinRefMsg('town'), visible: true, minWidth: 200 },
                { field: 'nameChi.place', displayName: '地名小区名', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.placePinyin', displayName: '地名小区名-拼音', cellTemplate: $scope.getPlaceMultiStr, minWidth: 160 },
                { field: 'nameChi.placeRefMsg', displayName: '地名小区名-参考', cellTemplate: formatPinyinRefMsg('place'), visible: true, minWidth: 200 },
                { field: 'nameChi.street', displayName: '街巷名', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.streetPinyin', displayName: '街巷名-拼音', cellTemplate: $scope.getStreetMultiStr, minWidth: 160 },
                { field: 'nameChi.streetRefMsg', displayName: '街巷名-参考', cellTemplate: formatPinyinRefMsg('street'), visible: true, minWidth: 200 },
                { field: 'nameChi.prefix', displayName: '前缀', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.prefixPinyin', displayName: '前缀--拼音', cellTemplate: $scope.getPrefixMultiStr, enableSorting: true, minWidth: 160 },
                { field: 'nameChi.prefixRefMsg', displayName: '前缀-参考', cellTemplate: formatPinyinRefMsg('prefix'), visible: true, minWidth: 200 },
                { field: 'nameChi.housenum', displayName: '门牌号', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.housenumPinyin', displayName: '门牌号--拼音', cellTemplate: $scope.getHousenumMultiStr, enableSorting: true, minWidth: 160 },
                { field: 'nameChi.housenumRefMsg', displayName: '门牌号-参考', cellTemplate: formatPinyinRefMsg('housenum'), visible: true, minWidth: 200 },
                { field: 'nameChi.type', displayName: '类型名', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.typePinyin', displayName: '类型名--拼音', cellTemplate: $scope.getTypeMultiStr, enableSorting: true, minWidth: 160 },
                { field: 'nameChi.typeRefMsg', displayName: '类型名-参考', cellTemplate: formatPinyinRefMsg('type'), visible: true, minWidth: 200 },
                { field: 'nameChi.subnum', displayName: '子号', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.subnumPinyin', displayName: '子号--拼音', cellTemplate: $scope.getSubnumMultiStr, enableSorting: true, minWidth: 160 },
                { field: 'nameChi.subnumRefMsg', displayName: '子号-参考', cellTemplate: formatPinyinRefMsg('subnum'), visible: true, minWidth: 200 },
                { field: 'nameChi.surfix', displayName: '后缀', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.surfixPinyin', displayName: '后缀--拼音', cellTemplate: $scope.getSurfixMultiStr, enableSorting: true, minWidth: 160 },
                { field: 'nameChi.surfixRefMsg', displayName: '后缀-参考', cellTemplate: formatPinyinRefMsg('surfix'), visible: true, minWidth: 200 },
                { field: 'nameChi.estab', displayName: '附属设施名', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.estabPinyin', displayName: '附属设施名--拼音', cellTemplate: $scope.getEstabMultiStr, enableSorting: true, minWidth: 160 },
                { field: 'nameChi.estabRefMsg', displayName: '附属设施名-参考', cellTemplate: formatPinyinRefMsg('estab'), visible: true, minWidth: 200 },
                { field: 'nameChi.building', displayName: '楼栋号', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.buildingPinyin', displayName: '楼栋号--拼音', cellTemplate: $scope.getBuildingMultiStr, enableSorting: true, minWidth: 160 },
                { field: 'nameChi.buildingRefMsg', displayName: '楼栋号-参考', cellTemplate: formatPinyinRefMsg('building'), visible: true, minWidth: 200 },
                { field: 'nameChi.unit', displayName: '楼门号', enableSorting: true, minWidth: 100 },
                { field: 'nameChi.unitPinyin', displayName: '楼门号--拼音', cellTemplate: $scope.getUnitMultiStr, enableSorting: true, minWidth: 160 },
                { field: 'nameChi.unitRefMsg', displayName: '楼门号-参考', cellTemplate: formatPinyinRefMsg('unit'), visible: true, minWidth: 200 }
            ],
            // 后公共列
            lastCols: [
                { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, minWidth: 200 }
            ]
        };

        var conbineCols = function () {
            var cols = [];
            cols = cols.concat(chinaNameCols.primaryCols);
            if (chinaNameCols[$scope.main.workType] && chinaNameCols[$scope.main.workType].length > 0) {
                cols = cols.concat(chinaNameCols[$scope.main.workType]);
            }
            return cols.concat(chinaNameCols.lastCols);
        };

        // 获取表格数据;
        /**
         * 获取data
         * @return {String} <div><div/>
         */
        function getData() {
            $scope.editGridOptions.totalItems = $scope.currentEdited.length;
            $scope.editGridOptions.data = $scope.currentEdited;
        }
        /**
         * 创建列表
         * @return {String} <div><div/>
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

        /**
         * 存前的特殊处理
         * @return {undefined}
         */
        var specialProcess = function () {
            for (let i = 0; i < $scope.currentEdited.length; i++) {
                $scope.currentEdited[i]._pointNameToDBC(); // 点门牌名称字段转全角
            }
        };

        $scope.doSave = function () {
            if (errors.length > 0) {
                swal('提示', '文本长度不能超过64个字符,请修改后提交。', 'info');
                return;
            }

            specialProcess();
            var change = objCtrl.compareColumData($scope.currentEditOrig, $scope.currentEdited);
            var dataList = $scope.main.combiSaveParam(change);
            var param = {
                firstWorkItem: 'pointAddr_chiAddr',
                secondWorkItem: $scope.main.selectedItem.id,
                dataList: dataList
            };
            $scope.showLoading.flag = true;
            dsColumn.savePointAddressData(param).then(function (res) {
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

        // ----- 以下为批量编辑的代码-----
        var currentReplaceIndex = 0; // 当前替换的行数

        // 设置光标显示的位置
        var setFocusByIndex = function (attr) {
            var indexArr = { province: 2,
                city: 3,
                county: 4,
                town: 5,
                place: 6,
                street: 7,
                landmark: 8,
                prefix: 9,
                housenum: 10,
                type: 11,
                subnum: 12,
                surfix: 13,
                estab: 14,
                building: 15,
                floor: 17,
                unit: 16,
                room: 18,
                addons: 19
            };
            var index = 2; // 默认是省名
            if (!attr) {
                if (indexArr[$scope.searchObject.searchType]) {
                    index = indexArr[$scope.searchObject.searchType];
                }
            } else {
                index = indexArr[attr];
            }
            $('.chinaAddressTable .ui-grid-row:eq(' + currentReplaceIndex + ') .ui-grid-cell:eq(' + index + ') div').focus();
        };

        $scope.searchTypeClick = function () {
            currentReplaceIndex = 0;
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

        // alt+down 自动替换下面的输入框
        $scope.autoCopyValue = function (row, attr) {
            hotkeys.bindTo($scope).add({
                combo: 'alt+down',
                description: '自动赋值下一个',
                callback: function () {
                    for (var i = 0; i < $scope.currentEdited.length; i++) {
                        if ($scope.currentEdited[i].pid === row.entity.pid) {
                            currentReplaceIndex = i + 1;
                            if (currentReplaceIndex < $scope.currentEdited.length) {
                                $scope.currentEdited[currentReplaceIndex].nameChi[attr] = row.entity.nameChi[attr];
                                setFocusByIndex(attr);
                                break;
                            }
                        }
                    }
                }
            });
        };
        // ----- 以上为批量编辑的代码 -----
        /**
         * 创建分页
         * @return {undefined}
         */
        function initPage() {
            initTable();
        }
        // 页面初始化
        initPage();
    }]);

