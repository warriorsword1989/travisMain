/**
 * Created by wuzhen on 2016/12/15.
 */

angular.module('app').controller('chinaAddressEditCtrl', ['$scope', '$sce', 'dsColumn', 'ngDialog', 'dsLazyload', 'appPath', 'hotkeys',
    function ($scope, $sce, dsColumn, ngDialog, dsLazyload, appPath, hotkeys) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var height = document.documentElement.clientHeight;
        $scope.panelBodyHight = {
            height: (height - 105) + 'px'
        };
        $scope.tableBodyHeight = {
            height: (height - 146) + 'px'
        };
        $scope.popViewFlag = false;
        $scope.batchEditDialog = $scope.isCollectData;
        $scope.closePop = function () {
            $scope.popViewFlag = false;
        };
        /**
         * 获取详细信息
         * @return {String} <a><a/>
        */
        function getDetails() {
            return '<a class="cursor-point" style="color: #636ef5" ng-click="grid.appScope.showDetail(row.entity);">详情</a>';
        }
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
       * 获取类名规则
       * @param {Object} scope scope
       * @param {Object} row  row
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
       * 获取名称
       * @return {String} <div><div/>
       */
        function get11Name() {
            var html = '<div>{{row.entity.name11Chi.name}}</div>';
            return html;
        }
      /**
       * 获取全称
       * @return {String} <div><div/>
       */
        function getFullname() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>{{row.entity.addressChi.fullname}}</div>";
            return html;
        }
      /**
       * 获取进度
       * @return {String} <div><div/>
       */
        function getProvince() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"province\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"province\")'" +
                " ng-model='row.entity.addressChi.province' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.province}}</div></div>";
            return html;
        }
      /**
       * 获取城市
       * @return {String} <div><div/>
       */
        function getCity() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"city\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"city\")'" +
                " ng-model='row.entity.addressChi.city' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.city}}</div></div>";
            return html;
        }
      /**
       * 获取国家
       * @return {String} <div><div/>
       */
        function getCounty() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"county\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"county\")'" +
                " ng-model='row.entity.addressChi.county' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.county}}</div></div>";
            return html;
        }
      /**
       * 获取城镇
       * @return {String} <div><div/>
       */
        function getTown() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"town\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"town\")'" +
                " ng-model='row.entity.addressChi.town' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.town}}</div></div>";
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
                " ng-model='row.entity.addressChi.place' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.place}}</div></div>";
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
                " ng-model='row.entity.addressChi.street' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.street}}</div></div>";
            return html;
        }
      /**
       * 获取界标
       * @return {String} <div><div/>
       */
        function getLandmark() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"landmark\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"landmark\")'" +
                " ng-model='row.entity.addressChi.landmark' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.landmark}}</div></div>";
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
                " ng-model='row.entity.addressChi.prefix' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.prefix}}</div></div>";
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
                " ng-model='row.entity.addressChi.housenum' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.housenum}}</div></div>";
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
                " ng-model='row.entity.addressChi.type' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.type}}</div></div>";
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
                " ng-model='row.entity.addressChi.subnum' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.subnum}}</div></div>";
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
                " ng-model='row.entity.addressChi.surfix' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.surfix}}</div></div>";
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
                " ng-model='row.entity.addressChi.estab' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.estab}}</div></div>";
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
                " ng-model='row.entity.addressChi.building' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.building}}</div></div>";
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
                " ng-model='row.entity.addressChi.unit' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.unit}}</div></div>";
            return html;
        }
      /**
       * 获取floor
       * @return {String} <div><div/>
       */
        function getFloor() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"floor\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"floor\")'" +
                " ng-model='row.entity.addressChi.floor' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.floor}}</div></div>";
            return html;
        }
      /**
       * 获取room
       * @return {String} <div><div/>
       */
        function getRoom() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"room\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"room\")'" +
                " ng-model='row.entity.addressChi.room' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.room}}</div></div>";
            return html;
        }
      /**
       * 获取addons
       * @return {String} <div><div/>
       */
        function getAddons() {
            var html = "<div class='ui-grid-cell-contents ui-grid-cell-contents-input'>" +
                "<div ng-blur='grid.appScope.updateContent($event, row, \"addons\")'" +
                " ng-focus='grid.appScope.autoCopyValue(row,\"addons\")'" +
                " ng-model='row.entity.addressChi.addons' tabindex='-1'" +
                " class='editTableColumn mousetrap' contenteditable='true'>{{row.entity.addressChi.addons}}</div></div>";
            return html;
        }

        var errors = [];    //  用途：点击保存时，验证是否存在长度超限的情况
        $scope.updateContent = function (event, row, prop) {
            var str = row.entity.addressChi[prop];

            hotkeys.del('alt+down');
            if (str.length > 64) {
                swal('提示', '文本长度不能超过64个字符。', 'info');
                event.target.style.backgroundColor = '#faecc3';
                errors.push(prop);
                return;
            }

            event.target.innerText = str;   //  不知道为啥，如果文本框里本来没数据，新填入数据时，会在已填入文本之后再显示一遍文本，这里重新赋值
            event.target.style.backgroundColor = 'white';

            var index = errors.indexOf(prop);
            if (index > -1) {
                errors.splice(index, 1);
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
        $scope.changePinyin = function (row, e) {
            row = row.entity;
            var value = e.target.value;
            var valueStr = value.split('_');
            var pinyin = valueStr[0];
            var index = valueStr[1];
            var flag = valueStr[2];
            var indexArr = [];
            var temp = [];

            var roadnamepinyin = row[$scope.languageFlag].roadnamePhoneticStr;
            if (roadnamepinyin && flag == 'road') {
                roadnamepinyin = roadnamepinyin.replace(/\|/g, ' | ').replace(/\s+/g, ' ');
                if (roadnamepinyin.substr(0, 1) == ' ') {
                    roadnamepinyin = roadnamepinyin.substr(1);
                }
                var roadname = row[$scope.languageFlag].roadnameStr;
                var roadNameMultiPinyin = row[$scope.languageFlag].roadNameMultiPinyin;
                indexArr = calculateIndex(roadnamepinyin, roadname, roadNameMultiPinyin);

                roadnamepinyin = roadnamepinyin.replace(/\s+/g, ' ');
                temp = roadnamepinyin.split(' ');
                temp[indexArr[index]] = pinyin;
                temp = temp.join(' ').replace(/(\s\|\s)/g, '|').replace(/(\|\s)/g, '|');
                row[$scope.languageFlag].roadnamePhoneticStr = temp;
            }
            var addrnamepinyin = row[$scope.languageFlag].addrnamePhoneticStr;
            if (addrnamepinyin && flag == 'addr') {
                addrnamepinyin = addrnamepinyin.replace(/\|/g, ' | ').replace(/\s+/g, ' ');
                if (addrnamepinyin.substr(0, 1) == ' ') {
                    addrnamepinyin = addrnamepinyin.substr(1);
                }
                var addrname = row[$scope.languageFlag].addrnameStr;
                var addrNameMultiPinyin = row[$scope.languageFlag].addrNameMultiPinyin;
                indexArr = calculateIndex(addrnamepinyin, addrname, addrNameMultiPinyin);

                temp = addrnamepinyin.split(' ');
                temp[indexArr[index]] = pinyin;
                temp = temp.join(' ').replace(/(\s\|\s)/g, '|').replace(/(\|\s)/g, '|');
                row[$scope.languageFlag].addrnamePhoneticStr = temp;
            }
        };

        // 注意 ng-click="grid.appScope.changePinyin(row,$event);"事件只能放在当前div中，不能放置在getRefMsg方法中（不会触发ng-click）
      /**
       * 获取matRefMsg
       * @return {String} <div><div/>
       */
        function formatRefMsg() {
            var html = '<div ng-bind-html="grid.appScope.getRefMsg(row.entity)" ng-click="grid.appScope.changePinyin(row,$event);"></div>';
            return html;
        }

        $scope.getRefMsg = function (row) {
            var html = '';
            var i = 0;
            var j = 0;
            var yin,
                str,
                pinyinArr;
            var roadNamePinyin = row[$scope.languageFlag].roadNameMultiPinyin;
            for (i = 0; i < roadNamePinyin.length; i++) {
                yin = roadNamePinyin[i].toString();
                str = yin.substr(yin.indexOf(',') + 3);
                pinyinArr = str.split(',');
                for (j = 0; j < pinyinArr.length; j++) {
                    if (pinyinArr[j] == $scope.radioDefaultValRoad[i]) {
                        html += pinyinArr[j] + '<input type="radio" style="margin-right: 3px;width: auto;" checked="checked" value="' + pinyinArr[j] + '_' + i + '_road" name="piyin_0_' + i + row.rowId + '">';
                    } else {
                        html += pinyinArr[j] + '<input type="radio" style="margin-right: 3px;width: auto;" value="' + pinyinArr[j] + '_' + i + '_road" name="piyin_0_' + i + row.rowId + '">';
                    }
                }
                html += '<br>';
            }
            var addrNamePinyin = row[$scope.languageFlag].addrNameMultiPinyin;
            for (i = 0; i < addrNamePinyin.length; i++) {
                yin = addrNamePinyin[i].toString();
                str = yin.substr(yin.indexOf(',') + 3);
                pinyinArr = str.split(',');
                for (j = 0; j < pinyinArr.length; j++) {
                    if (pinyinArr[j] == $scope.radioDefaultValAddr[i]) {
                        html += pinyinArr[j] + '<input type="radio" style="margin-right: 3px;width: auto;" checked="checked" value="' + pinyinArr[j] + '_' + i + '_addr" name="piyin_1_' + i + row.rowId + '">';
                    } else {
                        html += pinyinArr[j] + '<input type="radio" style="margin-right: 3px;width: auto;" value="' + pinyinArr[j] + '_' + i + '_addr" name="piyin_1_' + i + row.rowId + '">';
                    }
                }
                html += '<br>';
            }
            return $sce.trustAsHtml('<span>' + html + '</span>');
        };
      /**
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
       * formatClassifyRules
       * @return {String} <div><div/>
       */
        function formatClassifyRules() {
            var html = '<div ng-repeat="item in row.entity.classifyRules.split(\',\')"><span class="badge">{{grid.appScope.getClassifyRules(item)}}</span></div>';
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

        // 配置显示的列
        var chinaNameCols = {
            // 前公共列
            primaryCols: [
                { field: 'num_index', displayName: '序号', visible: true, minWidth: 50, maxWidth: 60, cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' }
            ],
            addrSplit: [
                // { field: 'name11Chi.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, minWidth: 130 }, // bug改善
                { field: 'addressChi.fullname', displayName: '地址全称', enableSorting: true, cellTemplate: getFullname, minWidth: 180 },
                { field: 'addressChi.province', displayName: '省名', enableSorting: true, cellTemplate: getProvince, minWidth: 70 },
                { field: 'addressChi.city', displayName: '市名', enableSorting: true, cellTemplate: getCity, minWidth: 70 },
                { field: 'addressChi.county', displayName: '区县名', enableSorting: true, cellTemplate: getCounty, minWidth: 70 },
                { field: 'addressChi.town', displayName: '乡镇街道办', enableSorting: true, cellTemplate: getTown, minWidth: 90 },
                { field: 'addressChi.place', displayName: '地名小区名', enableSorting: true, cellTemplate: getPlace, minWidth: 100 },
                { field: 'addressChi.street', displayName: '街巷名', enableSorting: true, cellTemplate: getStreet, minWidth: 90 },
                { field: 'addressChi.landmark', displayName: '标志物名', enableSorting: true, cellTemplate: getLandmark, minWidth: 80 },
                { field: 'addressChi.prefix', displayName: '前缀', enableSorting: true, cellTemplate: getPrefix, minWidth: 60 },
                { field: 'addressChi.housenum', displayName: '门牌号', enableSorting: true, cellTemplate: getHousenum, minWidth: 60 },
                { field: 'addressChi.type', displayName: '类型名', enableSorting: true, cellTemplate: getType, minWidth: 60 },
                { field: 'addressChi.subnum', displayName: '子号', enableSorting: true, cellTemplate: getSubnum, minWidth: 90 },
                { field: 'addressChi.surfix', displayName: '后缀', enableSorting: true, cellTemplate: getSurfix, minWidth: 60 },
                { field: 'addressChi.estab', displayName: '附属设施名', enableSorting: true, cellTemplate: getEstab, minWidth: 100 },
                { field: 'addressChi.building', displayName: '楼栋号', enableSorting: true, cellTemplate: getBuilding, minWidth: 60 },
                { field: 'addressChi.unit', displayName: '楼门号', enableSorting: true, cellTemplate: getUnit, minWidth: 60 },
                { field: 'addressChi.floor', displayName: '楼层', enableSorting: true, cellTemplate: getFloor, minWidth: 60 },
                { field: 'addressChi.room', displayName: '房间号', enableSorting: true, cellTemplate: getRoom, minWidth: 60 },
                { field: 'addressChi.addons', displayName: '附加信息', enableSorting: true, cellTemplate: getAddons, visible: true, minWidth: 100 }
            ],
            addrPinyin: [
                { field: 'classifyRules', displayName: '作业类型', enableSorting: true, cellTemplate: formatClassifyRules, visible: true, minWidth: 110 },
                { field: 'kindName', displayName: '分类', enableSorting: true, visible: true, minWidth: 100 },
                // { field: 'name11Chi.name', displayName: '官方标准中文名称', enableSorting: true, cellTemplate: get11Name, visible: true, minWidth: 160 }, // bug改善
                { field: 'addressChi.roadnameStr', displayName: '中文地址合并', enableSorting: true, cellTemplate: $scope.formatCombineName, visible: true, minWidth: 300 },
                { field: 'addressChi.roadnamePhoneticStr', displayName: '拼音地址合并', cellTemplate: $scope.formatCombinePinyin, visible: true, minWidth: 300 },
                { field: 'refMsg', displayName: '参考信息', cellTemplate: formatRefMsg, minWidth: 180 }
            ],
            // 后公共列
            lastCols: [
                { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, minWidth: 160 },
                { field: 'details', displayName: '详情', enableSorting: false, cellTemplate: getDetails, minWidth: 50 }
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
            // angular.forEach($scope.editGridOptions.data, function (data, index) {
            //     data.num_index = index + 1;
            // });
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

        // 保存前的特殊处理
        var specialProcess = function () {
            var i;
            if ($scope.main.workType === 'addrPinyin') { // 对地址拼音的特殊处理
                for (i = 0; i < $scope.currentEdited.length; i++) {
                    var temp = $scope.currentEdited[i].addressChi;
                    if (temp.addrnamePhoneticStr) {
                        var addr = temp.addrnamePhoneticStr.split('|');  // 和服务约定的顺序，前端必须使用这样的顺序 LANDMARK、PREFIX、HOUSENUM、TYPE、SUBNUM、SURFIX、ESTAB、BUILDING、UNIT、FLOOR、ROOM、ADDONS
                        temp.landmarkPhonetic = addr[0];
                        temp.prefixPhonetic = addr[1];
                        temp.housenumPhonetic = addr[2];
                        temp.typePhonetic = addr[3];
                        temp.subnumPhonetic = addr[4];
                        temp.surfixPhonetic = addr[5];
                        temp.estabPhonetic = addr[6];
                        temp.buildingPhonetic = addr[7];
                        temp.unitPhonetic = addr[8];
                        temp.floorPhonetic = addr[9];
                        temp.roomPhonetic = addr[10];
                        temp.addonsPhonetic = addr[11];
                    }
                    if (temp.roadnamePhoneticStr) {
                        var road = temp.roadnamePhoneticStr.split('|');  // 和服务约定的顺序，前端必须使用这样的顺序 PROVINCE、CITY、COUNTY、TOWN、PLACE、STREET
                        temp.provPhonetic = road[0];
                        temp.cityPhonetic = road[1];
                        temp.countyPhonetic = road[2];
                        temp.townPhonetic = road[3];
                        temp.placePhonetic = road[4];
                        temp.streetPhonetic = road[5];
                    }
                }
            }

            for (i = 0; i < $scope.currentEdited.length; i++) {
                $scope.currentEdited[i]._chiAddressToDBC(); // 中文地址转全角
            }
            // 过滤18个字段中的 |｜
            var addArr = ['province', 'city', 'county', 'town', 'place', 'street', 'landmark', 'prefix', 'housenum', 'type', 'subnum', 'surfix', 'estab', 'building', 'floor', 'unit', 'room', 'addons'];
            for (var j = 0; j < $scope.currentEdited.length; j++) {
                for (var z = 0; z < addArr.length; z++) {
                    if ($scope.currentEdited[j].addressChi[addArr[z]]) {
                        $scope.currentEdited[j].addressChi[addArr[z]] = $scope.currentEdited[j].addressChi[addArr[z]].replace(/[\\|\\｜]/g, '');
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

            var dataList = $scope.main.combiSaveParam(allChangeData);
            return dataList;
        };

        $scope.doSave = function () {
            if (errors.length > 0) {
                swal('提示', '文本长度不能超过64个字符,请修改后提交。', 'info');
                return;
            }

            specialProcess();
            var dataList = getListchanges();

            var param = {
                firstWorkItem: 'poi_address',
                secondWorkItem: $scope.main.selectedItem.id,
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
            if ($scope.searchObject.searchType) {
                var name = currentData.addressChi[$scope.searchObject.searchType]; // 18个字段
                if (searchText) {
                    if ((name && name.indexOf(searchTextDbc) > -1) || (name && name.indexOf(searchTextCbd) > -1)) {
                        var finalyValue = name.split(searchTextDbc).join(replaceVal);
                        if (finalyValue == name) {
                            finalyValue = name.split(searchTextCbd).join(replaceVal);
                        }
                        currentData.addressChi[$scope.searchObject.searchType] = finalyValue;
                    }
                } else {
                    if (!name) {
                        currentData.addressChi[$scope.searchObject.searchType] = replaceVal;
                    }
                }
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
                if ($scope.searchObject.searchType) {
                    var name = temp.addressChi[$scope.searchObject.searchType]; // 18个字段
                    if (searchText) {
                        if ((name && name.indexOf(searchTextDbc) > -1) || (name && name.indexOf(searchTextCbd) > -1)) {
                            count += 1;
                            var finalyValue = name.split(searchTextDbc).join(replaceVal);
                            if (finalyValue == name) {
                                finalyValue = name.split(searchTextCbd).join(replaceVal);
                            }
                            temp.addressChi[$scope.searchObject.searchType] = finalyValue;
                        }
                    } else {
                        if (!name) {
                            count += 1;
                            temp.addressChi[$scope.searchObject.searchType] = replaceVal;
                        }
                    }
                }
            }
            swal('提示', '全部替换完成，共进行了' + count + '处替换!', 'info');
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
                                $scope.currentEdited[currentReplaceIndex].addressChi[attr] = row.entity.addressChi[attr];
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

