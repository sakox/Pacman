'use strict';

angular.module('pacmanApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('playgame', {
        url: '/playgame',
        templateUrl: 'app/playgame/playgame.html',
        controller: 'PlaygameCtrl'
      });
  });