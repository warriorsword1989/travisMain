/**
 * Created by wuzhen on 2017/1/10.
 */

angular.module('app').controller('showImageCtrl', ['$scope',
    function ($scope) {
        $scope.changeBigImg = function (item) {
            $scope.originImage = item.originUrl;
        };
        $scope.bigImgStyle = {
            width: 'auto',
            height: 'auto',
            'max-height': '100%',
            'max-width': '100%',
            cursor: 'move'
        };
        var initPage = function () {
            $scope.photos = $scope.viewOjbect.photos;
            $scope.photos.forEach(function (item) {
                item.originUrl = App.Util.getPhotoUrl(item.fccPid, 'origin');
                item.thumbnailUrl = App.Util.getPhotoUrl(item.fccPid, 'thumbnail');
            });
            if ($scope.photos.length > 0) {
                if ($scope.originImage != $scope.photos[0].originUrl) {
                    $scope.originImage = $scope.photos[0].originUrl;
                    var colImage = document.getElementById('colImage');
                    if (colImage) {
                        colImage.dispatchEvent(new CustomEvent('wheelzoom.destroy'));
                        wheelzoom(colImage);
                    }
                }
            }
            $scope.photoPage = 1;
        };

        /* tips图片翻页*/
        $scope.turnPhotoPage = function (type) {
            if (type == 1) { // 上一页
                if ($scope.photoPage > 1) {
                    $scope.photoPage--;
                }
            } else if ($scope.photoPage < Math.ceil($scope.photos.length / 10)) { // 下一页
                $scope.photoPage++;
            }
            // $scope.tipsBtnDisabled = $scope.photoPage == Math.ceil($scope.photos.length / 10);
        };

        $scope.$on('imageModalReload', initPage);
    }
]);
