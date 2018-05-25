/**
 * 单页面应用主入口
 * @file       app.module.js
 * @author     ChenXiao
 * @date       2017-08-03 11:57:21
 *
 * @copyright: @Navinfo, all rights reserved.
 */

angular.module('app', ['ngRoute', 'ngCookies', 'ui.layout', 'highcharts-ng', 'ui.bootstrap', 'ngDialog',
    'ngLocale', 'localytics.directives', 'ngAnimate', 'mgcrea.ngStrap', 'angular-drag', 'oc.lazyLoad', 'dataService',
    'ngTable', 'ngSanitize', 'angularFileUpload', 'treeControl', 'cfp.hotkeys', 'w5c.validator', 'dndLists', 'ngDraggable',
    'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.pagination', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.moveColumns',
    'ngWindowManager'
]).config(['$locationProvider', '$routeProvider', 'w5cValidatorProvider',
    function config($locationProvider, $routeProvider, w5cValidatorProvider) {
        // $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'loginCtrl'
            })
            .when('/tasks', {
                templateUrl: './task/taskMainMap.html',
                controller: 'taskMainMapCtrl'
            })
            .when('/editor', {
                templateUrl: './editor/editor.html',
                controller: 'editorCtrl'
            })
            .when('/editorHis', {
                templateUrl: './editorHistory/editorHis.html',
                controller: 'editorHisCtrl'
            })
            .when('/monthTasks', {
                templateUrl: './task/monthTaskMain.html',
                controller: 'monthTaskMainCtrl'
            })
            .when('/deepInfo', {
                templateUrl: './task/deepTaskMain.html',
                controller: 'deepTaskMainCtrl'
            })
            .when('/chinaNameTask_ml', {
                templateUrl: 'colEditor/ml/chinaName/chinaNameMain.html',
                controller: 'chinaNameMainCtrl'
            })
            .when('/chinaAddressTask_ml', {
                templateUrl: 'colEditor/ml/chinaAddress/chinaAddressMain.html',
                controller: 'chinaAddressMainCtrl'
            })
            .when('/engNameTask_ml', {
                templateUrl: 'colEditor/ml/engName/engNameMain.html',
                controller: 'engNameMainCtrl'
            })
            .when('/engAddressTask_ml', {
                templateUrl: 'colEditor/ml/engAddress/engAddressMain.html',
                controller: 'engAddressMainCtrl'
            })
            .when('/chinaNameTask_hm', {
                templateUrl: 'colEditor/hm/chinaName/chinaNameMain.html',
                controller: 'hmChinaNameMainCtrl'
            })
            .when('/chinaAddressTask_hm', {
                templateUrl: 'colEditor/hm/chinaAddress/chinaAddressMain.html',
                controller: 'hmChinaAddressMainCtrl'
            })
            .when('/engNameTask_hm', {
                templateUrl: 'colEditor/hm/engName/engNameMain.html',
                controller: 'hmEngNameMainCtrl'
            })
            .when('/engAddressTask_hm', {
                templateUrl: 'colEditor/hm/engAddress/engAddressMain.html',
                controller: 'hmEngAddressMainCtrl'
            })
            .when('/pointAddrChi', {
                templateUrl: 'colEditor/ml/index/pointAddress/pointAddrChi/pointAddrChiMain.html',
                controller: 'pointAddrChiMainCtrl'
            })
            .when('/pointAddrEng', {
                templateUrl: 'colEditor/ml/index/pointAddress/pointAddrEng/pointAddrEngMain.html',
                controller: 'pointAddrEngMainCtrl'
            })
            .otherwise('/login');

        // w5c form验证框架的全局配置
        w5cValidatorProvider.config({
            blurTrig: true,
            /**
             * 显示错误提示信息
             * @method showError
             * @author ChenXiao
             * @date   2017-09-13
             * @param {HtmlDom}     elem          hml tdom
             * @param {Array}       errorMessages 错误信息
             * @return {Undefined}                无
             */
            showError: function (elem, errorMessages) {
                var $elem = angular.element(elem);
                $elem.tooltip({
                    placement: 'top',
                    title: errorMessages[0],
                    trigger: 'manual',
                    template: '<div class="tooltip w5c-err" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
                });
                $elem.tooltip('show');
            },
            /**
             * 清除提示信息
             * @method removeError
             * @author ChenXiao
             * @date   2017-09-13
             * @param {HtmlDom}     elem          hml tdom
             * @param {Array}       errorMessages 错误信息
             * @return {Undefined}                无
             */
            removeError: function (elem, errorMessages) {
                var $elem = angular.element(elem);
                $elem.tooltip('destroy');
            }
        });
        // w5c form验证框架的默认提示信息
        w5cValidatorProvider.setDefaultRules({
            required: '该项不能为空',
            maxlength: '该项输入值长度不能大于{maxlength}',
            minlength: '该项输入值长度不能小于{minlength}',
            email: '输入邮件的格式不正确',
            repeat: '两次输入不一致',
            pattern: '该项输入格式不正确',
            number: '必须输入数字',
            w5cuniquecheck: '该输入值已经存在，请重新输入',
            url: '输入URL格式不正确',
            max: '该项输入值不能大于{max}',
            min: '该项输入值不能小于{min}'
        });
    }
]).constant('appPath', {
    root: App.Util.getAppPath() + '/',
    editor: App.Util.getAppPath() + '/apps/webEditor/editor/components/',
    editorHis: App.Util.getAppPath() + '/apps/webEditor/editorHistory/components/',
    scripts: App.Util.getAppPath() + '/scripts/',
    meta: App.Util.getAppPath() + '/scripts/components/meta/',
    road: App.Util.getAppPath() + '/scripts/components/road/',
    poi: App.Util.getAppPath() + '/scripts/components/index/poi/',
    tool: App.Util.getAppPath() + '/scripts/components/tools/'
})
// 用于记录程序执行过程中临时需要记录的全局值
.constant('appTemp', {})
// 页面主controller
.controller('AppCtrl', ['$scope', '$cookies', 'appPath', '$http',
    function ($scope, $cookies, appPath, $http) {
        $scope.appPath = appPath;

        $scope.initServiceUrl = function (accessType) {
            FM.extend(App.Config, App.serverList[accessType]);
        };

        $scope.loadConstant = function (accessType) {
            var reqs = [];
            reqs.push($http.get('./config/constant/poi/rowEditor/main.json'));
            reqs.push($http.get('./config/constant/poi/colEditor/main.json'));
            if (accessType === 'hm') {
                reqs.push($http.get('./config/constant/poi/rowEditor/hm.json'));
                reqs.push($http.get('./config/constant/poi/colEditor/hm.json'));
            }

            Promise.all(reqs).then(function (res) {
                App.Config.Constant.poi = {};
                for (var i = 0, len = res.length; i < len; i++) {
                    FM.Util.extend(App.Config.Constant.poi, res[i].data);
                }
            });
        };

        // 非Chrome浏览器警告
        if (!App.Util.testBrowser(['Chrome/57'])) {
            swal({
                title: '浏览器高能警告',
                text: '亲，本系统建议您使用全宇宙最好的<b style="color:red;">Chrome浏览器</b>（57以上版本），体验飞一般的感觉！',
                type: 'warning',
                html: true,
                showConfirmButton: false,
                showCancelButton: false,
                allowEscapeKey: false
            });
            return;
        }

        // 页面刷新时，从sessionStorage中读取用户信息
        var accessToken = App.Util.getUrlParam('access_token');
        if (accessToken) {
            App.Temp.accessToken = accessToken;
            if (!App.Temp.userId) {
                var userCookie = App.Util.getSessionStorage('User');
                if (userCookie) {
                    App.Temp.userId = userCookie.userId;
                    App.Temp.userName = userCookie.userRealName;
                    App.Temp.accessType = userCookie.accessType;

                    App.Temp.User = userCookie;

                    $scope.initServiceUrl(App.Temp.accessType);
                    $scope.loadConstant(App.Temp.accessType);
                }
            }

            // 从sessionStorage中读取任务信息
            if (!App.Temp.subTaskId) {
                var taskCookie = App.Util.getSessionStorage('SubTask');
                if (taskCookie) {
                    App.Temp.dbId = taskCookie.dbId;
                    App.Temp.subTaskId = taskCookie.subTaskId;
                    App.Temp.programType = taskCookie.programType;
                    App.Temp.taskType = taskCookie.taskType;
                    App.Temp.workKind = taskCookie.workKind;
                    App.Temp.gridList = taskCookie.gridList;
                    App.Temp.mdFlag = taskCookie.mdFlag;
                    App.Temp.qcTaskFlag = taskCookie.qcTaskFlag;

                    App.Temp.SubTask = taskCookie;
                }
            }

            App.Temp.Settings = App.Util.getLocalStorage('Settings') || {};
        }

        /**
         * 通过检测全局临时变量中的User信息，判断用户登录是否失效，如果失效则给出提示信息
         * @method testLogin
         * @author ChenXiao
         * @date   2017-09-13
         * @return {Boolean} 是否失效
         */
        $scope.testLogin = function () {
            if (!App.Temp.User) {
                swal({
                    title: '登陆已失效，请重新登陆！',
                    type: 'error',
                    animation: 'slide-from-top',
                    closeOnConfirm: true,
                    confirmButtonText: '重新登陆'
                }, function () {
                    App.Util.logout();
                });
                return false;
            }

            return true;
        };

        /**
         * 通过检测全局临时变量中的SubTask信息，判断用户任务信息是否失效，如果失效则给出提示信息
         * @method testTask
         * @author ChenXiao
         * @date   2017-09-13
         * @return {Boolean} 是否失效
         */
        $scope.testTask = function () {
            if (!App.Temp.SubTask) {
                swal({
                    title: '任务信息已失效，请重新登陆！',
                    type: 'error',
                    animation: 'slide-from-top',
                    closeOnConfirm: true,
                    confirmButtonText: '重新登陆'
                }, function () {
                    App.Util.logout();
                });
                return false;
            }

            return true;
        };

        // 注册servier-worker
        // if (navigator.serviceWorker) {
        //     navigator.serviceWorker.register('sw-poi.js').then(function (registration) {
        //         console.log('service worker 注册成功');
        //     }).catch(function (err) {
        //         console.log('servcie worker 注册失败');
        //     });
        // }
    }
]);
