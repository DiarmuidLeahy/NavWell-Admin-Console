'use strict';

describe('Controller: CreateparticipantCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var CreateparticipantCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateparticipantCtrl = $controller('CreateparticipantCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CreateparticipantCtrl.awesomeThings.length).toBe(3);
  });
});
