'use strict';

describe('Controller: CreateenvironmentCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var CreateenvironmentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateenvironmentCtrl = $controller('CreateenvironmentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CreateenvironmentCtrl.awesomeThings.length).toBe(3);
  });
});
