'use strict';

describe('Controller: EnvironmentsCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var EnvironmentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EnvironmentsCtrl = $controller('EnvironmentsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EnvironmentsCtrl.awesomeThings.length).toBe(3);
  });
});
