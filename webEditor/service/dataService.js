angular.module('dataService', ['oc.lazyLoad'], function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj 对象
     * @return {String} query.substr
     */
    var param = function (obj) {
        var query = '';
        var name,
            value,
            fullSubName,
            subName,
            subValue,
            innerObj,
            i;
        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        if (value.hasOwnProperty(subName)) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
    // Add interceptors
    $httpProvider.interceptors.push(function ($q) {
        return {
            // optional method
            request: function (config) {
                // do something with config
                if (config.url.indexOf('fos:') == 0) {
                    // config.rqtype = "fos";
                    config.url = App.Util.getFullUrl(config.url.substr(4));
                }
                return config;
            },
            // optional method
            requestError: function (rejection) {
                // do something on error
                // if (canRecover(rejection)) {
                //     return responseOrNewPromise
                // }
                return $q.reject(rejection);
            },
            // optional method
            response: function (response) {
                // do something with response
                return response;
            },
            // optional method
            responseError: function (rejection) {
                // do something on error
                // console.warn('服务请求出错:' + rejection.config.url);
                return $q.reject(rejection);
            }
        };
    });
}).service('ajax', ['$http', function ($http) {
    this.get = function (url, param) {
        var fullUrl;
        if (param.urlType == 'spec') {
            fullUrl = App.Util.getSpecUrl(url);
        } else {
            fullUrl = App.Util.getFullUrl(url);
        }
        return $http.get(fullUrl, {
            params: param
        });
    };
    this.post = function (url, param) {
        return $http.post(App.Util.getFullUrl(url), param);
    };
    this.localGet = function (url, param) {
        return $http.get(App.Util.getLocalService(url), {
            params: param
        });
    };
    this.localPost = function (url, param) {
        return $http.post(App.Util.getLocalService(url), param);
    };
    this.getLocalJson = function (url) {
        return $http.get(url, {});
    };
    this.massiveGet = function (url, param) {
        return $http.get(App.Util.getMassiveUrl(url), {
            params: param
        });
    };
    this.tokenExpired = function (defer) {
        swal({
            title: 'Token已失效，请重新登陆！',
            type: 'error',
            animation: 'slide-from-top',
            closeOnConfirm: true,
            confirmButtonText: '重新登陆'
        }, function () {
            App.Util.logout();
        });
        defer.reject(null);
    };
    this.error = function (defer, rejection) {
        swal('啊哦，服务程序开小差了，请稍后再试！', rejection, 'error');
        defer.reject(rejection);
    };
}]).service('dsOutput', [function () {
    this.output = [];
    this.push = function (data) {
        this.output.unshift(data);
    };
    this.pushAll = function (dataArray) {
        if (dataArray) {
            for (var i = 0; i < dataArray.length; i++) {
                this.output.unshift(dataArray[i]);
            }
        }
    };
    this.pop = function () {
        return this.output.pop();
    };
    this.clear = function () {
        this.output.length = 0;
    };
}]).service('dsLazyload', ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
    this.loadInclude = function (scope, ngInclude, ctrl, tmpl) {
        var defer = $q.defer();
        $ocLazyLoad.load([ctrl, tmpl]).then(function () {
            var handler;
            if (scope[ngInclude] === tmpl) {
                defer.resolve('succ');
            } else {
                handler = scope.$on('$includeContentLoaded', function (p1, p2) {
                    if (p2 === tmpl) {
                        handler();
                        handler = null;
                        defer.resolve('succ');
                    }
                });
                scope[ngInclude] = tmpl;
            }
        });

        return defer.promise;
    };

    this.testHtmlLoad = function (scope, tmpl) {
        var defer = $q.defer();
        var handler = scope.$on('$includeContentLoaded', function (p1, p2) {
            if (p2 === tmpl) {
                handler();
                handler = null;
                defer.resolve('succ');
            }
        });
        return defer.promise;
    };
}]);
