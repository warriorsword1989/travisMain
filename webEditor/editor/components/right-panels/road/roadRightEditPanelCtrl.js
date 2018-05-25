/**
 * Created by zhaohang on 2016/11/29.
 */

angular.module('app').controller('RoadRightEditPanelCtrl', ['$scope', '$rootScope', '$timeout', 'dsEdit',
    function ($scope, $rootScope, $timeout, dsEdit) {
        var objectEditCtrl = FM.uikit.ObjectEditController();
        var eventCtrl = fastmap.event.EventController.getInstance();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        var topoEditor = null;
        $scope.deletable = true;

        var initialize = function () {
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
                    $scope.roadEditTmpl = attrTmpl.tmpl;
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
                eventCtrl.fire('deleteRoadToToolPanel', {
                    context: $scope,
                    panelType: 'singlePanel'
                });
            }
        };

        var save = function () {
            var geoLiveType = objectEditCtrl.data.geoLiveType;

            if (!topoEditor) {
                swal({
                    title: geoLiveType + '类型要素未实现保存属性逻辑!',
                    type: 'error',
                    allowEscapeKey: false
                });
                return;
            }

            $scope.showLoading();

            var simpleFeature = new FM.dataApi.Feature({
                pid: objectEditCtrl.data.pid,
                geoLiveType: objectEditCtrl.data.geoLiveType
            });
            topoEditor.updateChanges(objectEditCtrl.data)
                .then(function (res) {
                    $scope.hideLoading();
                    if (res === '属性无变化') {
                        swal('无任何修改，不需要保存！', null, 'info');
                        return;
                    }

                    //  线限速、 条件线限速制作工具会用到relatedLinks
                    if (res.relatedLinks) {
                        simpleFeature.relatedLinks = res.relatedLinks;
                    }

                    $scope.$emit('ObjectUpdated', {
                        feature: simpleFeature,
                        updateLogs: res.log
                    });

                    // angular在这里可能找不到北了，需要强制执行一下
                    // $scope.$apply();
                })
                .catch(function (err) {
                    swal({
                        title: err,
                        type: 'error',
                        allowEscapeKey: false
                    });
                    $scope.hideLoading();
                    // angular在这里可能找不到北了，需要强制执行一下
                    $scope.$apply();
                });
        };

        var deleteConfirmInfoToHtml = function (info) {
            var html = [];
            for (var key in info) {
                if (!info.hasOwnProperty(key)) {
                    continue;
                }
                html.push("<p style='text-align:left;font-weight:bold;'>" + key + '：</p>');
                var tmp = info[key];
                html.push("<ul style='text-align:left;padding:5px 25px;margin:0px;list-style-type:decimal;'>");
                for (var i = 0; i < tmp.length; i++) {
                    html.push('<li>' + tmp[i].objType + '|' + tmp[i].pid + '|' + tmp[i].status + '</li>');
                }
                html.push('</ul>');
            }
            return html;
        };

        var setTimeOutPromise = function (value) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve();
                }, value);
            });
        };

        var swalPromise = function (params) {
            return new Promise(function (resolve, reject) {
                swal(params,
                    function (value) {
                        if (value) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
            });
        };

        $scope.doDelete = function () {
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var simpleFeature = new FM.dataApi.Feature({
                pid: objectEditCtrl.data.pid,
                geoLiveType: objectEditCtrl.data.geoLiveType
            });

            if (!topoEditor) {
                swal({
                    title: geoLiveType + '类型要素未实现删除逻辑!',
                    type: 'error',
                    allowEscapeKey: false
                });
                return;
            }

            $scope.showLoading();
            var html = null;
            topoEditor.queryDeleteConfirmInfo(objectEditCtrl.data)
                .then(function (res) {
                    html = deleteConfirmInfoToHtml(res.result);

                    return setTimeOutPromise(1000);
                })
                .then(function (res) {
                    return swalPromise({
                        title: '以下操作将会执行，是否继续？',
                        text: html.join(''),
                        html: true,
                        showCancelButton: true,
                        allowEscapeKey: false,
                        confirmButtonText: '是的，我要删除',
                        confirmButtonColor: '#ec6c62'
                    });
                })
                .then(function (res) {
                    if (res) {
                        return topoEditor
                            .delete(objectEditCtrl.data)
                            .catch(function (err) {
                                //  modifyBy   刘哲
                                //  删除失败时，弹出框时有时无，放到延时函数里，问题未复现，暂时这样修改，观察一下
                                //  原因猜测：在后一个then()中调用hideLoading()，触发了swal重新计算弹出框的位置样式的方法
                                $timeout(function () {
                                    swal({
                                        title: err,
                                        type: 'error',
                                        allowEscapeKey: false
                                    });
                                }, 200);
                                return null;
                            });
                    }
                    return null;
                })
                .then(function (res) {
                    if (res) {
                        $scope.$emit('ObjectDeleted', {
                            feature: simpleFeature,
                            updateLogs: res.log
                        });
                    }
                    $scope.hideLoading();
                    // angular在这里可能找不到北了，需要强制执行一下
                    $scope.$apply();
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
            validateForm($scope.roadForm);
            if ($scope.roadForm.$invalid) {
                swal('注意', '属性输入有错误，请检查！', 'error');
                return;
            }

            if (!objectEditCtrl.data.validate()) {
                showErrorInfo(objectEditCtrl.data.getErrors());
                return;
            }

            save();
        };

        $scope.$on('RoadRightEditPanelReload', initialize);
    }
]);
