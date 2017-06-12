'use strict';

describe('Service: environments', function () {

  // load the service's module
  beforeEach(module('navwellAdminApp'));

  // instantiate service
  var environments;
  beforeEach(inject(function (_environments_) {
    environments = _environments_;
  }));

  it('should do something', function () {
    expect(!!environments).toBe(true);
  });

});
