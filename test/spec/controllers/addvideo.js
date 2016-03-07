'use strict';

describe('Controller: AddVideoCtrl', function () {

  // load the controller's module
  beforeEach(module('vindexApp'));

  var AddVideoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddVideoCtrl = $controller('AddVideoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddVideoCtrl.awesomeThings.length).toBe(3);
  });
});
