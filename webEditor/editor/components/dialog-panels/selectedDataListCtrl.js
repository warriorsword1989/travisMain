/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('SelectedDataListCtrl', ['$scope',
    function ($scope) {
        var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
        var feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();
        var feedback = new fastmap.mapApi.Feedback();
        feedbackCtrl.add(feedback);
        var featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        var geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        var originalEvent;

        var getRendersByGeoLiveType = function (geoLiveType) {
            var renders = [];
            var layers = sceneCtrl.getLoadedLayersByFeatureType(geoLiveType);
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].getFeatureType() === geoLiveType) {
                    renders.push(layers[i].getRender());
                }
            }

            return FM.Util.unique(renders);
        };

        var initialize = function (event, data) {
            $scope.dataList = data.features;
            // originalFeatures = data.originalFeatures;
            originalEvent = data.event ? data.event.originalEvent : null;
        };

        $scope.selectData = function (feature) {
            $scope.$emit('ObjectSelected', {
                feature: feature,
                originalEvent: originalEvent
            });
        };

        $scope.featureMouseenter = function (item) {
            feedback.clear();

            // 此时地图上肯定已经加载了对应要素，因此可以用selector来获取
            // 一旦获取不到，则不渲染
            var feature = featureSelector.selectByFeatureId(item.pid, item.geoLiveType);
            if (feature) {
                var renders = getRendersByGeoLiveType(item.geoLiveType);
                var symbol;
                var symbols = [];
                for (var j = 0; j < renders.length; j++) {
                    symbol = new renders[j]().getHighlightSymbol(feature, sceneCtrl.getZoom());
                    if (!symbol) {
                        // 如果要素在某种情况下不需要绘制会返回null
                        continue;
                    }
                    if (FM.Util.isArray(symbol)) {
                        Array.prototype.push.apply(symbols, symbol);
                    } else {
                        symbols.push(symbol);
                    }
                }

                symbols.forEach(function (smb) {
                    var geometry = geometryFactory.toGeojson(smb.geometry);
                    feedback.add(geometry, smb);
                }, this);
            }

            feedbackCtrl.refresh();
        };

        $scope.featureMouseleave = function () {
            feedback.clear();
            feedbackCtrl.refresh();
        };

        $scope.getName = function (item) {
            if (item.geoLiveType === 'IXPOI') {
                return item.name;
            }
            return FM.uikit.Config.getName(item.geoLiveType);
        };

        $scope.$on('SelectedDataListReload', initialize);

        // 删除要素后根据log数据(因为有关联删除维护)刷新选择面板
        $scope.$on('SelectedDataListRefresh', function (event, data) {
            for (var i = $scope.dataList.length - 1; i >= 0; i--) {
                var outerItem = $scope.dataList[i];
                for (var j = 0; j < data.updateLogs.length; j++) {
                    var innerItem = data.updateLogs[j];
                    if (outerItem.geoLiveType === innerItem.type &&
                        outerItem.pid === innerItem.pid &&
                        innerItem.op === '删除') {
                        $scope.dataList.splice(i, 1);
                    }
                }
            }
        });

        $scope.$on('$destroy', function () {
            feedback.clear();
            feedbackCtrl.del(feedback);
            feedbackCtrl.refresh();
        });
    }
]);
