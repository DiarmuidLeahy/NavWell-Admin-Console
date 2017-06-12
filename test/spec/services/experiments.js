'use strict';

describe('Service: experiments', function () {

  // load the service's module
  beforeEach(module('navwellAdminApp'));

  // instantiate service
  var experiments;
  beforeEach(inject(function (_experiments_) {
    experiments = _experiments_;
  }));

  it('should do something', function () {
    expect(!!experiments).toBe(true);
  });

});
