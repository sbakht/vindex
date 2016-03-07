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
      	videoIndex: "=",
      	api: "="
      },
      link: function postLink(scope, element, attrs) {
      	scope.stamps = VideoFactory.videos[scope.videoIndex].timestamps;

        scope.$watch('videoIndex', function(newValue, oldValue) {
          if(newValue !== oldValue) {
            scope.stamps = VideoFactory.videos[scope.videoIndex].timestamps;
          }
        }, true);

      	scope.remove = function(stamp) {
      		VideoFactory.removeStamp(scope.videoIndex, stamp);
      	}

      	scope.seek = function(stamp) {
      		scope.api.seekTime(timeStrToSeconds(stamp.time));
      		scope.api.play();
      	}

	  	function timeStrToSeconds(time) {
	  		var minutes = time.match(/\d+/)[0];
	  		var seconds = time.match(/\:(\d+)/)[1];
	  		return parseInt(minutes) * 60 + parseInt(seconds);
	  	}

      }
    };
  });
