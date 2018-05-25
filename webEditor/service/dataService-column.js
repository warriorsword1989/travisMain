/**
 * 精编对应的接口文件
 */

angular.module('dataService').service('dsColumn', ['$http', '$q', 'ajax', function ($http, $q, ajax) {
    var showLoading; // 主页面控制Loading的开关的引用
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
     * 根据子任务以及一级作业项申请数据
     * @param {Object} param 获取参数
     * @param {Object} firstWorkItem 第一主题
     * @return {Promise} defer.promise
     */
    this.applyPoi = function (param) {
        var defer = $q.defer();
        param.taskId = App.Temp.subTaskId;
        param.isQuality = App.Temp.qcTaskFlag;
        ajax.get('editcolumn/poi/column/applyPoi', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('申请数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 深度信息抽取功能
     * @param {Object} param 获取参数
     * @param {Number} subTaskId 任务id
     * @param {Object} firstWorkItem 第一主题
     * @param {Object} secondWorkItem 第二主题
     * @return {Promise} defer.promise
     */
    this.extractData = function (param) {
        var defer = $q.defer();
        param.taskId = App.Temp.subTaskId;
        ajax.get('editcolumn/poi/deep/qcExtractData', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('抽取数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 质检问题查询
     * @param {Object} param 获取参数
     * @param {Number} taskId 任务参数
     * @param {Object} firstWorkItem 第一工作主题
     * @return {Promise} defer.promise
     */
    this.queryOcProblem = function (param) {
        var defer = $q.defer();
        // param.subtaskId = App.Temp.subTaskId;
        ajax.get('editcolumn/poi/column/queryQcProblem', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('质检问题查询出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 质检问题保存
     * @param {Object} param 获取参数
     * @param {Number} taskId 任务参数
     * @param {Object} firstWorkItem 第一工作主题
     * @return {Promise} defer.promise
     */
    this.saveOcProblem = function (param) {
        var defer = $q.defer();
        // param.subtaskId = App.Temp.subTaskId;
        ajax.get('editcolumn/poi/column/saveQcProblem', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('质检问题保存出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 提交数据，支持一级作业项和二级作业项提交
     * @param {Object} firstWorkItem 第一工作主题
     * @param {Object} secondWorkItem 第二工作主题
     * @param {Number} taskId 任务参数
     * @return {Promise} defer.promise
     */
    this.submitData = function (firstWorkItem, secondWorkItem) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.subTaskId,
            firstWorkItem: firstWorkItem,
            secondWorkItem: secondWorkItem || '', // 可以为空
            isQuality: App.Temp.qcTaskFlag
        };
        ajax.get('editcolumn/poi/column/columnSubmit', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('提交数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 查询二级作业项统计信息
     * @param {Object} param 获取参数
     * @param {Number} taskId 任务参数
     * @param {Object} firstWorkItem 第一工作主题
     * @return {Promise} defer.promise
     */
    this.querySecondWorkStatistics = function (param) {
        var defer = $q.defer();
        var params = {
            taskId: param.taskId,
            firstWorkItem: param.firstWorkItem,
            isQuality: App.Temp.qcTaskFlag
        };
        ajax.get('editcolumn/poi/column/secondWorkStatistics ', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询统计信息出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /* 作业数据查询(待作业、待提交)*/
    this.queryColumnDataList = function (param) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.subTaskId,
            firstWorkItem: param.firstWorkItem,
            secondWorkItem: param.secondWorkItem,
            status: param.status,
            isQuality: App.Temp.qcTaskFlag
        };
        ajax.get('editcolumn/poi/column/columnQuery', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取数据列表异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });

        // ajax.getLocalJson('../webEditor/colEditor/chinaName/test.json', {}).success(function (data) {
        //     defer.resolve(data);
        // }).error(function (rejection) {
        //     defer.reject(rejection);
        // });
        return defer.promise;
    };
    /**
     * 库存总量统计
     * @param {Number} subtaskId 列表任务id
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.queryKcLog = function (subtaskId) {
        var defer = $q.defer();
        var params = {
            subtaskId: subtaskId,
            isQuality: App.Temp.qcTaskFlag
        };
        ajax.get('editcolumn/poi/column/queryKcLog', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取库存总量统计异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 查看当前子任务统计
     * @param {Number} subtaskId 列表任务id
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.queryStatistics = function (subtaskId) {
        var defer = $q.defer();
        var params = {
            subtaskId: subtaskId
        };
        ajax.get('editcolumn/poi/count/queryCurrentSubtask', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查看当前子任务统计异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 判断是否可关闭任务 针对type=7
     * @param {Number} subtaskId 列表任务id
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.querySubtaskStatics = function (subtaskId) {
        var defer = $q.defer();
        var params = {
            subtaskId: subtaskId
        };
        ajax.get('editcolumn/poi/column/querySubtaskStatics', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 常规作业员下拉列表
     * @param {Number} subtaskId 列表任务id
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.queryWorkerList = function (subtaskId) {
        var defer = $q.defer();
        var params = {
            subtaskId: subtaskId
        };
        ajax.get('editcolumn/poi/column/queryWorkerList', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取常规作业员列表异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 保存接口
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.saveData = function (param) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.subTaskId,
            firstWorkItem: param.firstWorkItem,
            secondWorkItem: param.secondWorkItem,
            dataList: param.dataList,
            isQuality: App.Temp.qcTaskFlag
        };
        ajax.post('editcolumn/poi/column/columnSave', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('保存数据异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    this.ignoreError = function (param) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            id: param.md5Code,
            type: param.type,   // 1例外， 2确认不修改， 3确认已修改
            oldType: param.oldType // 精编串0
        };
        ajax.get('edit/check/update', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(1);
            } else {
                swal('忽略错误异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /* 深度信息数据申请*/
    this.applyDeepData = function (param) {
        var defer = $q.defer();
        ajax.get('editcolumn/poi/deep/applyData', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取数据列表异常：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /* 深度信息数据查询(待作业、待提交)*/
    this.queryDeepDataList = function (options) {
        var defer = $q.defer();
        var param = {
            dbId: App.Temp.dbId,
            subtaskId: App.Temp.subTaskId,
            type: App.Temp.monthTaskType,
            status: 1,
            isQuality: App.Temp.qcTaskFlag
        };
        var params = $.extend(param, options);
        ajax.get('editcolumn/poi/deep/queryDataList', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取数据列表异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /* 深度信息数据提交*/
    this.releaseDeepDataList = function (param) {
        var defer = $q.defer();
        ajax.get('editcolumn/poi/deep/release', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('提交失败：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /* 深度信息数据保存*/
    this.saveDeepDataList = function (param) {
        toggleLoading(true); // 打开主页面的loadingbar
        var defer = $q.defer();
        ajax.post('editcolumn/poi/deep/poiSave', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('保存失败：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };
    // 执行檢查;(精编+深度信息)
    this.checkDeepData = function (options) {
        var defer = $q.defer();
        var param = {
            isQuality: App.Temp.qcTaskFlag
        };
        var params = $.extend(param, options);
        ajax.get('edit/check/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('执行检查出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 根据taskId查询任务统计量
    this.querySubtask = function (subTaskId, isQuality) {
        var defer = $q.defer();
        var params = {
            subtaskId: subTaskId,
            isQuality: isQuality
        };
        ajax.post('editcolumn/poi/count/querySubtask', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询统计量出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 月编专项 批次列表
    this.queryPartition = function (param) {
        var defer = $q.defer();
        ajax.get('editcolumn/poi/column/queryPartition', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询列编专项批次列表数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 根据子任务以及一级作业项申请点门牌的数据
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.applyPointAddress = function (param) {
        var defer = $q.defer();
        param.taskId = App.Temp.subTaskId;
        // param.isQuality = App.Temp.qcTaskFlag; // 暂时还没有做质检
        ajax.get('editcolumn/pointAddress/applyPointAddr/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('申请数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     *  点门牌数据列表接口
     * @param {Object} param 接口参数
      * @return {Promise} Promise对象
     */
    this.queryPointAddressDataList = function (param) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.subTaskId,
            firstWorkItem: param.firstWorkItem,
            secondWorkItem: param.secondWorkItem,
            status: param.status,
            isQuality: App.Temp.qcTaskFlag
        };
        ajax.get('editcolumn/pointAddress/columnQuery', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取数据列表异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 点门牌保存接口
     * @param {Object} param 参数
     * @return {Promise} defer.promise
     */
    this.savePointAddressData = function (param) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.subTaskId,
            firstWorkItem: param.firstWorkItem,
            secondWorkItem: param.secondWorkItem,
            dataList: param.dataList
        };
        ajax.post('editcolumn/pointAddress/columnSave', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('保存数据异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 点门牌提交数据，支持一级作业项和二级作业项提交
     * @param {Object} firstWorkItem 第一工作主题
     * @param {Object} secondWorkItem 第二工作主题
     * @param {Number} taskId 任务参数
     * @return {Promise} defer.promise
     */
    this.submitPointAddressData = function (firstWorkItem, secondWorkItem) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.subTaskId,
            firstWorkItem: firstWorkItem,
            secondWorkItem: secondWorkItem || ''
        };
        ajax.get('editcolumn/pointAddress/columnSubmit', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('提交数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 查询点门牌二级作业项统计信息
     * @param {Object} param 获取参数
     * @param {Number} taskId 任务参数
     * @param {Object} firstWorkItem 一级作业项
     * @return {Promise} defer.promise
     */
    this.queryPointSecondWorkStatistics = function (param) {
        var defer = $q.defer();
        var params = {
            taskId: param.taskId,
            firstWorkItem: param.firstWorkItem
            // , isQuality: App.Temp.qcTaskFlag // 点门牌暂时不涉及质检
        };
        ajax.get('editcolumn/pointAddress/secondWorkStatistics', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询统计信息出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);
