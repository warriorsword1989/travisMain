/**
 * Created by zhaohang on 2016/11/24.
 */

angular.module('app').controller('TipLeftViewPanelCtrl', ['$scope', '$rootScope', '$timeout', 'dsFcc',
    function ($scope, $rootScope, $timeout, dsFcc) {
        var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
        var height = document.documentElement.clientHeight;
        var tipStatus = App.Temp.qcTaskFlag ? 10 : 9;
        $scope.tipTypeList = [];    //  统一放这里
        $scope.tipList = [];

        $scope.scroll_height = {
            height: (height - 80) + 'px',
            width: '100%'
        };
        $scope.tipStatusList = [{
            id: 0,
            name: '待作业'
        }, {
            id: 1,
            name: '有问题'
        }, {
            id: 2,
            name: '已作业'
        }];

        $scope.quaStatusList = [{
            id: 0,
            name: '待质检'
        }, {
            id: 1,
            name: '有问题'
        }, {
            id: 2,
            name: '已质检'
        }];

        //  接边tips，在右侧编辑面板显示。应该从属性详情面板 类型下拉框中 屏蔽掉
        var removeTipBorderType = function () {
            for (var i = $scope.tipTypeList.length - 1; i >= 0; i--) {
                if ($scope.tipTypeList[i].code == '8002') {
                    $scope.tipTypeList.splice(i, 1);
                    break;
                }
            }
        };

        var resetParam = function () {
            if (!$scope.selectedTipRowkey) {
                $scope.selectedTipRowkey = $scope.selectedTip.rowkey;
            }

            if (!$scope.selectedTipCode) {
                $scope.selectedTipCode = $scope.selectedTip.code;
            }
        };

        //  刷新类型下拉框
        var initTipTypeList = function () {
            // 根据tips状态查询
            dsFcc.getTipsStatics(tipStatus).then(function (data) {
                if (data.errcode === 0) {
                    var i,
                        k,
                        item;
                    $scope.tipTypeList = [];
                    var tipConfig = new FM.uikit.Config.Tip();
                    for (i = 0; i < data.data.rows.length; i++) {
                        for (k in data.data.rows[i]) {
                            if (data.data.rows[i].hasOwnProperty(k)) {
                                item = {
                                    code: k,
                                    name: tipConfig.getNameByCode(k),
                                    count: data.data.rows[i][k]
                                };
                                $scope.tipTypeList.push(item);
                            }
                        }
                    }
                    removeTipBorderType();
                }
            });
        };

        //  刷新当前类型下有哪些数据
        var initTipList = function () {
            return dsFcc.getTipsListItems(tipStatus, $scope.selectedTipCode).then(function (data) {
                if (data.errcode === 0) {
                    var i,
                        k,
                        item;
                    var temp = [];
                    var tipConfig = new FM.uikit.Config.Tip();
                    for (i = 0; i < data.data.length; i++) {
                        item = {
                            rowkey: data.data[i].i,
                            name: data.data[i].m.e || '未命名'
                        };
                        temp.push(item);
                    }
                    $scope.tipList = temp;
                }
            });
        };

        var reloadData = function () {
            initTipTypeList();  //  刷新类型下拉框
            initTipList();  //  刷新当前类型下都要哪些数据
            $scope.selectTip();
        };

        $scope.doKeyEntry = function () {
            resetParam();
            if ($scope.selectedTipCode === '2001' || $scope.selectedTipCode === '1201') {
                $scope.$broadcast('doKeyEntry');
            }
        };
        $scope.changeStatus = function () {
            resetParam();

            var data = [{
                rowkey: $scope.selectedTipRowkey,
                editStatus: $scope.selectedTipStatus,
                editMeth: 1
            }];
            dsFcc.batchTipsSave(data).then(function (item) {
                sceneCtrl.redrawLayerByGeoLiveTypes($scope.selectedTip.geoLiveType);
                reloadData();
            });
        };

        $scope.getTipList = function () {
            if (!$scope.selectedTipCode) {
                return;
            }

            initTipList().then(function () {
                if ($scope.tipList && $scope.tipList.length) {
                    $scope.selectedTipRowkey = $scope.tipList[0].rowkey;
                    $scope.selectTip();
                }
            });
        };

        var reloadTipTemplate = function (geoLiveType) {
            var tmplFile = FM.uikit.Config.getViewTemplate(geoLiveType);
            $scope.tipLeftViewTmpl = tmplFile.tmpl;
            $timeout(function () {
                $scope.$broadcast('ReloadData', {
                    data: $scope.selectedTip
                });
            });
        };

        var _tipLoadCallback = function (data) {
            $scope.selectedTip = FM.dataApi.Tip.create(data);
            reloadTipTemplate($scope.selectedTip.geoLiveType);

            if (App.Temp.mdFlag === 'd') {
                $scope.selectedTipStatus = data.track.t_dEditStatus;
            }
            if (App.Temp.mdFlag === 'm') {
                $scope.selectedTipStatus = data.track.t_mEditStatus;
            }
            // 向editCtrl发送tip变化事件，以便editCtrl能控制其他ctrl进行如 高亮 的操作
            $scope.$emit('ViewedTipChanged', {
                data: $scope.selectedTip
            });
        };

        var loadTip = function (rowkey) {
            dsFcc.getByRowkey(rowkey).then(function (data) {
                if (data) {
                    _tipLoadCallback(data);
                }
            });
        };

        $scope.selectTip = function () {
            if ($scope.selectedTipRowkey) {
                loadTip($scope.selectedTipRowkey);
            }
        };
        $scope.$on('reloadTipsStatus', function () {
            $scope.selectTip();
        });
        // 获取质检信息，并添加到面板上
        $scope.$on('getTipQualityData', function (event, data) {
            $scope.wrongData = data;
        });
        // 传递tips数据
        $scope.$on('getTipDataEvent', function (event, data) {
            $scope.tipsData = data;
        });
        // 高亮测线用
        $scope.$on('HighlightTipLinks', function (event, link) {
            dsFcc.getByRowkey(link.id).then(function (data) {
                if (data) {
                    var tipLinks = FM.dataApi.Tip.create(data);
                    // 向editCtrl发送tip变化事件，以便editCtrl能控制其他ctrl进行如 高亮 的操作
                    $scope.$emit('ViewedTipChanged', {
                        data: tipLinks
                    });
                }
            });
        });
        // 错误录入
        $scope.enterError = function () {
            dsFcc.queryWrong($scope.tipsData.rowkey).then(function (res) {
                if (res.logId) {
                    $scope.wrongData = res;
                } else {
                    $scope.wrongData = null;
                }
                var tmp = {
                    flag: true,
                    data: $scope.wrongData,
                    tip: $scope.tipsData,
                    close: false
                };
                $scope.$emit('switchQualityModal', tmp);
            });
        };
        // 质检状态修改
        $scope.changeQuaStatus = function (status) {
            dsFcc.updateStatus(status, $scope.tipsData.rowkey).then(function (res) {
                sceneCtrl.redrawLayerByGeoLiveTypes([$scope.tipsData.geoLiveType]);
                resetParam();
                reloadData();
                if (status == 1) {
                    var tmp = {
                        flag: true,
                        data: $scope.wrongData,
                        tip: $scope.tipsData,
                        close: false
                    };
                    $scope.$emit('switchQualityModal', tmp);
                }
            });
        };

        var getTipStatus = function (status) {
            if (!App.Temp.qcTaskFlag) { //  如果不是质检tips
                return status;
            }

            var workStatus = {
                0: 4,
                1: 6,
                2: 5
            };

            if (status < 3) {   //  质检tips，并且是从地图上的点选操作
                return workStatus[status];
            }

            return status;  //  质检tips，从列表传过来的
        };

        var initialize = function (event, data) {
            tipStatus = getTipStatus(data.feature.status);   //  用来保存属性面板中初始化时的状态类型
            var tipCode = data.feature.code;
            var tipRowkey = data.feature.id || data.feature.pid; // 兼容CavnasTip与Tip

            $scope.isQuality = App.Temp.qcTaskFlag;
            $scope.selectedTipCode = tipCode;
            $scope.selectedTipRowkey = tipRowkey;

            reloadData();
            $rootScope.tipLeftViewFlag = true;
        };

        $scope.$on('TipLeftViewPanelReload', initialize);

        $scope.$on('$destroy', function () {
            $rootScope.tipLeftViewFlag = false;
        });
    }
]);
