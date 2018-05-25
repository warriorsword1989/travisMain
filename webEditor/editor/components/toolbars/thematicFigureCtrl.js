/**
 * Created by liuzhe on 2017/1/12.
 */

angular.module('app').controller('thematicFigureCtrl', ['$scope', 'dsEdit',
    function ($scope, dsEdit) {
        $scope.expandFlag = true;
        $scope.arrowImg = '../../images/png/arrow_up.png';

        $scope.showFigure = function () {
            $scope.arrowImg = $scope.expandFlag ? '../../images/png/arrow_down.png' : '../../images/png/arrow_up.png';
            $scope.expandFlag = !$scope.expandFlag;
        };

        var initialize = function (event, data) {
            $scope.sceneName = data.name;
            $scope.figures = new FM.uikit.Config.ThematicFigure().getFigure(data.id);
        };

        $scope.$on('Reload-ThematicFigureBar', initialize);
    }
]);
