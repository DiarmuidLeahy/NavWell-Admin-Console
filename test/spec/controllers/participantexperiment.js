'use strict';

describe('Controller: ParticipantexperimentCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var ParticipantexperimentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ParticipantexperimentCtrl = $controller('ParticipantexperimentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ParticipantexperimentCtrl.awesomeThings.length).toBe(3);
  });
});
