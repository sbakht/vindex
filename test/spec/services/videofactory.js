'use strict';

describe('Service: VideoFactory', function () {

  // load the service's module
  beforeEach(module('vindexApp'));

  // instantiate service
  var VideoFactory;
  beforeEach(inject(function (_VideoFactory_) {
    VideoFactory = _videoFactory_;
  }));

  it('should do something', function () {
    expect(!!VideoFactory).toBe(true);
  });

});
