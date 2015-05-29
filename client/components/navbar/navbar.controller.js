'use strict';

angular.module('pacmanApp')
    .controller('NavbarCtrl', function ($scope, $location) {
        $scope.menu = [{
                'title': 'Home',
                'link': '/'
    }, {
                'title': 'Game',
                'link': '/playgame'
    }
                  ];

        $scope.isCollapsed = true;

        $scope.isActive = function (route) {
            return route === $location.path();
        };
    });