'use strict';
angular.module('pacmanApp')
    .controller('PlaygameCtrl', function ($scope,$http) {
        mainGame.startGame();

        $scope.addScore = function () {
            if ($scope.newScoreName === ''&&$scope.newHighScore !== 0) {
                return;
            }
            $scope.newHighScore = parseInt( document.getElementById('scoreText').value) ;
            $http.post('/api/highscores', {
                name: $scope.newScoreName,
                score: $scope.newHighScore
            });
            $scope.newScoreName = '';
            $scope.newScore = 0;
            document.getElementById('scoreText').value = 0;
        };

    });