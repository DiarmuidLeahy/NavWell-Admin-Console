'use strict';

describe('Controller: ExperimentcreateCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var ExperimentcreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExperimentcreateCtrl = $controller('ExperimentcreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ExperimentcreateCtrl.awesomeThings.length).toBe(3);
  });
});
