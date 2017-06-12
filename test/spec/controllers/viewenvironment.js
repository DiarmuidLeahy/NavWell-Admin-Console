'use strict';

describe('Controller: ViewenvironmentCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var ViewenvironmentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewenvironmentCtrl = $controller('ViewenvironmentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ViewenvironmentCtrl.awesomeThings.length).toBe(3);
  });
});
