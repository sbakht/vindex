'use strict';

/**
 * @ngdoc directive
 * @name vindexApp.directive:stampList
 * @description
 * # stampList
 */
angular.module('vindexApp')
  .directive('stampList', function (VideoFactory) {
    return {
      templateUrl: 'views/templates/stamplist.html',
      restrict: 'E',
      scope : {
      	videoIndex: "="
      },
      link: function postLink(scope, element, attrs) {
      	scope.stamps = VideoFactory.videos[scope.videoIndex].timestamps;

        scope.$watch('videoIndex', function(newValue, oldValue) {
          if(newValue !== oldValue) {
            scope.stamps = VideoFactory.videos[scope.videoIndex].timestamps;
          }
        }, true);

      }
    };
  });
