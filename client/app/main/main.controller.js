'use strict';

angular.module('pacmanApp')
    .controller('MainCtrl', function ($scope, $http) {
        $scope.highScores = [];


        $http.get('/api/highscores').success(function (highScores) {
            $scope.highScores = highScores;
        });
    });