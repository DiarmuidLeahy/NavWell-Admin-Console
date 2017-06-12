'use strict';

describe('Directive: angularCanvasHelper', function () {

  // load the directive's module
  beforeEach(module('navwellAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<angular-canvas-helper></angular-canvas-helper>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the angularCanvasHelper directive');
  }));
});
