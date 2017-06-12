'use strict';

describe('Controller: ExperimentsCtrl', function () {

  // load the controller's module
  beforeEach(module('navwellAdminApp'));

  var AboutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExperimentsCtrl = $controller('ExperimentsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
