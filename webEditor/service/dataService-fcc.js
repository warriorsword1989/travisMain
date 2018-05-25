/**
 * fcs相关的数据接口配置
 */

angular.module('dataService').service('dsFcc', ['$http', '$q', 'ajax', 'dsOutput', function ($http, $q, ajax, dsOutput) {
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
    /** *
     * 根据getStats接口获取相关数据
     * @param {Number} workStatus 0：待作业；1: 有问题； 2：已完成；9：全部
     * @return {Promise} defer.promise
     */
    this.getTipsStatics = function (workStatus) {
        var defer = $q.defer();
        var params = {
            subtaskId: App.Temp.subTaskId,
            dbId: App.Temp.dbId,
            mdFlag: App.Temp.mdFlag,
            workStatus: workStatus
        };
        ajax.post('fcc/tip/getStats', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getTipsListData = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            programType: parseInt(App.Temp.programType, 10),
            pageSize: 20,
            pageNum: 1,
            order: ''
        };
        var params = $.extend(param, options);
        ajax.get('fcc/tip/exportGps/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查找tips信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getPoiDataByTips = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            programType: parseInt(App.Temp.programType, 10)
        };
        var params = $.extend(param, options);
        ajax.get('fcc/tip/poiRelateTips/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查找poi信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getPointaddressDataByTips = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            programType: parseInt(App.Temp.programType, 10)
        };
        var params = $.extend(param, options);
        ajax.get('fcc/tip/pointAddrRelateTips/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查找点门牌信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 查询该要素下tips列表信息*/
    this.getTipsListItems = function (workStatus, tipCode) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            mdFlag: App.Temp.mdFlag,
            workStatus: workStatus,
            type: tipCode
        };
        ajax.get('fcc/tip/getSnapshot', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
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
     * 根据rowkey获取单个tips详细属性
     * @param {Object} rowkey row关键字
     * @param {String} alertError 错误信息
     * @return {Promise} defer.promise
     */
    this.getByRowkey = function (rowkey, alertError) {
        var defer = $q.defer();
        var params = {
            rowkey: rowkey
        };
        if (alertError === undefined) {
            alertError = true;
        }
        ajax.get('fcc/tip/getByRowkeyNew', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode === 0) {
                defer.resolve(data.data);
            } else {
                if (alertError) {
                    swal('根据Rowkey查询数据出错：', data.errmsg, 'error');
                }
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 根据rowkeys获取tips详细属性
     * @param {Object} rowkey row关键字
     * @param {String} alertError 错误信息
     * @return {Promise} defer.promise
     */
    this.getByRowkeys = function (rowkey, alertError) {
        var defer = $q.defer();
        var params = {
            rowkey: rowkey
        };
        if (alertError === undefined) {
            alertError = true;
        }
        ajax.get('fcc/tip/getByRowkeys', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode === 0) {
                defer.resolve(data.data);
            } else {
                if (alertError) {
                    swal('根据Rowkeys查询数据出错：', data.errmsg, 'error');
                }
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /* 查询已读消息*/
    this.getReadMsg = function (param) {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/read/get', {
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
    /* 查询未读消息详情*/
    this.getDetailCheck = function (param) {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/readDetail/check', {
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
    /* 查询已读消息详情*/
    this.getReadCheck = function (param) {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/detail/check', {
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
     *  保存datatips数据
     * @param {Object} param 获取要素
     * @param {function} func 执行函数
     * @return {Promise} defer.promise
     */
    this.changeDataTipsState = function (param) {
        var defer = $q.defer();
        ajax.get('fcc/tip/edit', {
            parameter: param
        }).success(function (data) {
            if (data.errcode == 0) {
                dsOutput.push({
                    op: 'Tips状态修改成功',
                    type: 'succ',
                    pid: '0',
                    childPid: ''
                });
                swal('Tips状态修改成功', '', 'success');
                defer.resolve(1);
            } else {
                dsOutput.push({
                    op: 'Tips状态修改出错：' + data.errmsg,
                    type: 'fail',
                    pid: data.errcode,
                    childPid: ''
                });
                swal('Tips状态修改出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 自动录入*/
    this.runAutomaticInput = function (types) {
        var defer = $q.defer();
        toggleLoading(true);
        var params = {
            jobType: 'niRobot',
            request: {
                targetDbId: App.Temp.dbId,
                subtaskId: App.Temp.subTaskId,
                grids: App.Temp.gridList,
                userId: App.Temp.userId,
                types: types
            },
            descp: ''
        };
        ajax.get('job/create/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode === 0) {
                defer.resolve(data);
            } else {
                swal('创建Job出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };
    /* 根据rowkeyList查询照片作业季 */
    this.getPhotosByRowkey = function (param) {
        var defer = $q.defer();
        ajax.get('fcc/photo/getPhotosByRowkey', {
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
    /* 设置全景照片 */
    this.setPhoto = function (param) {
        var defer = $q.defer();
        ajax.get('fcc/photo/deep/setPhoto', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('设置出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /* 删除tips*/
    this.deleteJoinBorder = function (param) {
        toggleLoading(true);
        var defer = $q.defer();
        var params = {
            rowkey: param
        };
        ajax.get('fcc/tip/deleteByRowkey', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(1);
            } else {
                swal('删除接边标识出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };

    /* 新增接边tips*/
    this.addJoinBorder = function (param) {
        toggleLoading(true);
        var defer = $q.defer();
        var params = {
            g_location: param.g_location,
            user: App.Temp.userId,
            content: param.content,
            memo: param.memo
        };
        ajax.post('fcc/tip/createEdgeMatch', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('增加接边标识出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };

    /* 新增接边tips*/
    this.updateJoinBorder = function (key, memo) {
        toggleLoading(true);
        var defer = $q.defer();
        var params = {
            rowkey: key,
            user: App.Temp.userId,
            memo: memo ? memo : ''
        };
        ajax.get('fcc/tip/editMemo', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('更新接边标识出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };


    // 提交预处理任务
    this.submitPreTask = function (userId) {
        var defer = $q.defer();
        ajax.get('fcc/tip/submitPre/', {
            parameter: JSON.stringify({
                user: parseInt(userId, 10)
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else if (data.errcode == -100) {
                ajax.tokenExpired(defer);
            } else {
                swal('提交子任务出错', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };

    // 照片旋转
    this.rotatePhoto = function (param) {
        var defer = $q.defer();
        ajax.get('fcc/photo/rotatePhoto/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else if (data.errcode == -100) {
                ajax.tokenExpired(defer);
            } else {
                swal('照片旋转出错', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };

    /**
     * 批量保存tips修改状态
     * @param {Object} data 获取数据
     * @param {String} alertError 错误信息
     * @return {Promise} defer.promise
     */
    this.batchTipsSave = function (data, alertError) {
        var defer = $q.defer();
        var params = {
            mdFlag: App.Temp.mdFlag,
            handler: App.Temp.userId,
            data: data
        };
        if (alertError === undefined) {
            alertError = true;
        }
        ajax.post('fcc/tip/batchEditStatus', {
            parameter: JSON.stringify(params)
        }).success(function (result) {
            if (result.errcode == 0) {
                defer.resolve(result.data);
            } else {
                if (alertError) {
                    swal('批量更新tips状态出错：', result.errmsg, 'error');
                }
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 新增质检问题
     * @param {Object} param 获取要素
     * @return {Promise} defer.promise
     */
    this.saveWrong = function (param) {
        toggleLoading(true);
        var defer = $q.defer();
        var params = {
            data: param
        };
        ajax.post('fcc/tip/check/saveWrong', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('新增质检问题记录出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };

    /**
     * 编辑质检问题
     * @param {Object} param 获取要素
     * @param {Number} id 获取id
     * @param {Object} data 获取数据
     * @return {Promise} defer.promise
     */
    this.updateWrong = function (param, id) {
        toggleLoading(true);
        var defer = $q.defer();
        var params = {
            data: param,
            logId: id
        };
        ajax.post('fcc/tip/check/updateWrong', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('修改质检问题记录出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };

    /**
     * 删除质检问题
     * @param {Number} id 获取id
     * @param {Object} data 获取数据
     * @return {Promise} defer.promise
     */
    this.deleteWrong = function (id) {
        toggleLoading(true);
        var defer = $q.defer();
        var param = {
            logId: id
        };
        ajax.post('fcc/tip/check/deleteWrong', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('删除质检问题记录出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };

    /**
     * 查询质检问题
     * @param {Object} rowkey 获取要素
     * @param {Object} data 获取数据
     * @return {Promise} defer.promise
     */
    this.queryWrong = function (rowkey) {
        toggleLoading(true);
        var defer = $q.defer();
        var param = {
            objectId: rowkey,
            subTaskId: App.Temp.subTaskId
        };
        ajax.post('fcc/tip/check/queryWrong', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询质检问题记录出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };

    /**
     * 修改质检状态
     * @param {Number} status 获取状态
     * @param {Object} rowkey 获取rowkey
     * @param {Object} data 获取数据
     * @return {Promise} defer.promise
     */
    this.updateStatus = function (status, rowkey) {
        toggleLoading(true);
        var defer = $q.defer();
        var param = {
            rowkey: rowkey,
            checkStatus: status
        };
        ajax.post('fcc/tip/check/updateStatus', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('修改质检状态出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };

    /**
     * 查看道路检查log质检信息
     * @param {Number} pid 要素id
     * @returns {Promise} defer.promise
     */
    this.getRoadCheckQuality = function (pid) {
        toggleLoading(true);
        var defer = $q.defer();
        var param = { id: pid };
        ajax.get('fcc/rd/check/getQualityProblem', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询道路质检信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };

    // 抽取日线质检tips;
    this.extractDayTipsTask = function (param) {
        toggleLoading(true);
        var defer = $q.defer();
        ajax.get('fcc/tip/check/extract', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode === 0) {
                defer.resolve(data);
            } else if (data.errcode === -100) {
                ajax.tokenExpired(defer);
            } else {
                swal('抽取日线质检子任务出错', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };

    // 关闭日线质检tips;
    this.closeQualityCheckTask = function (param) {
        toggleLoading(true);
        var defer = $q.defer();
        var params = { taskId: param };
        ajax.get('fcc/tip/check/close', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode === 0) {
                defer.resolve(data);
            } else if (data.errcode === -100) {
                ajax.tokenExpired(defer);
            } else {
                swal('关闭日线质检子任务出错', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };

    /**
     * 根据POI的pid在海量库中查询照片
     * @param {Number} pid poiPid
     * @returns {Promise} defer.promise
     */
    this.queryPhotoByPid = function (pid) {
        toggleLoading(true);
        var defer = $q.defer();
        var param = { poi_pid: pid };
        ajax.massiveGet('tracks/queryPhotoByPid', param).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询历史照片出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };
}]);
