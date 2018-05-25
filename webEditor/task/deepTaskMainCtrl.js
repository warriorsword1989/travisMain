/**
 * Created by liuyang on 2016/12/6.
 */

angular.module('app').controller('deepTaskMainCtrl', ['$scope', 'ngDialog', '$rootScope',
    function ($scope, ngDialog, $rootScope) {
        // 根据屏幕计算高度
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;
        var percent = height / 1019;

        $scope.mapBackGround = {
            'padding-top': (height - (1000 * percent)) / 2 + 'px',
            width: width + 'px',
            height: height + 'px',
            position: 'absolute'
        };

        $scope.showModal = function () {
            ngDialog.open({
                template: './task/deepInfo/deepInfoPage.html',
                controller: 'deepInfoPageCtrl',
                // className: 'ngdialog-theme-default',
                width: '100%',
                height: '100%',
                showClose: false,
                closeByEscape: false,
                closeByDocument: false
            });
        };

        $scope.showModal();

        $scope.$on('$destroy', function () {
            var opens = ngDialog.getOpenDialogs();
            if (opens && opens.length > 0) {
                ngDialog.closeAll();
            }
        });
    }
]);
