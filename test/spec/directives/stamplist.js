'use strict';

describe('Directive: stampList', function () {

  // load the directive's module
  beforeEach(module('vindexApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stamp-list></stamp-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the stampList directive');
  }));
});
