/**
 * 登录页面Controller
 * @file       loginCtrl.js
 * @author     ChenXiao
 * @date       2017-08-03 11:57:21
 *
 * @copyright: @Navinfo, all rights reserved.
 */

angular.module('app').controller('loginCtrl', ['$scope', 'dsManage',
    function ($scope, dsManage) {
        var standerdWidth = 1920;
        // var standerdHeight = 970;
        var width = document.documentElement.clientWidth;
        // var height = document.documentElement.clientHeight;
        var widthPrcent = 1;
        if (width < 1920) {
            widthPrcent = width / standerdWidth;
        }
        $scope.rememberMe = false;
        $scope.userNamePlaceholder = '请输入用户名';
        $scope.passwordPlaceholder = '请输入密码';
        $scope.userName = '';
        $scope.password = '';
        $scope.emptyImgFlag = false;

        var rememberUser = App.Util.getLocalStorage('RememberUser');
        if (rememberUser) {
            $scope.userName = rememberUser.userName;
            $scope.password = rememberUser.userPwd;
        }
        $scope.bgDiv = {
            height: 970 * widthPrcent + 'px',
            width: 1920 * widthPrcent + 'px',
            position: 'fixed'
        };
        $scope.loginDiv = {
            height: 570 * widthPrcent + 'px',
            width: 480 * widthPrcent + 'px',
            'margin-top': -325 * widthPrcent + 'px',
            'margin-left': -240 * widthPrcent + 'px'
        };
        $scope.titleBgStyle = {
            height: 70 * widthPrcent + 'px',
            width: 140 * widthPrcent + 'px',
            'border-radius': 140 * widthPrcent + 'px ' + 140 * widthPrcent + 'px 0 0'
        };
        $scope.containerBgStyle = {
            height: 490 * widthPrcent + 'px',
            width: 480 * widthPrcent + 'px',
            'padding-top': 40 * widthPrcent + 'px'
        };
        $scope.loginTitle = {
            'font-size': 18 * widthPrcent + 'px',
            'margin-top': 40 * widthPrcent + 'px'
        };
        $scope.userIcon = {
            height: 120 * widthPrcent + 'px', // 此处高度缩放乘以宽度的比例是为了保持图片的宽高一致
            width: 120 * widthPrcent + 'px',
            'margin-top': 10 * widthPrcent + 'px'
        };
        $scope.loginForm = {
            'padding-left': 35 * widthPrcent + 'px',
            'padding-right': 30 * widthPrcent + 'px'
        };
        $scope.inputDiv = {
            'padding-top': 30 * widthPrcent + 'px'
        };
        $scope.inputIcon = {
            width: 20 * widthPrcent + 'px',
            height: 20 * widthPrcent + 'px',
            left: 35 * widthPrcent + 'px'
        };
        $scope.inputText = {
            width: 360 * widthPrcent + 'px',
            height: 40 * widthPrcent + 'px',
            'padding-left': 40 * widthPrcent + 'px',
            'font-size': 14 * widthPrcent + 'px'
        };
        $scope.addtionItem = {
            'padding-right': 40 * widthPrcent + 'px',
            'padding-left': 30 * widthPrcent + 'px',
            'padding-bottom': 20 * widthPrcent + 'px',
            'margin-top': 30 * widthPrcent + 'px',
            'margin-bottom': 20 * widthPrcent + 'px',
            height: 25 * widthPrcent + 'px',
            'font-size': 14 * widthPrcent + 'px'
        };
        $scope.submitButton = {
            width: 360 * widthPrcent + 'px',
            height: 40 * widthPrcent + 'px',
            'font-size': 18 * widthPrcent + 'px',
            'margin-left': 24 * widthPrcent + 'px',
            'margin-top': 10 * widthPrcent + 'px'
        };
        $scope.loginFail = {
            'font-size': 14 * widthPrcent + 'px',
            height: 30 * widthPrcent + 'px',
            'line-height': 30 * widthPrcent + 'px'
        };
        $scope.loginRememberSpan = {
            float: 'right',
            height: 16 * widthPrcent + 'px',
            'line-height': 16 * widthPrcent + 'px',
            color: '#666666',
            cursor: 'pointer',
            'font-weight': 100
        };
        $scope.loginRememberImg = {
            float: 'right',
            height: 16 * widthPrcent + 'px',
            width: 16 * widthPrcent + 'px',
            'margin-right': 10 * widthPrcent + 'px',
            cursor: 'pointer'
        };
        $scope.loginFailHidden = {
            'font-size': 14 * widthPrcent + 'px',
            height: 30 * widthPrcent + 'px'
        };
        $scope.failImg = {
            width: 22 * widthPrcent + 'px',
            height: 20 * widthPrcent + 'px',
            top: -3 * widthPrcent + 'px'
        };
        $scope.emptyPassword = {
            width: 20 * widthPrcent + 'px',
            height: 20 * widthPrcent + 'px',
            top: 39 * widthPrcent + 'px',
            right: 42 * widthPrcent + 'px'
        };
        $scope.checkBoxDiv = {
            height: 21 * widthPrcent + 'px',
            'margin-top': 30 * widthPrcent + 'px',
            'padding-right': 30 * widthPrcent + 'px'
        };
        $scope.loginLoadStyle = {
            height: 30 * widthPrcent + 'px',
            width: 30 * widthPrcent + 'px',
            'background-size': 30 * widthPrcent + 'px'
        };
        $scope.accessSelect = {
            width: 360 * widthPrcent + 'px',
            height: 40 * widthPrcent + 'px',
            'font-size': 16 * widthPrcent + 'px',
            'padding-left': 40 * widthPrcent + 'px',
            'margin-left': 24 * widthPrcent + 'px'
        };
        $scope.errorFlag = false;

        $scope.accessType = 'ml';   //  默认登陆方式
        $scope.typeList = [
            { type: 'hm', text: '港 澳' },
            { type: 'ml', text: '大 陆' }
        ];

        /**
         * 切换“记住我”的勾选状态
         * @method changeForgetMe
         * @author ChenXiao
         * @date   2017-09-13
         * @return {Undefined} 无返回值
         */
        $scope.changeForgetMe = function () {
            $scope.rememberMe = !$scope.rememberMe;
        };
        /**
         * 错误信息绑定到scope中，以便在页面显示
         * @method errorMessage
         * @author ChenXiao
         * @date   2017-09-13
         * @param  {Object}     data 错误信息对象
         * @return {Undefined}       无返回值
         */
        var errorMessage = function (data) {
            $scope.errorMessage = data.error;
            $scope.errorFlag = true;
        };
        /**
         * 清理缓存，包括临时全局变量，以及存储在session storage中的对象
         * @method clearCookies
         * @author ChenXiao
         * @date   2017-09-13
         * @return {Undefined} 无返回值
         */
        var clearCookies = function () {
            if (App.Temp.accessToken) {
                App.Util.removeSessionStorageObject();
                App.Util.clearAppTemp();
            }
        };
        /**
         * 处理登录操作
         * @method handleEvent
         * @author ChenXiao
         * @date   2017-09-13
         * @return {Undefined} 无返回值
         */
        $scope.handleEvent = function () {
            if ($scope.showLoadImg) {
                return;
            }

            $scope.initServiceUrl($scope.accessType);

            $scope.showLoadImg = true;
            dsManage.login($scope.userName, $scope.password).then(function (rest) {
                $scope.showLoadImg = false;
                if (rest && rest.access_token) {
                    App.Temp.accessToken = rest.access_token;
                    App.Temp.userId = rest.userId;
                    App.Temp.userName = rest.userRealName;
                    App.Temp.accessType = $scope.accessType; //  登陆模式

                    var userCookie = {
                        userId: rest.userId,
                        userName: rest.userName,
                        userRealName: rest.userRealName,
                        accessType: App.Temp.accessType
                    };
                    App.Temp.User = userCookie;

                    // 登录用户信息属于临时信息，记录在sessionStorage中
                    App.Util.setSessionStorage('User', userCookie);

                    App.Temp.Settings = App.Util.getLocalStorage('Settings') || {};
                    if ($scope.rememberMe && !App.Temp.Settings.RememberUser) {
                        // 是否记住用户属于配置信息，记录在localStorage中
                        App.Util.setLocalStorage('RememberUser', {
                            userName: $scope.userName,
                            // todo: 此处很不安全，要进行加密
                            userPwd: $scope.password
                        });
                    }

                    $scope.loadConstant(App.Temp.accessType);

                    window.location.href = '#/tasks?access_token=' + rest.access_token;
                } else {
                    errorMessage(rest);
                }
            });
        };

        clearCookies();
    }
]);
