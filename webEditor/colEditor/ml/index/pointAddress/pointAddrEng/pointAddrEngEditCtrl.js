/**
 * 精编点门牌英文作业CTR
 */

angular.module('app').controller('engAddressEditCtrl', ['$scope', 'NgTableParams', 'ngTableEventsChannel', '$sce', 'dsColumn', 'ngDialog', 'dsLazyload', 'appPath', 'hotkeys',
    function ($scope, NgTableParams, ngTableEventsChannel, $sce, dsColumn, ngDialog, dsLazyload, appPath, hotkeys) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var height = document.documentElement.clientHeight;
        $scope.panelBodyHight = {
            height: (height - 105) + 'px'
        };
        $scope.tableBodyHeight = {
            height: (height - 146) + 'px'
        };

        /**
         * 格式化地址门牌号
         * @return {String} <div><div/>
         */
        function templateAddrname() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' value='{{row.entity.nameEng.addrname}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"addrname\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.nameEng.addrname' /></div>";
            return html;
        }

        /**
         * 格式化地址门牌号
         * @return {String} <div><div/>
         */
        function templateRoadname() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' ng-disabled='row.entity.type==3' maxlength='500' value='{{row.entity.nameEng.roadname}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"roadname\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.nameEng.roadname' /></div>";
            return html;
        }

        /**
         * 地址门牌号长度
         * @return {String} <div><div/>
         */
        function templateAddrnameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getLength(row.entity,\"addrname\", 25)'></div>";
            return html;
        }

        /**
         * 格式化 附属设施名
         * @return {String} <div><div/>
         */
        function templateEstab() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' value='{{row.entity.nameEng.estab}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"estab\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.nameEng.estab' /></div>";
            return html;
        }

        /**
         * 附属设施名
         * @return {String} <div><div/>
         */
        function templateEstabLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getLength(row.entity,\"estab\", 35)'></div>";
            return html;
        }

        /**
         * 格式化 楼栋号
         * @return {String} <div><div/>
         */
        function templateBuilding() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' value='{{row.entity.nameEng.building}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"building\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.nameEng.building' /></div>";
            return html;
        }

        /**
         * 楼栋号
         * @return {String} <div><div/>
         */
        function templateBuildingLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getLength(row.entity,\"building\", 35)'></div>";
            return html;
        }

        /**
         * 格式化 楼门号
         * @return {String} <div><div/>
         */
        function templateUnit() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' value='{{row.entity.nameEng.unit}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"unit\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.nameEng.unit' /></div>";
            return html;
        }

        /**
         * 楼门号长度
         * @return {String} <div><div/>
         */
        function templateUnitLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getLength(row.entity,\"unit\", 25)'></div>";
            return html;
        }

        $scope.getLength = function (row, key, length) {
            var len = 0;
            var html = '';
            if (row.nameEng && row.nameEng[key]) {
                len = row.nameEng[key].length;
            }
            if (len > length) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };

        $scope.getNameList = function (row) {
            var html = '';
            for (var i = 0; i < row.addressList.length; i++) {
                var temp = row.addressList[i];
                html += i + 1 + ".英文中包含'" + temp.split('&')[0] + "',对应简化为'" + temp.split('&')[1] + "';<br>";
            }
            return html;
        };
        /**
         * 格式化检查结果
         * @return {String} <div><div/>
         */
        function formatCkRules() { // 1 不可忽略 2可忽略
            var html = '<div ng-if="row.entity.ckRules.length>0" ng-repeat="item in row.entity.ckRules">' +
                '<div>{{$index + 1 + ".[" + item.ruleId + "]" + item.log}}' +
                '<button class="btn btn-primary btn-xs" ng-disabled="item.disabled" ng-click="grid.appScope.doIgnorError(item.md5Code,$event,item)">忽略</button>' +
                '</div></div>' +
                '<div ng-if="row.entity.ckRules.length<=0">无</div>';
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
         * 格式化参考信息
         * @return {String} <div><div/>
         */
        function templateNameList() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getNameList(row.entity)'></div>";
            return html;
        }

        $scope.getNameList = function (row) {
            var html = '';
            for (var i = 0; i < row.nameList.length; i++) {
                var temp = row.nameList[i];
                html += i + 1 + ".英文中包含'" + temp.split('&')[0] + "',对应简化为'" + temp.split('&')[1] + "';<br>";
            }
            return html;
        };

        /**
         * 获取门牌地址号 规则是 前缀+门牌+类型+子号+后缀 拼接起来
         * @param {Object} row 行数据
         * @return {undefined} div
         */
        $scope.getPointText = function (row) {
            var nameChi = row.nameChi;
            return '<div>' + nameChi.prefix + '+' + nameChi.housenum + '+' + nameChi.type + '+' + nameChi.subnum + '+' + nameChi.surfix + '</div>';
        };

        var conbineCols = function () {
            // 配置显示的列
            var engNameCols = {
                // 前公共列
                primaryCols: [
                    { field: 'num_index', displayName: '序号', visible: true, minWidth: 50, maxWidth: 60, cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' }
                ],
                // 点门牌英文作业
                pointEngAddr: [
                    { field: 'nameChi.nameId', displayName: '名称号码', enableSorting: true, visible: true, minWidth: 100, maxWidth: 140 },
                    { field: 'nameChi.roadname', displayName: '地址道路名', enableSorting: true, visible: true, minWidth: 100 },
                    { field: 'nameEng.roadnameEng', displayName: '地址道路名-英文', cellTemplate: templateRoadname, minWidth: 120 },
                    { field: 'nameChi.addrname', displayName: '地址门牌号', enableSorting: true, visible: true, minWidth: 100 },
                    { field: 'nameEng.addrnameEng', displayName: '地址门牌号-英文', cellTemplate: templateAddrname, minWidth: 120 },
                    { field: 'nameEng.addrnameLength', displayName: '字符数', cellTemplate: templateAddrnameLength, width: 64, maxWidth: 70 },
                    { field: 'nameChi.estab', displayName: '附属设施名', minWidth: 120 },
                    { field: 'nameEng.estabEng', displayName: '附属设施名-英文', cellTemplate: templateEstab, minWidth: 120 },
                    { field: 'nameEng.estabLength', displayName: '字符数', cellTemplate: templateEstabLength, width: 64, maxWidth: 70 },
                    { field: 'nameChi.building', displayName: '楼栋号', minWidth: 120 },
                    { field: 'nameEng.buildingEng', displayName: '楼栋号-英文', cellTemplate: templateBuilding, minWidth: 120 },
                    { field: 'nameEng.buildingLength', displayName: '字符数', cellTemplate: templateBuildingLength, width: 64, maxWidth: 70 },
                    { field: 'nameChi.unit', displayName: '楼门号', minWidth: 120 },
                    { field: 'nameEng.unitEng', displayName: '楼门号-英文', cellTemplate: templateUnit, minWidth: 120 },
                    { field: 'nameEng.unitLength', displayName: '字符数', cellTemplate: templateUnitLength, width: 64, maxWidth: 70 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 }
                ],
                // 后公共列
                lastCols: [
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, minWidth: 140, maxWidth: 240 }
                ]
            };
            var cols = [];
            cols = cols.concat(engNameCols.primaryCols);
            cols = cols.concat(engNameCols.pointEngAddr);
            return cols.concat(engNameCols.lastCols);
        };

        /**
         * 获取表格数据
         * @return {undefined}
         */
        function getData() {
            // 如果没有英文名称则前端进行新增
            for (var i = 0; i < $scope.currentEdited.length; i++) {
                var temp = $scope.currentEdited[i];
                if (temp.nameEng && Utils.isEmptyObject(temp.nameEng)) {
                    var pid = temp.pid;
                    temp.nameEng = new FM.dataApi.ColPointAddressName({
                        pid: pid,
                        langCode: 'ENG',
                        nameGroupid: temp.nameChi.nameGroupid
                    });
                }
            }

            $scope.editGridOptions.totalItems = $scope.currentEdited.length;
            $scope.editGridOptions.data = $scope.currentEdited;
        }
        /**
         * 初始化表格
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

        $scope.doSave = function () {
            for (var i = 0; i < $scope.currentEdited.length; i++) {
                $scope.currentEdited[i]._pointNameToCDB(); // 英文全角转半角
            }
            var change = objCtrl.compareColumData($scope.currentEditOrig, $scope.currentEdited);
            var dataList = $scope.main.combiSaveParam(change);
            var param = {
                firstWorkItem: 'pointAddr_engAddr',
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

        var currentReplaceIndex = 0; // 当前替换的行数

        // 设置光标显示的位置
        var setFocusByIndex = function (attr) {
            if (attr === 'shortname') {
                $('.engAddressTable .ui-grid-row:eq(' + currentReplaceIndex + ') .ui-grid-cell:eq(6) input').focus();
            } else {
                $('.engAddressTable .ui-grid-row:eq(' + currentReplaceIndex + ') .ui-grid-cell:eq(4) input').focus();
            }
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
                                    $scope.currentEdited[currentReplaceIndex].nameEng[attr] = row.entity.nameEng[attr];
                                    setFocusByIndex(attr);
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
        
        /**
         * 创建页面
         * @return {undefined}
         */
        function initPage() {
            initTable();
            currentReplaceIndex = 0;
        }
        // 页面初始化
        initPage();
    }]);

