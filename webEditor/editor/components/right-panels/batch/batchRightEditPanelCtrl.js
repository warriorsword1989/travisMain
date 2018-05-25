/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('BatchRightEditPanelCtrl', ['$scope', '$rootScope', '$timeout', 'dsEdit',
    function ($scope, $rootScope, $timeout, dsEdit) {
        var eventCtrl = fastmap.event.EventController.getInstance();
        var objectEditCtrl = FM.uikit.ObjectEditController();

        var initialize = function (event, data) {
            if ($rootScope.CurrentObject) {
                var geoLiveType = $rootScope.CurrentObject.geoLiveType;
                $scope.objectName = FM.uikit.Config.getName(geoLiveType);
                var attrTmpl = FM.uikit.Config.getEditTemplate(geoLiveType);
                if (attrTmpl) {
                    $scope.batchEditTmpl = attrTmpl.tmpl;
                    $timeout(function () {
                        $scope.$broadcast('ReloadData', {
                            data: $rootScope.CurrentObject
                        });
                    });
                }
                eventCtrl.fire('deleteRoadBatchToToolPanel', {
                    context: $scope,
                    panelType: 'batchPanel'
                });
            }
        };

        var showErrorInfo = function (dataErrors) {
            var forms = dataErrors.form;
            var edits = dataErrors.edit;
            var errors = [];
            if (forms && !Utils.isEmptyObject(forms)) {
                for (var k in forms) {
                    if (forms.hasOwnProperty(k)) {
                        errors.push(forms[k]);
                        break;
                    }
                }
            }
            if (edits && !Utils.isEmptyObject(edits)) {
                for (var p in edits) {
                    if (edits.hasOwnProperty(p)) {
                        errors.push(edits[p]);
                        break;
                    }
                }
            }
            if (errors.length > 0) {
                if (errors[0].code == 1) {
                    swal('注意', errors[0].message, 'error');
                } else if (errors[0].code == 2) {
                    swal('注意', errors[0].message, 'info');
                }
            }
        };

        $scope.doSave = function () {
            var changes = objectEditCtrl.data.getChanges(true);
            if (changes === null) {
                swal('无任何修改，不需要保存！', null, 'info');
                return;
            }
            if (changes) {
                if (!objectEditCtrl.data.validate()) {
                    showErrorInfo(objectEditCtrl.data.getErrors());
                    return;
                }

                var batchType = objectEditCtrl.data.options.batchType;
                var param = {
                    command: 'BATCH',
                    type: $rootScope.GeoLiveType,
                    dbId: App.Temp.dbId,
                    data: objectEditCtrl.getBatchChanges()
                };
                dsEdit.save(param).then(function (rest) {
                    if (rest) {
                        $scope.$emit('BatchUpdated', {
                            features: objectEditCtrl.datas,
                            updateLogs: rest.log,
                            options: {
                                type: batchType
                            }
                        });
                    }
                });
            }
        };

        $scope.doDelete = function () {
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var pids = objectEditCtrl.datas.map(function (item) {
                return item.pid;
            });
            var simpleFeature = new FM.dataApi.Feature({
                pid: pids,
                geoLiveType: objectEditCtrl.data.geoLiveType
            });

            swal({
                title: '确定删除？',
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '我要删除',
                confirmButtonColor: '#ec6c62'
            }, function (f) {
                if (f) {
                    var infect = 0;
                    if (['RDLINK', 'RDNODE'].indexOf(geoLiveType) > -1) {
                        infect = 1;
                    }
                    dsEdit.BatchDelete(pids, geoLiveType, infect)
                        .then(function (rest) {
                            $scope.$emit('ObjectDeleted', {
                                feature: simpleFeature,
                                updateLogs: rest.log
                            });
                        });
                }
            });
        };

        $scope.$on('BatchRightEditPanelReload', initialize);
    }
]);
