'use strict';

describe('Controller: ParticipantsCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var ParticipantsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ParticipantsCtrl = $controller('ParticipantsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ParticipantsCtrl.awesomeThings.length).toBe(3);
  });
});
