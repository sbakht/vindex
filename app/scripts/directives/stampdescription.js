'use strict';

/**
 * @ngdoc directive
 * @name vindexApp.directive:stampDescription
 * @description
 * # stampDescription
 */
angular.module('vindexApp')
  .directive('stampDescription', function () {
    return {
      templateUrl: 'views/templates/stampdescription.html',
      restrict: 'E',
      scope: {
      	description: "=",
      	showTagDetails: "&"
      },
      link: function postLink(scope, element, attrs) {
      	scope.descriptionArray = scope.description.split(' ');

      	scope.callback = function(tag) {
      		scope.showTagDetails()(removeMention(tag));
      	};

		//remove @
      	function removeMention(str) {
      		return str.substring(1);
      	}

      }
    };
  });
