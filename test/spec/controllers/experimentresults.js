'use strict';

describe('Controller: ExperimentresultsCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var ExperimentresultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExperimentresultsCtrl = $controller('ExperimentresultsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ExperimentresultsCtrl.awesomeThings.length).toBe(3);
  });
});
