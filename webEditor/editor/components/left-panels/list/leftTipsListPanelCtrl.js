/**
 * Created by wangmingdong on 2017/5/8.
 */

angular.module('app').controller('leftTipsListPanelCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'dsFcc', 'appPath',
    function ($scope, $ocLazyLoad, dsEdit, dsFcc, appPath) {
        var tip = FM.uikit.Config.Tip();
        var workStatus = null;
        if (App.Temp.qcTaskFlag) {
            workStatus = {
                1: 4,
                2: 5,
                3: 6
            };
        } else {
            workStatus = {
                1: 0,
                2: 2,
                3: 1
            };
        }
        var initTipsTable = function () {
            $scope.itemActive = null;
            $scope.showTreeLoading = true;
            dsFcc.getTipsStatics(workStatus[$scope.activeType]).then(function (data) {
                $scope.showTreeLoading = false;
                if (data == -1) {
                    return;
                }
                var arr = [];
                var transArr = [];
                $scope.allTipsCount = 0;
                transArr = data.data.rows;
                for (var i = 0, len = transArr.length; i < len; i++) {
                    var obj = {};
                    var objArr = {};
                    obj = transArr[i];
                    var keys = Object.getOwnPropertyNames(obj);
                    $scope.allTipsCount += obj[keys[0]];
                    for (var j = 0; j < keys.length; j++) {
                        var item = keys[j];
                        objArr.name = tip.getNameByCode(item);
                        objArr.id = item;
                        objArr.flag = false;
                        objArr.show = true;
                        objArr.detail = false;
                        // $scope.tipsObj[item] = true;
                        objArr.total = obj[item];
                        arr.push(objArr);
                    }
                }
                $scope.tipTreeData = arr;
            });
        };

        // 查看某一类tips
        $scope.showTipGroup = function (index) {
            var i;
            for (i = 0; i < $scope.tipTreeData.length; i++) {
                if (i == index) {
                    $scope.tipTreeData[i].flag = !$scope.tipTreeData[index].flag;
                    $scope.tipTreeData[i].loading = !$scope.tipTreeData[index].loading;
                } else {
                    $scope.tipTreeData[i].flag = false;
                    $scope.tipTreeData[i].loading = false;
                }
            }
            // $scope.tipTreeData[index].flag = !$scope.tipTreeData[index].flag;
            if (!$scope.tipTreeData[index].detail) {
                dsFcc.getTipsListItems(workStatus[$scope.activeType], $scope.tipTreeData[index].id).then(function (data) {
                    $scope.tipTreeData[index].loading = false;
                    if (data == -1) {
                        return;
                    }
                    $scope.tipTreeData[index].childs = data.data;
                });
            }
        };

        // 搜索
        $scope.doSearchTips = function (content) {
            var i;
            if (content) {
                for (i = 0; i < $scope.tipTreeData.length; i++) {
                    if ($scope.tipTreeData[i].name.indexOf(content) > -1) {
                        $scope.tipTreeData[i].show = true;
                    } else {
                        $scope.tipTreeData[i].show = false;
                    }
                }
            } else {
                for (i = 0; i < $scope.tipTreeData.length; i++) {
                    $scope.tipTreeData[i].show = true;
                }
            }
        };

        // 显示tips详情
        $scope.showTips = function (item) {
            var feature = {
                id: item.i,
                pid: item.i,    //  接边tips
                code: item.t,
                geoLiveType: tip.getGLTByCode(item.t),
                status: workStatus[$scope.activeType]
            };
            $scope.$emit('ObjectSelected', {
                feature: feature
            });
            $scope.$emit('LeftListPanel', false);
        };

        // 切换作业类型
        var unbindHandler = $scope.$on('refreshTable', function (event, data) {
            if ($scope.listType.id != 2) {
                return;
            }
            $scope.activeType = data;
            initTipsTable();
        });

        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
