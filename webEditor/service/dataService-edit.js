/**
 * 编辑相关的数据接口配置
 */

angular.module('dataService').service('dsEdit', ['$http', '$q', 'ajax', 'dsOutput', function ($http, $q, ajax, dsOutput) {
    /**
     * add by chenx on 2016-10-19，用于控制主页面loadingbar的显示/隐藏
     */
    var showLoading; // 主页面控制Loading的开关的引用
    // 利用对象引用的特性，将本地变量showLoading指向主scope中的控制loadingbar显隐的开关对象
    // 主页面初始化的时候绑定一次即可
    this.referenceLoadingSwitch = function (loadingSwitch) {
        showLoading = loadingSwitch;
    };
    // 私有函数，修改loadingbar开关的状态
    var toggleLoading = function (flag) {
        if (showLoading) {
            showLoading.flag = flag;
        }
    };
    /**
     * 根据pid获取要素详细属性
     * @param {Number} pid     要素PID
     * @param {Object} type   要素类型
     * @param {Number} dbId     要素dbid
     * @param {String} alertError   是否弹出错误信息
     * @return {Promise} defer.promise
     */
    this.getByPid = function (pid, type, dbId, alertError) {
        var defer = $q.defer();
        var params = {
            dbId: dbId || App.Temp.dbId,
            type: type,
            pid: pid
        };
        if (alertError === undefined) {
            alertError = true;
        }
        ajax.get('edit/getByPid', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                if (alertError) {
                    swal('根据Pid查询' + type + '数据出错：', data.errmsg, 'error');
                }
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据pids获取要素详细属性
     * @param {Number} pids     要素PID
     * @param {Object} type   要素类型
     * @param {String} alertError   是否弹出错误信息
     * @return {Promise} defer.promise
     */
    this.getByPids = function (pids, type, alertError) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: type,
            pids: pids
        };
        if (alertError === undefined) {
            alertError = true;
        }
        ajax.get('edit/getByPids', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode === 0) {
                defer.resolve(data.data);
            } else {
                if (alertError) {
                    swal('根据Pids查询' + type + '数据出错：', data.errmsg, 'error');
                }
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据道路id获得分歧的详细属性(branchType = 0、1、2、3、4、6、8、9)
     * @param {Number} detailId     分歧的DetailId
     * @param {Object} branchType   分歧类型
     * @param {Number} dbId 分歧id
     * @return {Promise} defer.promise
     */
    this.getBranchByDetailId = function (detailId, branchType, dbId) {
        var defer = $q.defer();
        var params = {
            dbId: dbId || App.Temp.dbId,
            type: 'RDBRANCH',
            detailId: detailId,
            rowId: '',
            branchType: branchType
        };
        ajax.get('edit/getByPid', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                data.data.branchType = branchType;
                defer.resolve(data.data);
            } else {
                swal('查询分歧数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据道路id获得分歧的详细属性(branchType = 5、7)
     * @param {Number} rowId     分歧的rowId
     * @param {Object} branchType   分歧类型
     * @param {Number} dbId 分歧id
     * @return {Promise} defer.promise
     */
    this.getBranchByRowId = function (rowId, branchType, dbId) {
        var defer = $q.defer();
        var params = {
            dbId: dbId || App.Temp.dbId,
            type: 'RDBRANCH',
            detailId: 0,
            rowId: rowId,
            branchType: branchType
        };
        ajax.get('edit/getByPid', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                data.data.branchType = branchType;
                defer.resolve(data.data);
            } else {
                swal('查询分歧数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 根据接口getByCondition获取相关数据
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.getByCondition = function (param) {
        if (param) {
            param.dbId = param.dbId || App.Temp.dbId;
        }
        var defer = $q.defer();
        ajax.get('edit/getByCondition', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('根据条件查询数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 消息推送
     * @return {Promise} defer.promise
     */
    this.getMsgNotify = function () {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/unread/get', {
            parameter: ''
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('消息推送查询出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取poi列表*/
    this.getPoiList = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            type: 1,
            pageNum: 0,
            pageSize: 0,
            pidName: ''
        };
        var params = $.extend(param, options);
        ajax.get('editrow/poi/base/list', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询POI列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取poi筛选列表*/
    this.getPoiFilterList = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            pageNum: 0,
            pageSize: 0
        };
        var params = $.extend(param, options);
        ajax.get('editrow/poi/filter/list', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询POI筛选列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取点门牌数据列表*/
    this.getPointAddressList = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            status: 1,
            pageNum: 0,
            pageSize: 0,
            pidName: ''
        };
        var params = $.extend(param, options);
        ajax.get('editrow/pointaddress/base/list', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询点门牌数据列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取深度信息质检问题属性*/
    this.getInitValueForDeepInfo = function (pid) {
        var defer = $q.defer();
        var params = {
            pid: pid,
            subtaskId: App.Temp.subTaskId,
            secondWorkItem: App.Temp.monthTaskType,
            firstWorkItem: 'poi_deep'
        };
        ajax.get('editcolumn/poi/deep/qcProblemInit', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询深度信息质检问题属性出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 查询深度信息质检问题列表*/
    this.queryQcProblemList = function (params) {
        var defer = $q.defer();
        ajax.get('editcolumn/poi/deep/qcProblemList', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询深度信息质检问题列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 深度信息质检问题新增、编辑、删除*/
    this.deepInfoOperateProblem = function (params) {
        var defer = $q.defer();
        var operateText = {
            DELETE: '删除',
            ADD: '新增',
            UPDATE: '修改'
        };
        ajax.post('editcolumn/poi/deep/operateProblem', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal(operateText[params.command] + '深度信息质检问题出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取质检问题属性*/
    this.getInitValueForProblem = function (pid) {
        var defer = $q.defer();
        var params = {
            pid: pid,
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId
        };
        ajax.get('editrow/qc/queryInitValueForProblem', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询质检问题属性出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取质检元数据*/
    this.queryQualityRelation = function () {
        var defer = $q.defer();
        ajax.get('editrow/qc/queryQualityRelation', {}).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询质检元数据出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 查询质检问题列表*/
    this.queryProblemList = function (params) {
        var defer = $q.defer();
        ajax.get('editrow/qc/queryProblemList', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询质检问题列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 质检问题新增、编辑、删除*/
    this.operateProblem = function (params) {
        var defer = $q.defer();
        var operateText = {
            DELETE: '删除',
            ADD: '新增',
            UPDATE: '修改'
        };
        ajax.post('editrow/qc/operateProblem', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal(operateText[params.command] + '质检问题出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 获取检查结果
    this.getCheckData = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            subtaskType: App.Temp.taskType,
            grids: App.Temp.gridList,
            pageSize: 15,
            pageNum: 1,
            level: 0,
            ruleId: '',
            flag: 0 // 0:未处理，1:例外，2:确认
        };
        var params = $.extend(param, options);
        ajax.get('edit/check/list', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查找检查结果信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 获取检查结果
    this.getPoiCheckListData = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            pageSize: 15,
            pageNum: 1,
            sortby: ''
        };
        var params = $.extend(param, options);
        ajax.get('edit/check/listPoiResults/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查找检查结果信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 点门牌 获取检查结果 接口
     * @method getPointAddressListData
     * @author LiuZhe
     * @date   2017-09-27
     * @param {object} options 自定义对象
     * @return {object} promise
     */
    this.getPointAddressListData = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            pageSize: 15,
            pageNum: 1,
            sortby: ''
        };
        var params = $.extend(param, options);
        ajax.get('edit/check/listPointAddressResults/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查找检查结果信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 获取POI检查结果
     * @param {Number} poiPid 要素id
     * @param {Object} checkType  DEEP - 深度信息、POI_ROW_COMMIT - poi日编
     * @return {Promise} defer.promise
     */
    this.getPoiCheckData = function (poiPid, checkType) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            pid: poiPid,
            checkType: checkType
        };
        ajax.get('edit/check/poiResults', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询POI的检查结果出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取检查结果条数*/
    this.getCheckDataCount = function () {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            grids: App.Temp.gridList
        };
        ajax.get('edit/check/count', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('查找检查结果条数出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    // 更新检查状态
    this.updateCheckStatus = function (checkResultId, oldStatus, newStatus) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            oldType: oldStatus,
            type: newStatus, // 0:未处理，1:例外，2: 确认不修改，3:确认已修改
            id: checkResultId
        };
        if (App.Temp.taskType === 3 || App.Temp.taskType === 4) {
            params.isQuality = App.Temp.qcTaskFlag ? 1 : 0;
        }
        ajax.post('edit/check/update', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
                dsOutput.push({
                    op: '更新ID为 ' + checkResultId + ' 的检查结果状态操作成功',
                    type: 'succ',
                    pid: 0,
                    childPid: ''
                });
            } else {
                dsOutput.push({
                    op: '更新ID为 ' + checkResultId + ' 的检查结果状态操作失败，失败原因：' + data.errmsg,
                    type: 'fail',
                    pid: 0,
                    childPid: ''
                });
                swal('更新检查结果状态出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 保存道路检查质检信息;
     * @param {Object} entity 点击
     * @param {Boolean} newStatus 新建状态
     * @param {Object} dataObj 数据对象
     * @return {Promise} defer.promise
     */
    this.qaUpdateSaveProblem = function (entity, newStatus, dataObj) {
        var defer = $q.defer();
        dataObj.logId = entity.pid;
        var params = {
            dbId: App.Temp.dbId,
            oldType: entity.status,
            type: newStatus,
            id: entity.pid,
            isQuality: App.Temp.qcTaskFlag ? 1 : 0,
            data: dataObj
        };
        ajax.post('edit/check/qaUpdateSaveProblem', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
                dsOutput.push({
                    op: '更新ID为 ' + entity.pid + ' 的检查质检信息操作成功',
                    type: 'succ',
                    pid: 0,
                    childPid: ''
                });
            } else {
                dsOutput.push({
                    op: '更新ID为 ' + entity.pid + ' 的检查质检信息，失败原因：' + data.errmsg,
                    type: 'fail',
                    pid: 0,
                    childPid: ''
                });
                swal('更新检查质检信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 更新道路检查质检状态;
     * @param {Object} entity 点击
     * @param {Boolean} newStatus 新建状态
     * @return {Promise} defer.promise
     */
    this.updateRoadQualityStatus = function (entity, newStatus) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            checkStatus: parseInt(entity.status, 10),
            qaStatus: newStatus,
            md5Code: entity.pid
        };
        ajax.post('edit/check/updateQaStatus', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
                dsOutput.push({
                    op: '更新ID为 ' + entity.pid + ' 的检查质状态作成功',
                    type: 'succ',
                    pid: 0,
                    childPid: ''
                });
            } else {
                dsOutput.push({
                    op: '更新ID为 ' + entity.pid + ' 的检查质检状态失败，失败原因：' + data.errmsg,
                    type: 'fail',
                    pid: 0,
                    childPid: ''
                });
                swal('更新检查质检状态出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 创建对象
     * @param {Object} type 种类
     * @param {Object} data 数据
     * @return {function} save
     */
    this.create = function (type, data) {
        var param = {
            command: 'CREATE',
            dbId: App.Temp.dbId,
            type: type,
            data: data
        };
        return this.save(param);
    };

    /** *
     * 修改对象属性
     * @param {Number} pid 要素id
     * @param {Object} type 种类
     * @param {Object} data 数据
     * @return {function} save
     */
    this.update = function (pid, type, data) {
        var param = {
            command: 'UPDATE',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };

    this._delete = function (param, infect) {
        var temp = {};
        if (infect) {
            temp.infect = 1;
        }
        var newParam = FM.extend({}, param, temp);
        var that = this;
        var defer = $q.defer();
        this.save(newParam).then(function (data) {
            if (data) {
                if (infect) {
                    var html = [];
                    var tmp;
                    var test = data.result;

                    for (var key in test) {
                        if (!test.hasOwnProperty(key)) {
                            continue;
                        }
                        html.push("<p style='text-align:left;font-weight:bold;'>" + key + '：</p>');
                        tmp = test[key];
                        html.push("<ul style='text-align:left;padding:5px 25px;margin:0px;list-style-type:decimal;'>");
                        for (var i = 0; i < tmp.length; i++) {
                            html.push('<li>' + tmp[i].objType + '|' + tmp[i].pid + '|' + tmp[i].status + '</li>');
                        }
                        html.push('</ul>');
                    }
                    // by liwanchong:加上setTimeout是为了解决在mac下不能正常提示的问题
                    setTimeout(function () {
                        swal({
                            title: '以下操作将会执行，是否继续？',
                            text: html.join(''),
                            html: true,
                            showCancelButton: true,
                            allowEscapeKey: false,
                            confirmButtonText: '是的，我要删除',
                            confirmButtonColor: '#ec6c62'
                        }, function (f) {
                            if (f) { // 执行删除操作
                                that.save(param).then(function (da) {
                                    defer.resolve(da);
                                });
                            } else { // 取消删除
                                defer.resolve(null);
                            }
                        });
                    }, 1000);
                } else {
                    defer.resolve(data);
                }
            } else { // 服务端返回错误信息，结束执行
                defer.resolve(null);
            }
        });

        return defer.promise;
    };

    /**
     * 删除要素
     * @param {Number} pid          要素PID
     * @param {Object} type   要素类型
     * @param {Object} infect       前检查标识，为1时表示要进行删除前的检查，确认要执行删除操作后，再执行具体的删除操作；
     不传或为0时表示直接执行删除操作
     * @return {function} delete
     */
    this.delete = function (pid, type, infect) {
        var param = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid
        };

        return this._delete(param, infect);
    };

    /**
     * 批量删除要素
     * @param {Number} pids         要素PID
     * @param {Object} type   要素类型
     * @param {Object} infect       前检查标识，为1时表示要进行删除前的检查，确认要执行删除操作后，再执行具体的删除操作；
     不传或为0时表示直接执行删除操作
     *@return {function} delete
     */
    this.BatchDelete = function (pids, type, infect) {
        var param = {
            command: 'BATCHDELETE',
            dbId: App.Temp.dbId,
            type: type,
            objIds: pids
        };

        return this._delete(param, infect);
    };

    /**
     * 根据道路rowId获得分歧的详细属性(branchType = 5、7)
     * @param {Number} detailid         要素ID
     * @param {Object} branchType   要素类型
     * @param {Object} infect       前检查标识，为1时表示要进行删除前的检查，确认要执行删除操作后，再执行具体的删除操作；
     不传或为0时表示直接执行删除操作
     *@return {function} delete
     */
    this.deleteBranchByRowId = function (detailid, branchType, infect) {
        var defer = $q.defer();
        var params = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: 'RDBRANCH',
            detailId: 0,
            rowId: detailid,
            branchType: branchType
        };

        return this._delete(params, infect);
    };
    /**
     * 根据道路detailId获得分歧的详细属性(branchType = 除了5、7)
     * @param {Number} detailid         要素ID
     * @param {Object} branchType   要素类型
     * @param {Object} infect       前检查标识，为1时表示要进行删除前的检查，确认要执行删除操作后，再执行具体的删除操作；
     不传或为0时表示直接执行删除操作
     *@return {function} delete
     */
    this.deleteBranchByDetailId = function (detailid, branchType, infect) {
        var defer = $q.defer();
        var params = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: 'RDBRANCH',
            detailId: detailid,
            rowId: '',
            branchType: branchType
        };

        return this._delete(params, infect);
    };
    /** *
     * 移动点要素位置
     * 适用于rdnode，adNode，poi等
     * @param {Number} pid         要素ID
     * @param {Object} type   要素类型
     * @param {Object} data   数据
     * @return {function} save
     */
    this.move = function (pid, type, data) {
        var param = {
            command: 'MOVE',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };
    /** *
     * 线要素修形
     * 适用于rdlink、adlink等
     * @param {Number} pid         要素ID
     * @param {Object} type   要素类型
     * @param {Object} data   数据
     * @return {function} save
     */
    this.repair = function (pid, type, data) {
        var param = {
            command: 'REPAIR',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };

    /** *
     * 打断link
     * 适用于rdlink、adlink等
     * @param {Number} pid         要素ID
     * @param {Object} type   要素类型
     * @param {Object} data   数据
     * @return {function} save
     */
    this.break = function (pid, type, data) {
        var param = {
            command: 'BREAK',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };
    /** *
     * poi要素创建父poi
     * @param {Number} pid         要素ID
     * @param {Number} newParentPid   父要素id
     * @return {function} save
     */
    this.createParent = function (pid, newParentPid) {
        var param = {
            command: 'CREATE',
            dbId: App.Temp.dbId,
            type: 'IXPOIPARENT',
            objId: pid,
            parentPid: newParentPid
        };
        return this.save(param);
    };
    /** *
     * poi要素修改父poi
     * @param {Number} pid         要素ID
     * @param {Number} newParentPid   父要素id
     * @return {function} save
     */
    this.updateParent = function (pid, newParentPid) {
        var param = {
            command: 'UPDATE',
            dbId: App.Temp.dbId,
            type: 'IXPOIPARENT',
            objId: pid,
            parentPid: newParentPid
        };
        return this.save(param);
    };
    /** *
     * poi要素删除父poi
     * @param {Number} pid         要素ID
     * @return {function} save
     */
    this.deleteParent = function (pid) {
        var param = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: 'IXPOIPARENT',
            objId: pid
        };
        return this.save(param);
    };
    this.updateTopo = function (pid, type, data) {
        var param = {
            command: 'UPDATETOPO',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };
    /** *
     * 属性和几何编辑相关 editGeometryOrProperty
     * @param {Object} param 获取参数
     * @param {function} func 执行函数
     * @return {Promise} defer.promise
     */
    this.save = function (param) {
        toggleLoading(true); // 打开主页面的loadingbar
        var opDesc = {
            CREATE: '创建' + [param.type],
            UPDOWNDEPART: '创建上下线分离',
            BREAK: '打断' + [param.type],
            UPDATE: '更新' + [param.type] + '属性',
            DELETE: '删除' + [param.type],
            MOVE: '移动' + [param.type] + '点位',
            BATCH: '批量操作' + [param.type],
            REPAIR: [param.type] + '修形',
            CREATEPARENT: 'POI增加父',
            UPDATEPARENT: 'POI更新父',
            DELETEPARENT: 'POI解除父',
            UPDATETOPO: '更新' + [param.type] + '拓扑',
            DEPART: '分离节点'
        }[param.command];
        if (param.type == 'IXPOI' && param.data) { // poi属性不修改也可进行保存，所以需要进行特殊处理
            var keys = Object.keys(param.data);
            if (keys.length == 3 && param.data.rowId && param.data.objStatus && param.data.pid) {
                opDesc = param.type;
            }
        }
        if (param.command === 'UPDATETOPO') {
            param.command = 'UPDATE';
        }
        if (!param.dbId) {
            param.dbId = App.Temp.dbId;
        }
        if (!param.subtaskId) {
            param.subtaskId = App.Temp.subTaskId;
        }
        // 批量编辑使用
        var url = 'edit/run/';
        if (param.type == 'IXPOI' || param.type == 'IXPOIPARENT' || param.type == 'IXSAMEPOI') {
            url = 'editrow/run/';
        } else if (param.type == 'IXPOINTADDRESS') {
            url = 'editrow/index/rowDataSave/';
        }
        param = JSON.stringify(param);
        var defer = $q.defer();
        ajax.post(url, {
            parameter: param // .replace(/\+/g, '%2B')
        }).success(function (data) {
            if (data.errcode == 0) { // 操作成功
                defer.resolve(data.data);
            } else if (data.errcode == 999) { // 删除前的检查返回的确认信息
                defer.resolve(data.data);
            } else if (data.errcode < 0) { // 操作失败
                // swal(opDesc + "操作出错：", data.errmsg, "error");
                swal({
                    title: opDesc + '操作出错：',
                    text: data.errmsg,
                    type: 'error',
                    // timer: 2000,
                    // showConfirmButton: false,
                    allowEscapeKey: false
                }, function () {
                    defer.resolve(null);
                });
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };
    /** *
     * 申请Pid
     * @param {Object} type 类型
     * @return {Promise} defer.promise
     */
    this.applyPid = function (type) {
        var defer = $q.defer();
        ajax.get('edit/applyPid', {
            parameter: JSON.stringify({
                type: type
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('申请Pid出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 执行检查信息
     * @param {Object} checkType 检查类型
     * @return {Promise} defer.promise
     */
    this.runCheck = function (checkType) {
        var defer = $q.defer();
        toggleLoading(true);
        var params = {
            subtaskId: App.Temp.subTaskId,
            dbId: App.Temp.dbId,
            checkType: checkType // 9poi行编，1poi精编, 2道路，6点门牌
        };
        ajax.post('edit/check/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                defer.resolve('执行检查信息出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };
    /**
     * POI提交接口
     * @param {Object} param 类型
     * @return {Promise} defer.promise
     */
    this.submitPoi = function () {
        var defer = $q.defer();
        toggleLoading(true);
        var params = {
            dbId: App.Temp.dbId,
            gridIds: App.Temp.gridList,
            subtaskId: App.Temp.subTaskId
        };
        ajax.post('editrow/poi/base/release', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('提交出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };

    /**
     * 点门牌 提交接口
     * @method submitPointAddress
     * @author LiuZhe
     * @date   2017-09-27
     * @return {object} promise
     */
    this.submitPointAddress = function () {
        var defer = $q.defer();
        toggleLoading(true);
        var params = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId
        };
        ajax.post('editrow/pointaddress/release', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('提交出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };

    /**
     * 创建后台任务
     * @param {Object} jobType 工作类型
     * @param {Object} requestParam 要求要素
     * @param {Number} jobId 工作id
     * @returns {Promise} defer.promise
     */
    this.createJob = function (jobType, requestParam) {
        var defer = $q.defer();
        ajax.post('job/create/', {
            parameter: JSON.stringify({
                jobType: jobType,
                request: requestParam
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('创建后台任务失败：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 查询后台任务进度
     * @param {Number} jobId 工作id
     * @returns {Promise} defer.promise
     */
    this.getJobById = function (jobId) {
        var defer = $q.defer();
        ajax.get('job/get/', {
            parameter: JSON.stringify({
                jobId: jobId
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('查看后台任务进度失败：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 批量查询后台任务进度
     * @param {Number} jobIds 工作ids
     * @returns {Promise} defer.promise
     */
    this.getByJobIds = function (jobIds) {
        var defer = $q.defer();
        ajax.get('job/getByJobIds/', {
            parameter: JSON.stringify({
                jobIds: jobIds
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('查看后台任务进度失败：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 普通搜索;
    this.normalSearch = function (param) {
        var params = {
            dbId: App.Temp.dbId,
            pageNum: param.pageNum,
            pageSize: param.pageSize,
            data: param.data,
            type: param.type
        };
        return this.getSearchData(params);
    };
    // 搜索
    this.getSearchData = function (params) {
        var defer = $q.defer();
        ajax.post('edit/getByElementCondition', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('搜索信息出错：', data.errmsg, 'error');
                defer.resolve(0);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 查询主表节点信息
    this.getAllTableInfos = function () {
        var param = { searchType: 'PARENT_TABLE_LABLE' };
        return this.searchForTable(param);
    };

    // 查询表节点信息
    this.getTableNodeInfos = function (param) {
        var params = {
            searchType: 'TABLE_LABLE',
            tableName: param
        };
        return this.searchForTable(params);
    };

    // 查询表信息
    this.getTableInfos = function (param) {
        var params = {
            searchType: 'TABLE_INFO',
            tableName: param
        };
        return this.searchForTable(params);
    };

    this.searchForTable = function (params) {
        var defer = $q.defer();
        ajax.get('edit/getGeoLiveInfo', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询主表信息出错', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 面批处理;
    this.PolygonBatchWork = function (params) {
        var defer = $q.defer();
        var param = {
            command: 'ONLINEBATCH',
            type: 'FACE',
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            pid: params.pid,
            ruleId: params.ruleId
        };
        ajax.get('edit/run', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查看后台任务进度失败：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 搜索批处理包;
    this.getBatchRules = function (params) {
        var defer = $q.defer();
        var param = {
            pageSize: params.pageNumber,
            pageNum: params.currentPage,
            type: params.batchType
        };
        ajax.get('edit/batch/getBatchRules', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('搜索信批处理包出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 执行批处理;
    this.exeOnlineBatch = function (params) {
        var defer = $q.defer();
        toggleLoading(true);
        var param = {
            subtaskId: params.taskId,
            dbId: App.Temp.dbId,
            batchRules: params.ruleCode,
            batchType: params.type
        };
        ajax.get('edit/batch/run', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('执行批处理出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };
    // 搜索檢查;
    this.getCheckRules = function (params) {
        var defer = $q.defer();
        var param = {
            pageSize: params.pageNumber,
            pageNum: params.currentPage,
            type: params.checkType
        };
        ajax.get('edit/check/getCkRules', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('搜索信批处理包出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 执行检查
    this.exeOnlineCheck = function (checkType, ruleIds) {
        var defer = $q.defer();
        toggleLoading(true);
        var param = {
            subtaskId: App.Temp.subTaskId,
            dbId: App.Temp.dbId,
            ckRules: ruleIds.join(','),
            checkType: checkType
        };
        ajax.post('edit/check/run', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('执行检查出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };

    // 根据检查类型获取检查规则包
    this.getCheckRuleSuites = function (checkType) {
        var defer = $q.defer();
        var param = {
            type: checkType
        };
        ajax.get('edit/check/getCkSuites', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询检查规则包出错', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    // 根据检查规则包Id获取检查规则
    this.getCheckRulesBySuiteId = function (suiteId, ruleCode) {
        var defer = $q.defer();
        var param = {
            suiteId: suiteId,
            ruleCode: ruleCode
        };
        ajax.get('edit/check/getCkRulesBySuiteId', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询检查规则出错', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 根据矩形框获取数据
     * @param {Object} params 获取要素
     * @returns {Promise} defer.promise
     */
    this.queryBySpatial = function (params) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            types: params.types,
            wkt: params.wkt
        };
        ajax.get('edit/getBySpatial', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('根据几何框获取数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 道路名库檢查;
     * @param {Object} options 获取要素
     * @param {Number} num   listRdnResult
     * @returns {Promise} defer.promise
     */
    this.getRoadNameCheckResult = function (options) {
        var defer = $q.defer();
        var param = {
            subtaskId: App.Temp.subTaskId,
            pageSize: 5,
            pageNum: 1,
            type: 5,
            jobId: 0
        };
        var params = $.extend(param, options);
        ajax.get('edit/check/listRdnResultByJobId/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询检查结果出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 修改道路名库检查结果状态
     * @param {Number} id id
     * @param {Object} type type
     * @returns {Promise} defer.promise
     */
    this.updateRdNCheckType = function (id, type) {
        var defer = $q.defer();
        toggleLoading(true);
        var param = {
            id: id,
            type: type
        };
        ajax.get('edit/check/updateRdnResult/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(1);
            } else {
                swal('修改检查结果状态出错：', data.errmsg, 'error');
                defer.resolve(0);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };
    /* 查询全部消息*/
    this.getListAll = function () {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/listAll', {}).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** ***************************** TMC相关  *********************************/
    /** *
     * 框选TMCPOINT查询TMC关系树
     * @param {Object} param 获取要素
     * @returns {Promise} defer.promise
     */
    this.queryTmcTree = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryTmcTreeByIds', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('根据条件查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 查询历史消息*/
    this.getListHistory = function (num, size) {
        var defer = $q.defer();
        var param = {
            pageNum: num,
            pageSize: size
        };
        ajax.get('sys/sysmsg/listHistory', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 根据pids获取TMCLocation详细属性
     * @param {Number} pids     要素PID
     * @param {String} alertError   是否弹出错误信息
     * @returns {Promise} defer.promise
     */
    this.getTmcLocatoinByPids = function (pids, alertError) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: 'RDTMCLOCATION',
            pids: pids
        };
        if (alertError === undefined) {
            alertError = true;
        }
        ajax.get('edit/getByPids', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                if (alertError) {
                    swal('根据Pid查询RDTMCLOCATION数据出错：', data.errmsg, 'error');
                }
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 根据子任务Id和Job类型，查询正在执行中的job信息
     * @param {Object} jobType     job类型
     * @param {Number} pids     要素PID
     * @param {String} alertError   是否弹出错误信息
     * @returns {Promise} defer.promise
     */
    this.getRunningJobByTask = function (jobType) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.subTaskId,
            jobType: jobType
        };

        ajax.get('job/getByTask', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询正在执行的Job信息失败', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 根据检查类型获取检查规则包
    this.getCheckRuleSuites = function (checkType, flag) {
        var defer = $q.defer();
        var param = {
            type: checkType,
            flag: flag
        };
        ajax.get('edit/check/getCkSuites', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询检查规则包出错', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    // 根据poi的显示坐标，查询所属行政区划的电话区号
    this.getTelephone = function (coordinates) {
        var defer = $q.defer();
        var param = {
            geoX: coordinates[0],
            geoY: coordinates[1]
        };
        ajax.get('editrow/crowds/getTelephone', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0 && !Utils.isEmptyObject(data.data)) {
                defer.resolve(data.data);
            } else {
                swal('电话区号查询失败', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 获取批量翻译历史列表
     * @method getTranslateList
     * @param {object} obj - 对象包含pageSize和pageNum
     * @returns {Promise}.
     */
    this.getTranslateList = function (obj) {
        var defer = $q.defer();
        var param = {
            pageSize: obj.pageSize,
            pageNum: obj.pageNum
        };
        ajax.post('edit/translate/list', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('翻译历史列表查询出错', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 子任务批量关闭
     * @param {Object} param 获取要素
     * @method batchCloseSubTask
     * @param {object} obj - 对象包含pageSize和pageNum
     * @returns {Promise}.
     */
    this.batchCloseSubTask = function (param) {
        var defer = $q.defer();
        var params = {
            subtaskList: param.subtaskList,
            subtaskType: param.subtaskType
        };
        ajax.post('edit/batchCloseSubTask', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('执行批量关闭出错', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 检测本地 node 服务，是否已经启动
     * @method testLocalService
     * @returns {Promise}.
     */
    this.testLocalService = function () {
        var defer = $q.defer();

        ajax.localGet('testStart').success(function () {
            defer.resolve();
        }).error(function (rejection, status) {
            if (status === 0) {
                swal('本地TrackViewer服务程序未启动，请先启动');
            }
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 查询本地轨迹照片目录信息
     * @method getDirectoryInfo
     * @returns {Promise}.
     */
    this.getDirectoryInfo = function () {
        var defer = $q.defer();

        ajax.localGet('business/list').success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取数据失败', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 查询索引目录中的照片信息
     * @method getPhotosByIndex
     * @param {object} params 查询参数
     * @returns {Promise}.
     */
    this.getPhotosByIndex = function (params) {
        var defer = $q.defer();

        ajax.localGet('business/queryNodeDetail', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取数据失败', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 驱动本地 node 服务，将当前浏览的照片，上传至 editor 服务器
     * @method uploadPhoto
     * @param {object} param 上传需要用到的信息
     * @returns {Promise}.
     */
    this.uploadPhoto = function (param) {
        var defer = $q.defer();

        ajax.localPost('business/uploadImage', param).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('图片上传失败', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);
