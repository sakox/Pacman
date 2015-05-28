'use strict';
angular.module('pacmanApp')
    .controller('PlaygameCtrl', function ($scope,$http) {
        mainGame.startGame();


        $scope.addScore = function () {
            if ($scope.newScoreName === ''&&$scope.newScore !== 0) {
                return;
            }
            $http.post('/api/highscores', {
                name: $scope.newScoreName,
                score: 123123
            });
            $scope.newScoreName = '';
            $scope.newScore = 0;
        };

    });