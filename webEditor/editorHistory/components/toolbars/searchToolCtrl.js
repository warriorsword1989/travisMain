/**
 * Created by wuzhen on 2017/1/12.
 */

angular.module('app').controller('searchToolCtrl', ['$scope', 'dsEdit',
    function ($scope, dsEdit) {
        $scope.closeImg = '../../images/newPoi/rightPanelIcon/icon-right-close.png';
        $scope.openImg = '../../images/newPoi/rightPanelIcon/icon-right-open.png';
        $scope.showKindFlag = false; // 树形结构显示标志
        $scope.showResultFlag = false; // 树形结构显示标志
        $scope.searchLoading = false;  // 搜索加载效果
        $scope.searchText = '';
        $scope.pagation = {
            pageNum: 1,
            pageSize: 10,
            total: 1,
            maxSize: 2
        };
        $scope.searchParma = {
            pageNum: $scope.pagation.pageNum,
            pageSize: $scope.pagation.pageSize,
            data: {},
            type: ''
        };
        $scope.selectedItem = {
            key: 'pid',
            name: 'POI',
            type: 'IXPOI',
            selected: true
        };
        $scope.searchDataList = [];

        $scope.kindList = [{
            name: '兴趣点',
            children: [{
                key: 'pid',
                name: 'POI',
                type: 'IXPOI',
                selected: true
            }],
            selected: true
        }, {
            name: '点门牌',
            children: [{
                key: 'pid',
                name: 'POINTADDRESS',
                type: 'IXPOINTADDRESS',
                selected: false
            }],
            selected: false
        }, {
            name: '道路背景',
            children: [{
                key: 'linkPid',
                name: '道路线',
                type: 'RDLINK',
                selected: false
            }, {
                key: 'nodePid',
                name: '道路点',
                type: 'RDNODE',
                selected: false
            }, {
                key: 'linkPid',
                name: '铁路线',
                type: 'RWLINK',
                selected: false
            }, {
                key: 'nodePid',
                name: '铁路点',
                type: 'RWNODE',
                selected: false
            }],
            selected: false
        }, {
            name: '行政区划',
            children: [{
                key: 'nodePid',
                name: '行政区划点',
                type: 'ADNODE',
                selected: false
            }, {
                key: 'linkPid',
                name: '行政区划线',
                type: 'ADLINK',
                selected: false
            }, {
                key: 'facePid',
                name: '行政区划面',
                type: 'ADFACE',
                selected: false
            }, {
                key: 'regionId',
                name: '行政区划代表点',
                type: 'ADADMIN',
                selected: false
            }],
            selected: false
        }, {
            name: 'ZONE背景',
            children: [{
                key: 'nodePid',
                name: 'ZONE点',
                type: 'ZONENODE',
                selected: false
            }, {
                key: 'linkPid',
                name: 'ZONE线',
                type: 'ZONELINK',
                selected: false
            }, {
                key: 'facePid',
                name: 'ZONE面',
                type: 'ZONEFACE',
                selected: false
            }],
            selected: false
        }, {
            name: '土地覆盖',
            children: [{
                key: 'nodePid',
                name: 'LC点',
                type: 'LCNODE',
                selected: false
            }, {
                key: 'linkPid',
                name: 'LC线',
                type: 'LCLINK',
                selected: false
            }, {
                key: 'facePid',
                name: 'LC面',
                type: 'LCFACE',
                selected: false
            }],
            selected: false
        }, {
            name: '土地利用',
            children: [{
                key: 'nodePid',
                name: 'LU点',
                type: 'LUNODE',
                selected: false
            }, {
                key: 'linkPid',
                name: 'LU线',
                type: 'LULINK',
                selected: false
            }, {
                key: 'facePid',
                name: 'LU面',
                type: 'LUFACE',
                selected: false
            }],
            selected: false
        }, {
            name: '市街图',
            children: [{
                key: 'nodePid',
                name: 'CmgBuild点',
                type: 'CMGBUILDNODE',
                selected: false
            }, {
                key: 'linkPid',
                name: 'CmgBuild线',
                type: 'CMGBUILDLINK',
                selected: false
            }, {
                key: 'facePid',
                name: 'CmgBuild面',
                type: 'CMGBUILDFACE',
                selected: false
            }],
            selected: false
        }, {
            name: '路口关系',
            children: [{
                key: 'pid',
                name: '路口',
                type: 'RDCROSS',
                selected: false
            }, {
                key: 'pid',
                name: '车信',
                type: 'RDLANECONNEXITY',
                selected: false
            }, {
                key: 'pid',
                name: '交限',
                type: 'RDRESTRICTION',
                selected: false
            }, {
                key: 'pid',
                name: '顺行',
                type: 'RDDIRECTROUTE',
                selected: false
            }, {
                key: 'pid',
                name: '分岔口',
                type: 'RDSE',
                selected: false
            }, {
                key: 'pid',
                name: '坡度',
                type: 'RDSLOPE',
                selected: false
            }, {
                key: 'pid',
                name: '信号灯',
                type: 'RDTRAFFICSIGNAL',
                selected: false
            }],
            selected: false
        }, {
            name: '路上关系',
            children: [{
                key: 'pid',
                name: '立交',
                type: 'RDGSC',
                selected: false
            }, {
                key: 'pid',
                name: '收费站',
                type: 'RDTOLLGATE',
                selected: false
            }, {
                key: 'pid',
                name: '大门',
                type: 'RDGATE',
                selected: false
            }, {
                key: 'pid',
                name: '电子眼',
                type: 'RDELECTRONICEYE',
                selected: false
            }, {
                key: 'bumpPid',
                name: '减速带',
                type: 'RDSPEEDBUMP',
                selected: false
            }, {
                key: 'pid',
                name: '速度限制',
                type: 'RDSPEEDLIMIT',
                selected: false
            }, {
                key: 'pid',
                name: '警示信息',
                type: 'RDLINKWARNING',
                selected: false
            }, {
                key: 'vspeedPid',
                name: '可变限速',
                type: 'RDVARIABLESPEED',
                selected: false
            }, {
                key: 'lanePid',
                name: '详细车道',
                type: 'RDLANE',
                selected: false
            }, {
                key: 'pid',
                name: '车道联通',
                type: 'RDLANETOPODETAIL',
                selected: false
            }, {
                key: 'pid',
                name: '语音引导',
                type: 'RDVOICEGUIDE',
                selected: false
            }, {
                key: 'pid',
                name: '限高限重',
                type: 'RDHGWGLIMIT',
                selected: false
            }, {
                key: 'pid',
                name: '卡车交限',
                type: 'RDRESTRICTION',
                selected: false
            }, {
                key: 'pid',
                name: '里程桩',
                type: 'RDMILEAGEPILE',
                selected: false
            }, {
                key: 'pid',
                name: 'TMC',
                type: 'RDTMCLOCATION',
                selected: false
            }],
            selected: false
        }, {
            name: '组合关系',
            children: [{
                key: 'groupId',
                name: '同一点',
                type: 'RDSAMENODE',
                selected: false
            }, {
                key: 'groupId',
                name: '同一线',
                type: 'RDSAMELINK',
                selected: false
            }, {
                key: 'pid',
                name: 'CFR点',
                type: 'RDINTER',
                selected: false
            }, {
                key: 'pid',
                name: 'CRF路',
                type: 'RDROAD',
                selected: false
            }, {
                key: 'pid',
                name: 'CRF对象',
                type: 'RDOBJECT',
                selected: false
            }, {
                key: 'groupPid',
                name: '辅路',
                type: 'RDMAINSIDE',
                selected: false
            }, {
                key: 'groupPid',
                name: '上下线分离',
                type: 'RDMULTIDIGITIZED',
                selected: false
            }],
            selected: false
        }, {
            name: '分歧类型',
            children: [{
                key: 'detailId',
                name: '高速分歧',
                type: 'RDBRANCHDETAIL',
                geoLiveType: 'RDHIGHSPEEDBRANCH',
                selected: false
            }, {
                key: 'detailId',
                name: '方面分歧',
                type: 'RDBRANCHDETAIL',
                geoLiveType: 'RDASPECTBRANCH',
                selected: false
            }, {
                key: 'detailId',
                name: 'IC分歧',
                type: 'RDBRANCHDETAIL',
                geoLiveType: 'RDICBRANCH',
                selected: false
            }, {
                key: 'detailId',
                name: '3D分歧',
                type: 'RDBRANCHDETAIL',
                geoLiveType: 'RD3DBRANCH',
                selected: false
            }, {
                key: 'detailId',
                name: '复杂路口模式图',
                type: 'RDBRANCHDETAIL',
                geoLiveType: 'RDCOMPLEXSCHEMA',
                selected: false
            }, {
                key: 'rowId',
                name: '实景图',
                type: 'RDBRANCHREALIMAGE',
                geoLiveType: 'RDREALIMAGE',
                selected: false
            }, {
                key: 'signboardId',
                name: '实景看板',
                type: 'RDSIGNASREAL',
                geoLiveType: 'RDSIGNASREAL',
                selected: false
            }, {
                key: 'rowId', // 分歧的比较特殊，参数是和小龙商量的
                name: '连续分歧',
                type: 'RDSERIESBRANCH',
                geoLiveType: 'RDSERIESBRANCH',
                selected: false
            }, {
                key: 'schematicId',
                name: '大路口交叉模式图',
                type: 'RDBRANCHSCHEMATIC',
                geoLiveType: 'RDSCHEMATICBRANCH',
                selected: false
            }, {
                key: 'signboardId',
                name: '方向看板',
                type: 'RDSIGNBOARD',
                geoLiveType: 'RDSIGNBOARD',
                selected: false
            }],
            selected: false
        }];
        // 搜索框效果;
        $scope.searchInputStatus = true;

        // 当再下拉框外点的时候再隐藏
        $(document).click(function (e) {
            var clickTarget = e.toElement;
            if (clickTarget != $('.searchInput')[0]) {
                var obj = $('.searchPanel')[0];
                var isChild = $(clickTarget).parents().hasClass('searchPanel');
                var isSelf = (clickTarget == obj);
                var notHide = (isSelf || isChild);
                if (!notHide) {
                    $scope.$apply(function () {
                        $scope.hideDownPanel();
                        $scope.searchInputStatus = true;
                    });
                }
            }
        });

        $scope.showAction = function (evt) {
            $scope.searchInputStatus = !$scope.searchInputStatus;
            var obj = evt.currentTarget;
            var container = $(obj).closest('.inputWrapper');
            if (!$scope.searchInputStatus) {
                container.addClass('active');
                evt.preventDefault();
            } else if ($scope.searchInputStatus) {
                container.removeClass('active');
                container.find('.searchInput').val('');
                $scope.hideDownPanel();
            }
        };
        // 显示搜索加载效果;
        $scope.showLoadingAffected = function () {
            $scope.searchLoading = true;
        };
        // 隐藏搜索加载效果;
        $scope.hideLoadingAffected = function () {
            $scope.searchLoading = false;
        };

        // 展示高级搜索面板;
        $scope.showAdvanceSearchPanel = function () {
            $scope.$emit('ShowInfoPage', { type: 'AdvancedSearch' });
        };

        $scope.showKindPanel = function () {
            $scope.showKindFlag = !$scope.showKindFlag;
            $scope.showResultFlag = false;
        };

        // 点击pid高亮并定位;
        $scope.showInmap = function (item) {
            $scope.$emit('ClearPage');
            // 分歧调用getByPid的时候type是RDBRANCH，并且需要子类型
            var branch = ['RDBRANCHDETAIL', 'RDBRANCHREALIMAGE', 'RDSIGNASREAL', 'RDSERIESBRANCH', 'RDBRANCHSCHEMATIC', 'RDSIGNBOARD'];
            if (branch.indexOf(item.type) > -1) {
                $scope.$emit('ObjectSelected', { feature: { pid: item.pid, geoLiveType: $scope.selectedItem.geoLiveType } });
            } else {
                $scope.$emit('ObjectSelected', { feature: { pid: item.pid, geoLiveType: item.type } });
            }
        };

        /* 公共方法 */
      /**
       * 在线检查
       * @param {Object} param 要素获取
       * @return {undefined}
       */
        function ValidateLocation(param) {
            var tempArray = param.split(',');
            var log = tempArray[0];
            var lat = tempArray[1];
            if (!log || !lat) {
                return false;
            }
            if (log > 180 || log < 0) {
                return false;
            }
            if (lat > 90 || lat < 0) {
                return false;
            }
            return true;
        }
        var marker = null;
        var createMarker = function (latlon) {
            var myIcon = L.icon({
                iconUrl: '../../images/poi/map/marker_red_16.png',
                iconSize: [24, 33],
                iconAnchor: [12, 33]
            });
            marker = L.marker(latlon, {
                icon: myIcon
            }).addTo(map);
        };
        $scope.clearMarker = function () {
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
        };

        // 查询数据;
        $scope.doSearch = function (e) {
            if (e.charCode === 13) {
                var text = Utils.trim($scope.searchText);
                var key = $scope.selectedItem.key;
                $scope.searchParma.type = $scope.selectedItem.type;
                if (!text) { return; }
                if (isNaN(text)) {
                    // 如果输入是坐标;
                    if (text.indexOf(',') != -1) {
                        $scope.showKindFlag = false;
                        if (ValidateLocation(text)) {
                            var temp = text.split(',');
                            temp[0] = parseFloat(temp[0]);
                            temp[1] = parseFloat(temp[1]);
                            var geoObj = new fastmap.uikit.Util().createPoint(temp);
                            $scope.$emit('Map-LocationByCoordinate', { coordinate: geoObj });
                            $scope.clearMarker();
                            createMarker([temp[1], temp[0]]);
                        } else {
                            swal('提示', '坐标输入有误!', 'warning');
                        }
                        return;
                    }
                    if ($scope.searchParma.type === 'RDLINK' || $scope.searchParma.type === 'IXPOI' || $scope.searchParma.type === 'IXPOINTADDRESS') {
                        key = 'name';
                    } else {
                        swal('提示', '只能输入数字!', 'warning');
                        return;
                    }
                }
                $scope.searchParma.data = {};
                $scope.searchParma.data[key] = text;
                $scope.pagation.total = 1; // 重新搜索初始化总页数;
                $scope.searchByParmas();
            }
        };
        // 数据查询接口;
        $scope.searchByParmas = function () {
            $scope.showLoadingAffected();
            $scope.showResultFlag = true;
            $scope.showKindFlag = false;
            $scope.searchParma.pageNum = $scope.pagation.pageNum;
            $scope.searchDataList = []; // 清空上一次搜索的数据;
            dsEdit.normalSearch($scope.searchParma).then(function (data) {
                if (data) {
                    $scope.hideLoadingAffected();
                    for (var i = 0; i < data.rows.length; i++) {
                        data.rows[i].shortPid = (data.rows[i].pid.length > 10) ? data.rows[i].pid.substring(0, 10) + '...' : data.rows[i].pid;
                        data.rows[i].shortName = (data.rows[i].name.length > 12) ? data.rows[i].name.substring(0, 12) + '...' : data.rows[i].name;
                    }
                    $scope.searchDataList = data.rows;
                    $scope.pagation.total = Math.ceil(data.total / $scope.pagation.pageSize);
                }
            });
        };

        $scope.selectFirst = function (item) {
            item.selected = !item.selected;
        };

        $scope.selectSecond = function (child) {
            for (var i = 0; i < $scope.kindList.length; i++) {
                var temp = $scope.kindList[i];
                for (var j = 0; j < temp.children.length; j++) {
                    var ch = temp.children[j];
                    ch.selected = false;
                }
            }
            $scope.selectedItem = child;
            child.selected = true;
        };

        // 跳转页
        $scope.goToPage = function () {
            $scope.searchByParmas();
        };

        $scope.hideDownPanel = function () {
            $scope.showKindFlag = false;
            $scope.showResultFlag = false;
        };
    }
]);
