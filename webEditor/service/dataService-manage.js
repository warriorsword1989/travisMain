angular.module('dataService').service('dsManage', ['$http', '$q', 'ajax', function ($http, $q, ajax) {
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
    // 根据用户名查找子任务列表;
    this.login = function (userName, passwd) {
        var defer = $q.defer();
        ajax.get('man/userInfo/login/', {
            parameter: {
                userNickName: userName,
                userPassword: passwd
            }
        }).success(function (data) {
            if (data.errcode == 0) {
                if (data.data.access_token) { // 登陆成功
                    defer.resolve(data.data);
                } else { // 用户名或密码错误
                    defer.resolve(data.errmsg);
                }
            } else {
                // swal("登陆出错", data.errmsg, "error");
                defer.resolve(data.errmsg);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };
    // 根据用户名查找子任务列表;
    this.getSubtaskListByUser = function (paramObj) {
        var defer = $q.defer();
        toggleLoading(true);
        ajax.get('man/subtask/listByUser', {
            parameter: JSON.stringify(paramObj)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data || []);
            } else if (data.errcode == -100) {
                ajax.tokenExpired();
            } else {
                swal('查询子任务列表出错', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };
    // 根据子任务Id查找子任务概要信息;
    this.getSubtaskSummaryById = function (paramObj) {
        var defer = $q.defer();
        ajax.get('man/statics/subtask/query', {
            parameter: JSON.stringify({
                subtaskId: paramObj
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else if (data.errcode == -100) {
                ajax.tokenExpired();
            } else {
                swal('查询子任务统计信息出错', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };
    // 根据用户名查找子任务列表;
    this.getSubtaskById = function (subtaskId) {
        var defer = $q.defer();
        ajax.get('man/subtask/query/', {
            parameter: JSON.stringify({
                subtaskId: subtaskId
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else if (data.errcode == -100) {
                ajax.tokenExpired(defer);
            } else {
                swal('查询子任务信息出错', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };

    // 提交子任务方法；；
    this.submitTask = function (subTaskId) {
        var defer = $q.defer();
        var params = {
            subtaskId: subTaskId
        };
        ajax.get('edit/road/base/release/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                swal.close();
                defer.resolve(data);
            } else if (data.errcode == -100) {
                swal.close();
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

    // 根据作业员查询子任务统计量
    this.taskCount = function () {
        var defer = $q.defer();
        ajax.get('man/subtask/staticWithType/', {

        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else if (data.errcode == -100) {
                ajax.tokenExpired(defer);
            } else {
                swal('查询子任务统计量出错', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };

    /**
     * 获取历史备份版本信息
     * @return {Promise} defer.promise
     */
    this.getHisVersion = function () {
        var defer = $q.defer();
        ajax.get('sys/message/historyDbInfo', {}).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询历史版本出错', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);
