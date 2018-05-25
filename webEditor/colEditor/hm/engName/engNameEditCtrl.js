/**
 * Created by mali on 2018/1/8.
 */

angular.module('app').controller('hmEngNameEditCtrl', ['$scope', 'NgTableParams', 'ngTableEventsChannel', '$sce', 'dsColumn', 'ngDialog', 'dsLazyload', 'appPath', '$compile', 'hotkeys',
    function ($scope, NgTableParams, ngTableEventsChannel, $sce, dsColumn, ngDialog, dsLazyload, appPath, $compile, hotkeys) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var height = document.documentElement.clientHeight;
        $scope.panelBodyHight = {
            height: (height - 105) + 'px',
            overflow: 'auto'
        };
        $scope.tableBodyHeight = {
            height: (height - 146) + 'px'
        };
        $scope.popViewFlag = false;
        $scope.searchObject.searchType = $scope.replaceList[0].id;
        $scope.batchEditDialog = $scope.isCollectData;
        $scope.closePop = function () {
            $scope.popViewFlag = false;
        };
        // 来源标示
        $scope.srcNameEng = [
            { name: '无', id: 0 },
            { name: '采集', id: 1 },
            { name: '官方网站搜集', id: 2 },
            { name: '非官方网站搜集', id: 3 },
            { name: '基于网站搜集', id: 4 },
            { name: '品牌名/分类名+分店名翻译', id: 5 },
            { name: '关键词翻译程序+人工确认', id: 6 },
            { name: '各项目代理店', id: 7 },
            { name: '已训练关键词翻译程序', id: 8 },
            { name: '未训练关键词翻译程序', id: 9 }
        ];
      /**
       * template11ChtName
       * @return {String} <div><div/>
       */
        function template11ChtName() {
            return '<div>{{row.entity.name11Cht.name}}</div>';
        }
        /**
         * template11PorName
         * @return {String} <div><div/>
         */
        function template11PorName() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='200' ng-focus='grid.appScope.autoCopyValue(1, row,\"name11Por\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.name11Por.name' /></div>";
            return html;
        }
      /**
       * template11EngName
       * @return {String} <div><div/>
       */
        function template11EngName() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='200' ng-focus='grid.appScope.autoCopyValue(1, row,\"name11Eng\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.name11Eng.name' /></div>";
            return html;
        }
      /**
       * template12EngName
       * @return {String} <div><div/>
       */
        function template12EngName() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' ng-focus='grid.appScope.autoCopyValue(1, row,\"name12Eng\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.name12Eng.name'/></div>";
            return html;
        }
        /**
         * template12PorName 原始葡文名称
         * @return {String} <div><div/>
         */
        function template12PorName() {
            var html = "<div class='ui-grid-cell-contents'><input type='text' maxlength='500' ng-focus='grid.appScope.autoCopyValue(1, row,\"name12Por\")' ng-blur='grid.appScope.autoCopyValue(0)' ng-model='row.entity.name12Por.name'/></div>";
            return html;
        }
      /**
       * get12EngName
       * @return {String} <div><div/>
       */
        function get12EngName() {
            return '<div>{{row.entity.name12Eng.name}}</div>';
        }

        /**
         * get12PorName
         * @returns {string} <div><div/>
         */
        function get12PorName() {
            return '<div>{{row.entity.name12Por.name}}</div>';
        }
      /**
       * template11EngNameLength
       * @return {String} <div><div/>
       */
        function template11EngNameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.get11EngNameLength(row.entity)'></div>";
            return html;
        }
        $scope.get11EngNameLength = function (row) {
            var len = 0;
            var html = '';
            if (row.name11Eng && row.name11Eng.name) {
                len = row.name11Eng.name.length;
            }
            if (len > 35) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };
        /**
         * template11PorNameLength
         * @return {String} <div><div/>
         */
        function template11PorNameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.get11PorNameLength(row.entity)'></div>";
            return html;
        }
        $scope.get11PorNameLength = function (row) {
            var len = 0;
            var html = '';
            if (row.name11Por && row.name11Por.name) {
                len = row.name11Por.name.length;
            }
            if (len > 35) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };

      /**
       * template12EngNameLength
       * @return {String} <div><div/>
       */
        function template12EngNameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.get12EngNameLength(row.entity)'></div>";
            return html;
        }
        $scope.get12EngNameLength = function (row) {
            var len = 0;
            var html = '';
            if (row.name12Eng && row.name12Eng.name) {
                len = row.name12Eng.name.length;
            }
            if (len > 35) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };
        /**
         * template12PorNameLength 原始葡文名称长度
         * @return {String} <div><div/>
         */
        function template12PorNameLength() {
            var html = "<div class='ui-grid-cell-contents' ng-bind-html='grid.appScope.get12PorNameLength(row.entity)'></div>";
            return html;
        }
        $scope.get12PorNameLength = function (row) {
            var len = 0;
            var html = '';
            if (row.name12Por && row.name12Por.name) {
                len = row.name12Por.name.length;
            }
            if (len > 35) {
                html = '<span class="redWord">' + len + '</span>';
            } else {
                html = '<span>' + len + '</span>';
            }
            return html;
        };
        /**
         * templatePorSourceFlag
         * @return {String} <div><div/>
         */
        function templatePorSourceFlag() {
            var html = "<div class='ui-grid-cell-contents'><select ng-model='row.entity.flagMethods[0].srcNamePor' ng-options='value.id as value.name for value in grid.appScope.srcNameEng'></select></div>";
            return html;
        }
      /**
       * template12SourceFlag
       * @return {String} <div><div/>
       */
        function template12SourceFlag() {
            var html = "<div class='ui-grid-cell-contents'><select ng-model='row.entity.flagMethods[0].srcNameEng' ng-options='value.id as value.name for value in grid.appScope.srcNameEng'></select></div>";
            return html;
        }
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
            for (var i = 0; i < row.nameList.length; i++) {
                var temp = row.nameList[i];
                html += i + 1 + ".英文中包含'" + temp.split('&')[0] + "',对应简化为'" + temp.split('&')[1] + "';<br>";
            }
            return html;
        };
      /**
       * getDetails
       * @return {String} <a><a/>
       */
        function getDetails() {
            return '<a class="cursor-point" style="color: #636ef5" ng-click="grid.appScope.showDetail(row.entity);">详情</a>';
        }
      /**
       * templateClassifyRules
       * @return {String} <div><div/>
       */
        function templateClassifyRules() {
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
       * templatePhotos
       * @return {String} <div><div/>
       */
        function templatePhotos() {
            var html = '<div ng-if="row.entity.photos.length>0"><a class="cursor-point" style="color: #636ef5" ng-click="grid.appScope.showPhotoBefore(row.entity.photos)">查看</a></div>' +
                '<div ng-if="!row.entity.photos||row.entity.photos.length<=0">无</div>';
            return html;
        }
        var photoDialog;
        $scope.showDetail = function (row) {
            if (photoDialog) {
                photoDialog.close();
            }
            $scope.viewOjbect = {
                pid: row.pid,
                whole: row.whole,
                worker: row.userName,
                meshId: row.meshId,
                poiNum: row.poiNum,
                brandName: row.brandName,
                kindName: row.kindName,
                name12Eng: row.newOriginalEngName,
                pinyin: (row.name11Cht && row.name11Cht.namePhonetic) ? row.name11Cht.namePhonetic : ''
            };
            if (['photoEngName'].indexOf($scope.main.workType) > -1) {
                $scope.viewOjbect.oldOriginalEngNameFlag = true;
                $scope.viewOjbect.oldOriginalEngName = row.oldOriginalEngName;
            }
            if (['chiEngName', 'confirmEngName', 'nonImportantLongEngName'].indexOf($scope.main.workType) > -1) {
                $scope.viewOjbect.oldOriginalEngNameFlag = true;
                $scope.viewOjbect.oldOriginalEngName = row.oldOriginalEngName;
                $scope.viewOjbect.showPhoto = true;
                $scope.viewOjbect.photos = row.photos;
            }
            if ($scope.main.workType === 'officalStandardEngName') {
                $scope.viewOjbect.oldStandardEngNameFlag = true;
                $scope.viewOjbect.oldStandardEngName = row.oldStandardEngName;
                $scope.viewOjbect.showPhoto = true;
                $scope.viewOjbect.photos = row.photos;
            }
            $scope.popViewFlag = true;
            $scope.imageModal = false;
        };

        $scope.showPhotoBefore = function (photos) {
            $scope.viewOjbect = {
                photos: photos
            };
            $scope.showPhoto(photos);
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
                    { field: 'classifyRules', displayName: '作业类型', enableSorting: true, cellTemplate: templateClassifyRules, minWidth: 160, width: 160 }
                ],
                // 照片录入英文名
                photoEngName: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: template12EngName },
                    { field: 'name12Eng.name', displayName: '字符数', enableSorting: false, cellTemplate: template12EngNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'sourceFlag', displayName: '来源标识', enableSorting: false, cellTemplate: template12SourceFlag, minWidth: 80, width: 110 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 },
                    { field: 'photos', displayName: '查看', enableSorting: true, cellTemplate: templatePhotos, minWidth: 80, width: 80, maxWidth: 80 }
                ],
                // 照片录入葡文名
                photoPorName: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Por.name', displayName: '原始葡文名称', enableSorting: true, cellTemplate: template12PorName },
                    { field: 'name12Por.name', displayName: '字符数', enableSorting: false, cellTemplate: template12PorNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'sourceFlag', displayName: '来源标识', enableSorting: false, cellTemplate: templatePorSourceFlag, minWidth: 80, width: 110 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 },
                    { field: 'photos', displayName: '查看', enableSorting: true, cellTemplate: templatePhotos, minWidth: 80, width: 80, maxWidth: 80 }
                ],
                // 中文即是英文
                chiEngName: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: template12EngName },
                    { field: 'name12EngLength', displayName: '字符数', enableSorting: false, cellTemplate: template12EngNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'sourceFlag', displayName: '来源标识', enableSorting: false, cellTemplate: template12SourceFlag, minWidth: 80, width: 110 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 }
                ],
                // 中文即是葡文
                chiPorName: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Por.name', displayName: '原始葡文名称', enableSorting: true, cellTemplate: template12PorName },
                    { field: 'name12PorLength', displayName: '字符数', enableSorting: false, cellTemplate: template12PorNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'sourceFlag', displayName: '来源标识', enableSorting: false, cellTemplate: templatePorSourceFlag, minWidth: 80, width: 110 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 }
                ],
                // 澳门英文名作业
                macaoEngName: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: template12EngName },
                    { field: 'name12EngLength', displayName: '字符数', enableSorting: false, cellTemplate: template12EngNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'sourceFlag', displayName: '来源标识', enableSorting: false, cellTemplate: template12SourceFlag, minWidth: 80, width: 110 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 }
                ],
                // 英文名非法字符
                engNameInvalidChar: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: template12EngName },
                    { field: 'name12EngLength', displayName: '字符数', enableSorting: false, cellTemplate: template12EngNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'sourceFlag', displayName: '来源标识', enableSorting: false, cellTemplate: template12SourceFlag, minWidth: 80, width: 110 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 }
                ],
                // 葡文名非法字符
                portuNameInvalidChar: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Por.name', displayName: '原始葡文名称', enableSorting: true, cellTemplate: template12PorName },
                    { field: 'name12PorLength', displayName: '字符数', enableSorting: false, cellTemplate: template12PorNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'sourceFlag', displayName: '来源标识', enableSorting: false, cellTemplate: templatePorSourceFlag, minWidth: 80, width: 110 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 }
                ],
                // 官方标准英文名
                officalStandardEngName: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Eng.name', displayName: '原始英文名称', enableSorting: true, cellTemplate: get12EngName },
                    { field: 'name11Eng.name', displayName: '官方标准英文名', enableSorting: true, cellTemplate: template11EngName },
                    { field: 'name11EngLength', displayName: '字符数', enableSorting: false, cellTemplate: template11EngNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 }
                ],
                // 官方标准葡文名
                officalStandardPortuName: [
                    { field: 'name11Cht.name', displayName: '官方标准中文名', enableSorting: true, cellTemplate: template11ChtName },
                    { field: 'name12Por.name', displayName: '原始葡文名称', enableSorting: true, cellTemplate: get12PorName },
                    { field: 'name11Por.name', displayName: '官方标准化葡文名称', enableSorting: true, cellTemplate: template11PorName },
                    { field: 'name11PorLength', displayName: '字符数', enableSorting: false, cellTemplate: template11PorNameLength, width: 70, minWidth: 70, maxWidth: 80 },
                    { field: 'nameList', displayName: '参考信息', enableSorting: true, cellTemplate: templateNameList, minWidth: 80, width: 150 }
                ],
                // 后公共列
                lastCols: [
                    { field: 'ckRules', displayName: '错误', cellTemplate: formatCkRules, width: 140, minWidth: 120, maxWidth: 240 },
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
       * getData 获取并准备表格数据
       * @return {undefined}
       */
        function getData() {
            var engOriginArr = ['photoEngName', 'chiEngName', 'engNameInvalidChar', 'macaoEngName'];
            var engStandard = ['officalStandardEngName'];
            var porOriginArr = ['photoPorName', 'chiPorName', 'portuNameInvalidChar'];
            var porStandard = ['officalStandardPortuName'];
            var workType = $scope.main.workType;
            var i,
                nameGroupId,
                temp;
            if (engOriginArr.indexOf(workType) > -1) {
                for (i = 0; i < $scope.currentEdited.length; i++) {
                    temp = $scope.currentEdited[i];
                    if (temp.name12Eng && Utils.isEmptyObject(temp.name12Eng)) {
                        nameGroupId = temp.name11Cht.nameGroupid;// 官方原始英文的namegroupId是根据官方标准中文来的
                        temp.name12Eng = new FM.dataApi.ColPoiName({ nameClass: 1, nameType: 2, langCode: 'ENG', poiPid: temp.pid, nameGroupid: nameGroupId });
                    }
                }
            } else if (engStandard.indexOf(workType) > -1) {
                for (i = 0; i < $scope.currentEdited.length; i++) {
                    temp = $scope.currentEdited[i];
                    if (temp.name11Eng && Utils.isEmptyObject(temp.name11Eng)) {
                        nameGroupId = temp.name11Cht.nameGroupid;// 官方标准英文的namegroupId是根据官方标准中文来的
                        temp.name11Eng = new FM.dataApi.ColPoiName({ nameClass: 1, nameType: 1, langCode: 'ENG', poiPid: temp.pid, nameGroupid: nameGroupId });
                    }
                }
            } else if (porStandard.indexOf(workType) > -1) {
                for (i = 0; i < $scope.currentEdited.length; i++) {
                    temp = $scope.currentEdited[i];
                    if (temp.name11Por && Utils.isEmptyObject(temp.name11Por)) {
                        nameGroupId = temp.name11Cht.nameGroupid;// 官方标准葡文的namegroupId是根据官方标准中文来的
                        temp.name11Por = new FM.dataApi.ColPoiName({ nameClass: 1, nameType: 1, langCode: 'POR', poiPid: temp.pid, nameGroupid: nameGroupId });
                    }
                }
            } else if (porOriginArr.indexOf(workType) > -1) {
                for (i = 0; i < $scope.currentEdited.length; i++) {
                    temp = $scope.currentEdited[i];
                    if (temp.name12Por && Utils.isEmptyObject(temp.name12Por)) {
                        nameGroupId = temp.name11Cht.nameGroupid;// 官方原始葡文的namegroupId是根据官方标准中文来的
                        temp.name12Por = new FM.dataApi.ColPoiName({ nameClass: 1, nameType: 2, langCode: 'POR', poiPid: temp.pid, nameGroupid: nameGroupId });
                    }
                }
            }

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
                $scope.currentEdited[i]._engNameToCDB(); // 中文名称全角转半角
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
        var save = function () {
            var dataList = getListchanges();
            var param = {
                firstWorkItem: 'poi_englishname',
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

        /**
         * 判断原始英文名和标准英文名的name属性是否为空
         * @param {Array} dataList 数据列表
         * @returns {{flag: boolean}} flag 是否存在为空
         */
        var nameIsEmpty = function (dataList) {
            var returnOjb = {
                flag: false
            };
            var i,
                len,
                nameObj;
            var engOriginArr = ['photoEngName', 'chiEngName', 'engNameInvalidChar'];
            var engStandard = ['officalStandardEngName'];
            var porOriginArr = ['photoPorName', 'chiPorName', 'macaoEngName', 'portuNameInvalidChar'];
            var porStandard = ['officalStandardPortuName'];
            var workType = $scope.main.workType;
            if (engOriginArr.indexOf(workType) > -1) { // 原始英文名
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name12Eng;
                    if (nameObj.name === '') {
                        returnOjb.flag = true;
                        break;
                    }
                }
            } else if (engStandard.indexOf(workType) > -1) { // 标准英文名
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name11Eng;
                    if (nameObj.name === '') {
                        returnOjb.flag = true;
                        break;
                    }
                }
            } else if (porOriginArr.indexOf(workType) > -1) { // 原始葡文
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name11Por;
                    if (nameObj.name === '') {
                        returnOjb.flag = true;
                        break;
                    }
                }
            } else if (porStandard.indexOf(workType) > -1) { // 标准葡文
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name12Por;
                    if (nameObj.name === '') {
                        returnOjb.flag = true;
                        break;
                    }
                }
            }
            return returnOjb;
        };
        /**
         * 删除name字段为空的数组对象
         * @param {Array} dataList 数据列表
         * @return {undefined}
         */
        var deleteEmptyName = function (dataList) {
            var i,
                len,
                nameObj;
            var engOriginArr = ['photoEngName', 'chiEngName', 'engNameInvalidChar'];
            var engStandard = ['officalStandardEngName'];
            var porOriginArr = ['photoPorName', 'chiPorName', 'macaoEngName', 'portuNameInvalidChar'];
            var porStandard = ['officalStandardPortuName'];
            var workType = $scope.main.workType;
            if (engOriginArr.indexOf(workType) > -1) {
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name12Eng;
                    if (nameObj.name === '') {
                        dataList[i].name12Eng = {};
                    }
                }
            } else if (engStandard.indexOf(workType) > -1) {
                for (i = 0, len = dataList.length; i < len; i++) {
                    nameObj = dataList[i].name11Eng;
                    if (dataList[i].name11Por.name === '') {
                        dataList[i].name11Por = {};
                    }
                }
            } else if (porOriginArr.indexOf(workType) > -1) {
                for (i = 0, len = dataList.length; i < len; i++) {
                    if (dataList[i].name11Por.name === '') {
                        dataList[i].name11Por = {};
                    }
                }
            } else if (porStandard.indexOf(workType) > -1) {
                for (i = 0, len = dataList.length; i < len; i++) {
                    if (dataList[i].name11Por.name === '') {
                        dataList[i].name11Por = {};
                    }
                }
            }
        };
        $scope.doSave = function () {
            var obj = nameIsEmpty($scope.currentEdited);
            if (obj.flag) {
                swal({
                    title: '提示',
                    text: '存在为空的编辑字段,是否保存？',
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
                // swal({ title: '提示', text: '原始英文名称不能为空！', type: 'info' });
                // return;
            }
            save();
        };

        // ----- 以下为批量编辑的代码-----
        var currentReplaceIndex = 0; // 当前替换的行数

        // 设置光标显示的位置
        var setFocusByIndex = function () {
            if ($scope.main.workType === 'officalStandardEngName') {
                $('.engNameTable .ui-grid-row:eq(' + currentReplaceIndex + ') .ui-grid-cell:eq(4) input').focus();
            } else {
                $('.engNameTable .ui-grid-row:eq(' + currentReplaceIndex + ') .ui-grid-cell:eq(3) input').focus();
            }
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
            var nameObj = {};
            if ($scope.searchObject.searchType === 'originalengname') {
                nameObj = currentData.name12Eng; // 原始英文
            } else if ($scope.searchObject.searchType === 'originalporname') {
                nameObj = currentData.name12Por; // 原始葡文
            } else if ($scope.searchObject.searchType === 'standardengname') {
                nameObj = currentData.name11Eng; // 标准英文
            } else if ($scope.searchObject.searchType === 'standardporname') {
                nameObj = currentData.name11Por; // 标准葡文
            } else if ($scope.searchObject.searchType === 'standardname') {
                nameObj = currentData.name11Cht; // 标准中文
            }
            var name = nameObj.name;
            if (searchText) {
                if ((name && name.indexOf(searchTextDbc) > -1) || (name && name.indexOf(searchTextCbd) > -1)) {
                    var finalyValue = name.split(searchTextDbc).join(replaceVal);
                    if (finalyValue == name) {
                        finalyValue = name.split(searchTextCbd).join(replaceVal);
                    }
                    nameObj.name = finalyValue;
                }
            } else {
                if (!name) {
                    nameObj.name = replaceVal;
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
                var nameObj = {};
                if ($scope.searchObject.searchType === 'standardname') {
                    nameObj = temp.name11Cht; // 官方标准中文
                } else if ($scope.searchObject.searchType === 'standardengname') {
                    nameObj = temp.name11Eng; // 官方标准英文
                } else if ($scope.searchObject.searchType === 'originalengname') {
                    nameObj = temp.name12Eng; // 原始英文
                }
                var name = nameObj.name;
                if (searchText) {
                    if ((name && name.indexOf(searchTextDbc) > -1) || (name && name.indexOf(searchTextCbd) > -1)) {
                        count += 1;
                        var finalyValue = name.split(searchTextDbc).join(replaceVal);
                        if (finalyValue == name) {
                            finalyValue = name.split(searchTextCbd).join(replaceVal);
                        }
                        nameObj.name = finalyValue;
                    }
                } else {
                    if (!name) {
                        count += 1;
                        nameObj.name = replaceVal;
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
      /**
       * 创建分页
       * @return {undefined}
       */
        function initPage() {
            initTable();
            currentReplaceIndex = 0;
        }
        // 页面初始化
        initPage();
    }]);

