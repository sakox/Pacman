'use strict';

angular.module('pacmanApp')
    .controller('MainCtrl', function ($scope, $http) {
        $scope.highScores = [];


        $http.get('/api/highscores').success(function (highScores) {
            $scope.highScores = highScores;
        });

        $scope.addScore = function () {
            if ($scope.newScoreName === '') {
                return;
            }
            $http.post('/api/highscore', {
                name: $scope.newScoreName,
                score: $scope.newScore
            });
            $scope.newScoreName = '';
            $scope.newScore = '';
        };

        $scope.deleteScore = function (score) {
            $http.delete('/api/highscore/' + score._id);
        };
    });