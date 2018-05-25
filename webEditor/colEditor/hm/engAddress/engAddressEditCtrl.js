/**
 * Created by mali on 2018/1/8.
 */

angular.module('app').controller('hmEngAddressEditCtrl', ['$scope', 'NgTableParams', 'ngTableEventsChannel', '$sce', 'dsColumn', 'ngDialog', 'dsLazyload', 'appPath', 'hotkeys',
    function ($scope, NgTableParams, ngTableEventsChannel, $sce, dsColumn, ngDialog, dsLazyload, appPath, hotkeys) {
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
       * templateClassicyRules
       * @return {String} <div><div/>
       */
        function templateClassicyRules() {
            var html = '<div ng-bind-html="grid.appScope.getClassifyRules(row.entity)"></div>';
            return html;
        }
      /**
       *templateFullname
       * @return {String} <div><div/>
       */
        function templateFullname() {
            var html = '<div>{{row.entity.addressCht.fullname}}</div>';
            return html;
        }
      /**
       * templateAddressChtCombine
       * @return {String} <div><div/>
       */
        function templateAddressChtCombine() {
            var html = '<div ng-bind-html="grid.appScope.getAddressChtCombine(row.entity)"></div>';
            return html;
        }

        $scope.getAddressChtCombine = function (row) {
            var roadName = row.addressCht.roadnameStr;
            var addrName = row.addressCht.addrnameStr;
            if (roadName) {
                var arr = roadName.split('|');
                arr.splice(0, 3);
                roadName = arr.join('|'); // 英文地址不显示前三位 ，此处不用做非空的判断正常数肯定符合条件
            }
            var combine = '';
            if (roadName && addrName) {
                combine = roadName + addrName;
            } else if (roadName) {
                combine = roadName;
            } else if (addrName) {
                combine = addrName;
            }
            return combine;
        };
      /**
       * templateEngFullname
       * @return {String} <div><div/>
       */
        function templateEngFullname() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' value='{{row.entity.addressEng.fullname}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"fullname\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.addressEng.fullname' /></div>";
            return html;
        }
      /**
       * templateEngFullnameLength
       * @return {String} <div><div/>
       */
        function templateEngFullnameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getEngFullnameLength(row.entity)'></div>";
            return html;
        }

        $scope.getEngFullnameLength = function (row) {
            var len = 0;
            var html = '';
            if (row.addressEng && row.addressEng.fullname) {
                len = row.addressEng.fullname.length;
            }
            if (len > 50) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };
        /**
         * templateAddPorFullname
         * @return {String} <div><div/>
         */
        function templateAddPorFullname() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' value='{{row.entity.addressPor.fullname}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"fullname\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.addressPor.fullname' /></div>";
            return html;
        }
        /**
         * templatePorFullnameLength
         * @return {String} <div><div/>
         */
        function templatePorFullnameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getPorFullnameLength(row.entity)'></div>";
            return html;
        }

        $scope.getPorFullnameLength = function (row) {
            var len = 0;
            var html = '';
            if (row.addressPor && row.addressPor.fullname) {
                len = row.addressPor.fullname.length;
            }
            if (len > 50) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };

      /**
       * templateEngShortName
       * @return {String} <div><div/>
       */
        function templateEngShortName() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' value='{{row.entity.addressEng.shortname}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"shortname\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.addressEng.shortname' /></div>";
            return html;
        }
      /**
       *templateEngShortNameLength
       * @return {String} <div><div/>
       */
        function templateEngShortNameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getEngShortLength(row.entity)'></div>";
            return html;
        }
        $scope.getEngShortLength = function (row) {
            var len = 0;
            var html = '';
            if (row.addressEng && row.addressEng.shortname) {
                len = row.addressEng.shortname.length;
            }
            if (len > 50) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };
        /**
         * templatePorShortName
         * @return {String} <div><div/>
         */
        function templatePorShortName() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' value='{{row.entity.address.shortname}}' ng-focus='grid.appScope.autoCopyValue(1, row,\"shortname\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.addressPor.shortname' /></div>";
            return html;
        }
        /**
         * templatePorShortNameLength
         * @return {String} <div><div/>
         */
        function templatePorShortNameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getPorShortLength(row.entity)'></div>";
            return html;
        }
        $scope.getPorShortLength = function (row) {
            var len = 0;
            var html = '';
            if (row.addressPor && row.addressPor.shortname) {
                len = row.addressPor.shortname.length;
            }
            if (len > 50) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };

      /**
       * templateNameList
       * @return {String} <div><div/>
       */
        function templateNameList() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.getNameList(row.entity)'></div>";
            return html;
        }

        $scope.getNameList = function (row) {
            var html = '';
            for (var i = 0; i < row.addressList.length; i++) {
                var temp = row.addressList[i];
                html += i + 1 + ".英文中包含'" + temp.split('&')[0] + "',对应简化为'" + temp.split('&')[1] + "';<br>";
            }
            return html;
        };
      /**
       * formatCkRules
       * @return {String} <div><div/>
       */
        function formatCkRules() { // 1 不可忽略 2可忽略
            var html = '<div ng-if="row.entity.ckRules.length>0" ng-repeat="item in row.entity.ckRules">' +
                '<div>{{$index + 1 + ".[" + item.ruleId + "]" + item.log}}' +
                '<button ng-if="item.level==2" class="btn btn-primary btn-xs" ng-disabled="item.disabled" ng-click="grid.appScope.doIgnorError(item.md5Code,$event,item)">忽略</button>' +
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
       * getDetails
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
                poiNum: row.poiNum,
                fullname: row.addressEng ? row.addressEng.origin.fullname : '',
                pinyin: row.addressCht.fullnamePhonetic
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

        var conbineCols = function () {
            // 配置显示的列
            var engNameCols = {
                // 前公共列
                primaryCols: [
                    { field: 'num_index', displayName: '序号', visible: true, minWidth: 50, maxWidth: 60, cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' },
                    { field: 'classifyRules', displayName: '作业类型', enableSorting: true, cellTemplate: templateClassicyRules, minWidth: 170, width: 170 },
                    { field: 'addressCht.fullname', displayName: '地址全称', enableSorting: true, cellTemplate: templateFullname, minWidth: 180 }
                ],
                // 英文地址非法字符 addressCht.fullname
                engAddrInvalidChar: [
                    { field: 'addressCht.name', displayName: '中文地址合并', enableSorting: true, cellTemplate: templateAddressChtCombine, width: 180 },
                    { field: 'addressEng.fullname', displayName: '英文地址全称', enableSorting: true, cellTemplate: templateEngFullname, minWidth: 180 },
                    { field: 'addressEng.fullname', displayName: '字符数1', enableSorting: true, cellTemplate: templateEngFullnameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'addressEng.shortname', displayName: '英文地址简称', enableSorting: true, cellTemplate: templateEngShortName, minWidth: 120, width: 120 },
                    { field: 'addressEng', displayName: '字符数2', enableSorting: false, cellTemplate: templateEngShortNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'addressList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 130 }
                ],
                // 葡文地址非法字符
                portuAddrInvalidChar: [
                    { field: 'addressCht', displayName: '中文地址合并', enableSorting: true, cellTemplate: templateAddressChtCombine, width: 180 },
                    { field: 'addressPor.fullname', displayName: '葡文地址全称', enableSorting: true, cellTemplate: templateAddPorFullname, minWidth: 180 },
                    { field: 'addressPor.fullname', displayName: '字符数1', enableSorting: false, cellTemplate: templatePorFullnameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'addressPor.shortname', displayName: '葡文地址简称', enableSorting: true, cellTemplate: templatePorShortName, minWidth: 180 },
                    { field: 'addressPor', displayName: '字符数2', enableSorting: false, cellTemplate: templatePorShortNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'addressList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 130 }
                ],
                // 英文地址超长作业
                longEngAddress: [
                    { field: 'addressCht', displayName: '中文地址合并', enableSorting: true, cellTemplate: templateAddressChtCombine, width: 180 },
                    { field: 'addressEng.fullname', displayName: '英文地址全称', enableSorting: true, cellTemplate: templateEngFullname, minWidth: 180 },
                    { field: 'addressEng.fullname', displayName: '字符数1', enableSorting: false, cellTemplate: templateEngFullnameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'addressEng.shortname', displayName: '英文地址简称', enableSorting: true, cellTemplate: templateEngShortName, minWidth: 180 },
                    { field: 'addressEng', displayName: '字符数2', enableSorting: false, cellTemplate: templateEngShortNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'addressList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 130 }
                ],
                // 葡文地址超长作业
                longPortuAddress: [
                    { field: 'addressCht', displayName: '中文地址合并', enableSorting: true, cellTemplate: templateAddressChtCombine, width: 180 },
                    { field: 'addressPor.fullname', displayName: '葡文地址全称', enableSorting: true, cellTemplate: templateAddPorFullname, minWidth: 180 },
                    { field: 'addressPor.fullname', displayName: '字符数1', enableSorting: false, cellTemplate: templatePorFullnameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'addressPor.shortname', displayName: '葡文地址简称', enableSorting: true, cellTemplate: templatePorShortName, minWidth: 180 },
                    { field: 'addressPor', displayName: '字符数2', enableSorting: false, cellTemplate: templatePorShortNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'addressList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 130 }
                ],
                // 后公共列
                lastCols: [
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, minWidth: 140, maxWidth: 240 },
                    { field: 'details', displayName: '详情', cellTemplate: getDetails, enableSorting: false, width: 60, maxWidth: 80 }
                ]
            };
            var cols = [];
            cols = cols.concat(engNameCols.primaryCols);
            if (engNameCols[$scope.main.workType] && engNameCols[$scope.main.workType].length > 0) {
                cols = cols.concat(engNameCols[$scope.main.workType]);
            }
            return cols.concat(engNameCols.lastCols);
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
        /**
         * 获取改变的属性，并根据接口需要的格式进行组装
         * @return {Array} dataList
         */
        var getListchanges = function () {
            var allChangeData = {};
            allChangeData.dataList = [];

            for (var i = 0; i < $scope.currentEdited.length; i++) {
                $scope.currentEdited[i]._engAddressToCDB(); // 英文地址全角转半角
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
            // 如果有简称需要将简称保存到fullname字段
            if ($scope.main.selectedItem.id === 'engAddrInvalidChar' || $scope.main.selectedItem.id === 'longEngAddress') {
                for (var i = 0; i < $scope.currentEdited.length; i++) {
                    var eng = $scope.currentEdited[i].addressEng;
                    if (eng.shortname || eng.shortname === '') {
                        eng.fullname = eng.shortname;
                    }
                }
            }
            // 如果有简称需要将简称保存到fullname字段
            if ($scope.main.selectedItem.id === 'portuAddrInvalidChar' || $scope.main.selectedItem.id === 'longPortuAddress') {
                for (var j = 0; j < $scope.currentEdited.length; j++) {
                    var por = $scope.currentEdited[j].addressPor;
                    if (por.shortname || por.shortname === '') {
                        por.fullname = por.shortname;
                    }
                }
            }
            var dataList = getListchanges();
            var param = {
                firstWorkItem: 'poi_englishaddress',
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
            if (attr === 'shortname') {
                $('.engAddressTable .ui-grid-row:eq(' + currentReplaceIndex + ') .ui-grid-cell:eq(6) input').focus();
            } else {
                $('.engAddressTable .ui-grid-row:eq(' + currentReplaceIndex + ') .ui-grid-cell:eq(4) input').focus();
            }
        };

        $scope.batchEdit = function () {
            $scope.batchEditDialog = true;
            currentReplaceIndex = 0;
            $scope.searchObject.searchText = '';
            $scope.searchObject.replaceText = '';
            $scope.isCollectData = false;
            setFocusByIndex($scope.searchObject.searchType);
        };

        // 下一行
        $scope.nextLine = function () {
            if ($scope.currentEdited.length > currentReplaceIndex + 1) {
                currentReplaceIndex++;
            } else {
                currentReplaceIndex = 0;
            }
            setFocusByIndex($scope.searchObject.searchType);
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
            var nameObj = {};
            if ($scope.searchObject.searchType === 'engaddrfullname') {
                nameObj = currentData.addressEng; // 英文地址全称
            } else if ($scope.searchObject.searchType === 'poraddrfullname') {
                nameObj = currentData.addressPor; // 葡文地址全称
            }
            var name = nameObj.fullname;
            if (searchText) {
                if ((name && name.indexOf(searchTextDbc) > -1) || (name && name.indexOf(searchTextCbd) > -1)) {
                    var finalyValue = name.split(searchTextDbc).join(replaceVal);
                    if (finalyValue == name) {
                        finalyValue = name.split(searchTextCbd).join(replaceVal);
                    }
                    nameObj.fullname = finalyValue;
                }
            } else {
                if (!name) {
                    nameObj.fullname = replaceVal;
                }
            }

            setFocusByIndex($scope.searchObject.searchType);
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
                var nameObj = {};
                if ($scope.searchObject.searchType === 'engaddrfullname') {
                    nameObj = temp.addressEng; // 英文地址全称
                }
                var name = nameObj.fullname;
                if (searchText) {
                    if ((name && name.indexOf(searchTextDbc) > -1) || (name && name.indexOf(searchTextCbd) > -1)) {
                        count += 1;
                        var finalyValue = name.split(searchTextDbc).join(replaceVal);
                        if (finalyValue == name) {
                            finalyValue = name.split(searchTextCbd).join(replaceVal);
                        }
                        nameObj.fullname = finalyValue;
                    }
                } else {
                    if (!name) {
                        nameObj.fullname = replaceVal;
                        count += 1;
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
                                    $scope.currentEdited[currentReplaceIndex].addressEng[attr] = row.entity.addressEng[attr];
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

