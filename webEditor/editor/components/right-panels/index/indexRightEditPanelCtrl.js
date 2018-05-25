/**
 * index右侧面板容器ctrl
 * @file       indexRightEditPanelCtrl.js
 * @author  mali
 * @date    2017-09-28
 *
 * @copyright @Navinfo, all rights reserved.
 */

angular.module('app').controller('indexRightEditPanelCtrl', ['$scope', '$rootScope', '$timeout', 'dsEdit',
    function ($scope, $rootScope, $timeout, dsEdit) {
        var objectEditCtrl = FM.uikit.ObjectEditController();
        var eventCtrl = fastmap.event.EventController.getInstance();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        var topoEditor = null;
        $scope.deletable = true;

        /* 审核状态*/
        $scope.statusObject = {
            1: '待作业',
            2: '待提交',
            3: '已提交'
        };
        
        var initialize = function () {
            if ($rootScope.CurrentObject.state == 2) { // 提交、删除状态的index不允许编辑   state --1新增，2删除 3修改
                $rootScope.isSpecialOperation = true;
            } else {
                $rootScope.isSpecialOperation = false;
            }
            if ($rootScope.CurrentObject) {
                var geoLiveType = $rootScope.CurrentObject.geoLiveType;
                topoEditor = topoEditFactory.createTopoEditor(geoLiveType, null);
                if (!topoEditor) {
                    swal({
                        title: geoLiveType + '类型要素未实现topoEditor!',
                        type: 'error',
                        allowEscapeKey: false
                    });
                    return;
                }
                $scope.objectPid = topoEditor.getId($rootScope.CurrentObject);
                $scope.objectName = FM.uikit.Config.getName(geoLiveType);
                var attrTmpl = FM.uikit.Config.getEditTemplate(geoLiveType);
                if (attrTmpl) {
                    $scope.indexEditTmpl = attrTmpl.tmpl;
                    $timeout(function () {
                        $scope.$broadcast('ReloadData', {
                            data: $rootScope.CurrentObject
                        });
                    });
                }

                $scope.editable = $rootScope.Editable && topoEditor.canEdit($rootScope.CurrentObject);
                $scope.deletable = topoEditor.canDelete($rootScope.CurrentObject);
                // 道路要素不可删除时，依然可以编辑
                $scope.fmFormEditable = $scope.editable;
                eventCtrl.fire('deleteIndexToToolPanel', {
                    context: $scope,
                    panelType: 'singlePanel'
                });
            }
        };

        var emitObjUpdate = function (feature) {
            $scope.$emit('ObjectUpdated', {
                feature: feature,
                updateLogs: [{
                    type: 'IXPOINTADDRESS'
                }]
            });
        };
        
        var callBackForIndex = function (indexPids, feature) {
            if (indexPids) { // 列表已打开
                var indexListSelectedPid = sessionStorage.getItem('indexListSelectedPid');
                var editingPid = objectEditCtrl.data.pid.toString();
                if (indexListSelectedPid) {
                    if (indexListSelectedPid === editingPid) {
                        eventCtrl.fire('refreshPointAddressTable');
                        if (indexPids.indexOf(editingPid) > -1 && indexPids.indexOf(editingPid) !== (indexPids.length - 1)) {
                            feature.pid = parseInt(indexPids[indexPids.indexOf(editingPid) + 1], 0);
                            sessionStorage.setItem('indexListSelectedPid', feature.pid);
                            emitObjUpdate(feature);
                        } else if (indexPids.indexOf(editingPid) === (indexPids.length - 1)) {
                            emitObjUpdate(feature);
                            swal('注意', '已经是最后一条数据了！', 'info');
                        }
                    } else { // 未从列表中选中
                        var index = indexPids.indexOf(indexListSelectedPid);
                        if (index === (indexPids.length - 1)) {
                            emitObjUpdate(feature);
                        } else {
                            var pid = indexPids[index + 1];
                            if (pid) {
                                feature.pid = pid;
                                sessionStorage.setItem('indexListSelectedPid', feature.pid);
                            }
                            emitObjUpdate(feature);
                        }
                    }
                } else {
                    emitObjUpdate(feature);
                }
            } else { // 列表未打开
                emitObjUpdate(feature);
            }
        };

        var save = function () {
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var simpleFeature;
            var changes = objectEditCtrl.data.getChanges();

            if (objectEditCtrl.data.state === 2) { // 删除状态的数据
                changes = {};
            }
            // 不修改直接点保存，能够保存，数据状态改变，跳转到下一条
            if (changes == null) {
                changes = {};
            }
            simpleFeature = new FM.dataApi.Feature({
                pid: objectEditCtrl.data.pid,
                geoLiveType: objectEditCtrl.data.geoLiveType
            });
            dsEdit.update(objectEditCtrl.data.pid, geoLiveType, changes).then(function (rest) {
                var indexPids;
                if (sessionStorage.getItem('indexPids')) {
                    indexPids = sessionStorage.getItem('indexPids').split(',');
                }
                callBackForIndex(indexPids, simpleFeature);
            });
        };

        var emitObjDelete = function (feature) {
            $scope.$emit('ObjectDeleted', {
                feature: feature,
                updateLogs: [{
                    type: 'IXPOINTADDRESS'
                }]
            });
        };

        var deleteIndex = function () {
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var simpleFeature = new FM.dataApi.Feature({
                pid: objectEditCtrl.data.pid,
                geoLiveType: objectEditCtrl.data.geoLiveType
            });
            dsEdit.delete(objectEditCtrl.data.pid, geoLiveType).then(function (rest) {
                var indexPids;
                if (sessionStorage.getItem('indexPids')) {
                    indexPids = sessionStorage.getItem('indexPids').split(',');
                }
                // 对数据删除进行时 如果是列表中的跳转到下一条 地图上选的关闭
                if (indexPids) {
                    var editPid = objectEditCtrl.data.pid.toString();
                    if (indexPids.indexOf(editPid) > -1 && indexPids.indexOf(editPid) != (indexPids.length - 1)) {
                        simpleFeature.pid = parseInt(indexPids[indexPids.indexOf(editPid) + 1], 0);
                        sessionStorage.setItem('indexListSelectedPid', simpleFeature.pid);
                        emitObjUpdate(simpleFeature);
                        eventCtrl.fire('refreshPointAddressTable');
                    } else if (indexPids.indexOf(editPid) == (indexPids.length - 1)) {
                        emitObjDelete(simpleFeature);
                        eventCtrl.fire('refreshPointAddressTable');
                        swal('注意', '已经是最后一条数据了！', 'info');
                        // getNextPage(function (pid) {
                        //     simpleFeature.pid = pid;
                        //     emitObjUpdate(simpleFeature);
                        // });
                    } else if (indexPids.indexOf(editPid) < 0) {   // 不在列表中
                        emitObjDelete(simpleFeature);
                    }
                } else {
                    emitObjDelete(simpleFeature);
                }
            });
        };

        $scope.doDelete = function () {
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            if (!topoEditor) {
                swal({
                    title: geoLiveType + '类型要素未实现删除逻辑!',
                    type: 'error',
                    allowEscapeKey: false
                });
                return;
            }
            swal({
                title: '确定要删除该' + FM.uikit.Config.Feature().getName(geoLiveType) + '吗？',
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '确定',
                confirmButtonColor: '#ec6c62'
            }, function (f) {
                if (f) {
                    deleteIndex();
                }
            });
        };

        var validateForm = function (form) {
            if (form.doValidate) {
                form.doValidate();
            }
            for (var k in form) {
                if (form.hasOwnProperty(k) && k.indexOf('$') < 0 && Utils.isObject(form[k]) && form[k].constructor.name === 'FormController') {
                    validateForm(form[k]);
                }
            }
        };

        var showInfo = function () {
            var forms = objectEditCtrl.data.getErrors().form;
            var edits = objectEditCtrl.data.getErrors().edit;
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
            if (objectEditCtrl.data.state != 2) { // 删除状态的数据不进行验证
                validateForm($scope.indexForm);
                if ($scope.indexForm.$invalid) {
                    swal('注意', '属性输入有错误，请检查！', 'error');
                    return;
                }
                if (!objectEditCtrl.data.validate()) {
                    showInfo();
                    return;
                }
            }
            save();
        };
        $scope.$on('IndexRightEditPanelReload', initialize);
    }
]);
