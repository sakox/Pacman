'use strict';

describe('Controller: PlaygameCtrl', function () {

  // load the controller's module
  beforeEach(module('pacmanApp'));

  var PlaygameCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaygameCtrl = $controller('PlaygameCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
