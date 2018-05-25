/**
 * Created by lingLong on 2017/1/12.
 * 批量选择结果
 */

angular.module('app').controller('AdvanceSearchController', ['$scope', 'dsEdit', 'NgTableParams',
    function ($scope, dsEdit, NgTableParams) {
        // 初始化model;
      /**
       * initModel
       * @return {undefined}
       */
        function initModel() {
            $scope.treeOptions = { // 树形插件初始化;
                nodeChildren: 'children',
                dirSelectable: false,
                injectClasses: {
                    ul: 'a1',
                    li: 'a2',
                    liSelected: 'a7',
                    iExpanded: 'a3',
                    iCollapsed: 'a4',
                    iLeaf: 'a5',
                    label: 'a6',
                    labelSelected: 'a8'
                }
            };
            $scope.currentPanel = 'search'; // 标识当前是搜索页还是结果页;
            $scope.allMainTable = null;  // 存储主表与子表的树形json对象;
            $scope.typeListFlag = false; // 控制类型选择下拉列表的显示隐藏标识;
            $scope.ConditionRange = [
                {
                    id: 1,
                    label: '='
                },
                {
                    id: 2,
                    label: '<>'
                },
                {
                    id: 3,
                    label: '>'
                },
                {
                    id: 4,
                    label: '<'
                },
                {
                    id: 5,
                    label: '>='
                },
                {
                    id: 6,
                    label: '<='
                },
                {
                    id: 7,
                    label: '包含'
                },
                {
                    id: 8,
                    label: '以开头'
                },
                {
                    id: 9,
                    label: '以结尾'
                },
                {
                    id: 10,
                    label: 'in'
                }
            ]; // 所有搜索可用的操作符;
            $scope.showLoading = false; // 显示搜索时加载loading的显示隐藏标识;
            $scope.currentAttr = []; // 基于当前所选的子表所产生的树形列表;
            $scope.searchModel = { // 高级搜索数据模型;
                uuid: '',
                dbId: App.Temp.dbId,
                gridIds: App.Temp.gridList.join(','),
                meshIds: [].join(','),
                pageNum: 1,
                pageSize: 20,
                mainTableName: '',
                searchTableName: '',
                conditions: [
                    { fieldName: 0, operator: 0, fieldType: '', value: '' }
                ]
            };

            $scope.currentSelectedType = ''; // 当前类型的中文名字;
            $scope.currentAreaBlocks = [
                {
                    id: $scope.searchModel.dbId,
                    label: '当前大区库（默认）'
                }
            ]; // 所有大区库（当前只支持当前任务所在的大区库）;
            $scope.currentTableType = null; // 当前所选主表的
            $scope.rowIdsArr = []; // 分歧....
            $scope.currentSeletedDataIndex = -1;
        }
        // 重置搜索选项;
      /**
       * resetSearchConditions
       * @return {undefined}
       */
        function resetSearchConditions() {
            $scope.searchModel = {
                uuid: '',
                dbId: App.Temp.dbId,
                gridIds: App.Temp.gridList.join(','),
                meshIds: [],
                pageNum: 1,
                pageSize: 20,
                mainTableName: '',
                searchTableName: '',
                conditions: [
                    { fieldName: 0, operator: 1, fieldType: '', value: '' }
                ]
            };
            $scope.currentSelectedType = '';
        }
        // Ctrl入口;
      /**
       * initialize
       * @return {undefined}
       */
        function initialize() {
            initModel();
            dsEdit.getAllTableInfos()
                .then(function (res) {
                    $scope.allMainTable = res.label;
                    return res.label;
                })
                .then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        (function (index) {
                            dsEdit.getTableNodeInfos(res[index].tableName).then(function (result) {
                                res[index].children = result.label;
                            });
                        }(i));
                    }
                });
        }
        // 点击tree以外的地方关闭类型选择面板;
        $scope.monitorClickEvent = function ($event) {
            if ($event.target != angular.element('.typeList input')[0]) {
                var isParent = !!angular.element($event.target).parents('.diyTree').length;
                var isSelf = $event.target === angular.element('.diyTree')[0];
                if (!isParent && !isSelf && $scope.typeListFlag) {
                    $scope.typeListFlag = false;
                }
            }
        };

        // 显示和隐藏类型选择框;
        $scope.showTypeList = function () {
            $scope.typeListFlag = !$scope.typeListFlag;
        };
        // 选择子表并获得主表;
        $scope.showSelected = function (param, selected, parentNode) {
            if (selected) {
                $scope.typeListFlag = false;
                // 获得子表/主表的表名;
                $scope.searchModel.mainTableName = parentNode.tableName;
                $scope.searchModel.searchTableName = param.tableName;
                $scope.currentSelectedType = param.nameCHI;
                var tempTable = $scope.searchModel.mainTableName.split('_').join('');
                $scope.currentTableType = tempTable;
                if (tempTable != 'RDBRANCH') {
                    $scope.currentTableType = tempTable;
                } else {
                    tempTable = $scope.searchModel.searchTableName.split('_').join('');
                    var branch = ['RDBRANCHDETAIL', 'RDBRANCHREALIMAGE', 'RDSIGNASREAL', 'RDSERIESBRANCH', 'RDBRANCHSCHEMATIC', 'RDSIGNBOARD'];
                    if (branch.indexOf(tempTable) != -1) {
                        $scope.currentTableType = tempTable;
                    }
                }
            } else {
                $scope.searchModel.mainTableName = '';
                $scope.searchModel.searchTableName = '';
                $scope.currentSelectedType = '';
            }
            // 当主表或者子表改变时初始化查询conditions;
            $scope.searchModel.conditions = [{ fieldName: 0, operator: 1, fieldType: '', value: '' }];
            // 根据子表获取当前对应的属性列表;
            if ($scope.searchModel.searchTableName) {
                $scope.getRelateAttr();
            }
            console.log($scope.searchModel.mainTableName + '---' + $scope.searchModel.searchTableName);
        };
        // 获取子表的属性;
        $scope.getRelateAttr = function () {
            dsEdit.getTableInfos($scope.searchModel.searchTableName)
                .then(function (res) {
                    $scope.currentAttr = res.table.fieldInfos;
                });
        };
        // 增加条件;
        $scope.deleteCondition = function (index) {
            $scope.searchModel.conditions.splice(index, 1);
        };
        // 删除条件;
        $scope.addCondition = function () {
            $scope.searchModel.conditions.push({ fieldName: 0, operator: 1, fieldType: '', value: '' });
        };
        // 只有选择了子表才能选择属性;
        $scope.attrSelectInfo = function () {
            // 如果还没有选择类型（主表和子表）则无法选择属性;
            if (!$scope.searchModel.searchTableName) {
                swal('注意', '请选择类型后在选择对应的属性！', 'warning');
                return;
            }
        };
        // 关闭搜索面板;
        $scope.closeAdvanceSearchPanel = function () {
            $scope.$emit('closeLeftFloatAdvanceSearchPanel');
        };
        // 清空搜索条件;
        $scope.clearCondition = function () {
            resetSearchConditions();
        };
        // 更新属性数值类型
        $scope.selectAction = function ($index) {
            var tempFieldType = $scope.searchModel.conditions[$index].fieldName;
            var tempType = '';
            $scope.currentAttr.forEach(function (data) {
                if (data.fieldName == tempFieldType) {
                    tempType = data.fieldType;
                }
            });
            $scope.searchModel.conditions[$index].fieldType = tempType;
        };
        // 当选择条件为IN时，将输入的值以逗号分割转换为数组;
        $scope.inputConditionValue = function (item) {
            if (item.operator === 10) {
                item.value = Utils.trim(item.value).split(',');
            }
        };


        // 更新比较类型;
        $scope.transFormOperator = function (data) {
            switch (data.operator) {
                case 1:
                    data.operator = '=';
                    break;
                case 2:
                    data.operator = '<>';
                    break;
                case 3:
                    data.operator = '>';
                    break;
                case 4:
                    data.operator = '<';
                    break;
                case 5:
                    data.operator = '>=';
                    break;
                case 6:
                    data.operator = '<=';
                    break;
                case 7:
                    data.operator = 'like';
                    break;
                case 8:
                    data.operator = 'like';
                    break;
                case 9:
                    data.operator = 'like';
                    break;
                case 10:
                    data.operator = 'IN';
                    break;
                default:
                    data.operator = '=';
            }
        };
        // 搜索请求前对数据的同一转换;
        $scope.transFormRequestParams = function () {
            // 拷贝一份数据模型防止数据绑定导致显示问题;
            var searchModelCopy = FM.Util.clone($scope.searchModel);
            searchModelCopy.uuid = $scope.generateUUID();
            if (searchModelCopy.gridIds.length) {
                var inPutGridsValue = Utils.trim($scope.searchModel.gridIds).split(',');
                searchModelCopy.gridIds = inPutGridsValue.map(function (data) {
                    if (isNaN(data)) { return data; } // 如果输入的图幅不是数字则原样记录，在检查中再验证合法性;
                    return parseInt(data, 10); // 如果输入的是数字，将其转换为整数;
                });
            } else {
                searchModelCopy.gridIds = [];
            }
            if (searchModelCopy.meshIds.length) {
                var inputMeshesValue = Utils.trim($scope.searchModel.meshIds).split(',');
                searchModelCopy.meshIds = inputMeshesValue.map(function (data) {
                    if (isNaN(data)) { return data; }
                    return parseInt(data, 10);
                });
            } else {
                searchModelCopy.meshIds = [];
            }
            // 对属性数组内的数据处理
            searchModelCopy.conditions.forEach(function (data) {
                // 对数值类型的转换;
                if (data.fieldType === 'Integer') {
                    if (data.value instanceof Array) {
                        data.value.forEach(function (res, index) {
                            data.value[index] = isNaN(res) ? res : parseInt(res, 10);
                        });
                    } else {
                        data.value = isNaN(data.value) ? data.value : parseInt(data.value, 10);
                    }
                } else if (data.fieldType === 'Double') {
                    if (data.value instanceof Array) {
                        data.value.forEach(function (res, index) {
                            data.value[index] = isNaN(res) ? res : parseFloat(res, 10);
                        });
                    } else {
                        data.value = isNaN(data.value) ? data.value : parseFloat(data.value, 10);
                    }
                }
                // 对值进行特殊处理;
                if (data.operator == 7) {
                    data.value = '%' + data.value + '%';
                } else if (data.operator == 8) {
                    data.value += '%';
                } else if (data.operator == 9) {
                    data.value = '%' + data.value;
                }
                // 对操作符进行处理;
                $scope.transFormOperator(data);
            });
            return searchModelCopy;
        };
        // 请求前的检查;
        $scope.checkConditions = function (searchModelCopy) {
            var checkObj = { status: true, messages: [] };
            // 验证输入逗号隔开的输入是否合法;
            searchModelCopy.gridIds.forEach(function (data) {
                if (isNaN(data)) {
                    checkObj.messages.push('Grids输入不合法');
                    return;
                }
            });
            searchModelCopy.meshIds.forEach(function (data) {
                if (isNaN(data)) {
                    checkObj.messages.push('图幅输入不合法');
                    return;
                }
            });
            if (!searchModelCopy.searchTableName) {
                checkObj.messages.push('必须选择类型');
            } else {
                var tempConditions = [];
                // 如果没有选择具体的属性则认为这条condition无效;
                searchModelCopy.conditions.forEach(function (data, index) {
                    if (data.fieldName && data.operator != 0 && data.value !== '') {
                        tempConditions.push(searchModelCopy.conditions[index]);
                    }
                });
                if (!tempConditions.length) {
                    checkObj.messages.push('至少需要选择一条具体的属性条件进行过滤查询');
                } else {
                    tempConditions.forEach(function (data, index) {
                        if (FM.Util.isArray(data.value)) {
                            data.value.forEach(function (res) {
                                if ((data.fieldType === 'Integer' || data.fieldType === 'Double') && isNaN(res)) {
                                    checkObj.messages.push('第' + (index + 1) + '条属性值输入不合法');
                                    return;
                                }
                            });
                        } else {
                            if ((data.fieldType === 'Integer' || data.fieldType === 'Double') && isNaN(data.value)) {
                                checkObj.messages.push('第' + (index + 1) + '条属性值输入不合法');
                                return;
                            }
                        }
                    });
                }
            }
            if (checkObj.messages.length) { checkObj.status = false; }
            return checkObj;
        };
        // 发起搜索请求;
        $scope.firstSearchRequest = function () {
            // 将数搜索数据模型转换成请求要的形式;
            var SearchParams = $scope.transFormRequestParams();
            // 对请求的参数的合法性进行验证;
            var checkResult = $scope.checkConditions(SearchParams);
            if (checkResult.status) {
                $scope.currentPanel = 'result';
                $scope.searchForResult(SearchParams);
            } else {
                var html = '';
                checkResult.messages.forEach(function (item) {
                    html += item + '<br />';
                });
                swal({
                    title: '注意',
                    text: html,
                    html: true,
                    showCancelButton: false,
                    allowEscapeKey: false,
                    confirmButtonText: '确定',
                    confirmButtonColor: '#ec6c62'
                });
            }
        };

        /* ------------------------------------------------搜索结果页面---------------------------------------------------- */
        // 分歧表与geoLiveType的对应关系;
        var branchTable = [{
            type: 'RDBRANCHDETAIL',
            geoLiveType: 'RDHIGHSPEEDBRANCH'
        }, {
            type: 'RDBRANCHDETAIL',
            geoLiveType: 'RDASPECTBRANCH'
        }, {
            type: 'RDBRANCHDETAIL',
            geoLiveType: 'RDICBRANCH'
        }, {
            type: 'RDBRANCHDETAIL',
            geoLiveType: 'RD3DBRANCH'
        }, {
            type: 'RDBRANCHDETAIL',
            geoLiveType: 'RDCOMPLEXSCHEMA'
        }, {
            type: 'RDBRANCHREALIMAGE',
            geoLiveType: 'RDREALIMAGE'
        }, {
            type: 'RDSIGNASREAL',
            geoLiveType: 'RDSIGNASREAL'
        }, {
            type: 'RDSERIESBRANCH',
            geoLiveType: 'RDSERIESBRANCH'
        }, {
            type: 'RDBRANCHSCHEMATIC',
            geoLiveType: 'RDSCHEMATICBRANCH'
        }, {
            type: 'RDSIGNBOARD',
            geoLiveType: 'RDSIGNBOARD'
        }];
        // 自定义复选框
      /**
       * showCheckBox
       * @param {Object} g g
       * @param {Object} row row
       * @return {String} <label><label/>
       */
        function showCheckBox(g, row) {
            return '<label style="font-weight: normal" ng-click="stopDefaultBehavior($event)">'
                + '<input type="checkbox" style="vertical-align: bottom;" class="fm-control" ng-checked="row.checked" />'
                + '<span style="vertical-align: text-bottom; margin-left: 2px">确认</span>'
                + '</label>';
        }
        $scope.stopDefaultBehavior = function (e) {
            e.stopPropagation();
        };
        // 表头;
        $scope.tableHead = [{
            field: 'index',
            title: '序号',
            width: '50px',
            show: true
        }, {
            field: 'pid',
            title: 'PID',
            width: '150px',
            show: true
        }, {
            field: 'checked',
            title: '是否已确认',
            width: '100px',
            html: true,
            show: true,
            getValue: showCheckBox
        }];
        // ngTable插件;
        $scope.searchForResult = function (SearchParams) {
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: $scope.searchModel.pageSize
            }, {
                counts: [], // 为了不显示每页显示多少条的下拉列表;
                paginationMaxBlocks: 2,
                paginationMinBlocks: 2,
                getData: function ($defer, params) {
                    var currentPageNum = params.page();
                    $scope.currentSeletedDataIndex = -1;
                    var pageCount = params.count();
                    $scope.showLoading = true;
                    SearchParams.pageNum = currentPageNum;
                    dsEdit.getSearchData(SearchParams)
                        .then(function (res) {
                            if (res) {
                                $scope.showLoading = false;
                                params.total(res.total);
                                var tableParams = [];
                                res.pids.forEach(function (data, num) {
                                    var dataSequence = (currentPageNum - 1) * pageCount + num + 1;
                                    tableParams.push({ index: dataSequence, pid: data, checked: false });
                                });
                                if (res.rowIds) {
                                    $scope.rowIdsArr = res.rowIds;
                                } else {
                                    $scope.rowIdsArr = [];
                                }
                                $defer.resolve(tableParams);
                            }
                        });
                }
            });
        };
        // 点击搜索列表地图高亮定位;
        $scope.showFeature = function (data, index) {
            var id = data.pid;
            $scope.currentSeletedDataIndex = index;
            $scope.$emit('ClearPage');
            // 分歧调用getByPid的时候type是RDBRANCH，并且需要子类型
            var branch = ['RDBRANCHDETAIL', 'RDBRANCHREALIMAGE', 'RDSIGNASREAL', 'RDSERIESBRANCH', 'RDBRANCHSCHEMATIC', 'RDSIGNBOARD'];
            if (branch.indexOf($scope.currentTableType) > -1) {
                id = $scope.rowIdsArr[index];
                var geoLiveType = '';
                branchTable.forEach(function (result) {
                    if (result.type == $scope.currentTableType) {
                        geoLiveType = result.geoLiveType;
                    }
                });
                $scope.$emit('ObjectSelected', { feature: { pid: id, geoLiveType: geoLiveType } });
            } else {
                $scope.$emit('ObjectSelected', { feature: { pid: id, geoLiveType: $scope.currentTableType } });
            }
        };
        // 返回到高级搜索;
        $scope.backToAdvanceSearch = function () {
            $scope.currentPanel = 'search';
        };
        // 隐藏搜索结果面板;
        $scope.hideAdvanceResultLeftPanel = function () {
            $scope.$emit('hideAdvanceResultLeftPanel');
        };
        // 生成uid方法;
        $scope.generateUUID = function () {
            /**
             * S4
             * @return {String} 随机数
            */
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
        };

        // Ctrl入口;
        initialize();
    }
]).filter('filterEnableDataType', function () {
    return function (data) {
        var tempArr = [];
        data.forEach(function (item) {
            if (['Integer', 'String', 'Double'].indexOf(item.fieldType) != -1) {
                tempArr.push(item);
            }
        });
        return tempArr;
    };
});
