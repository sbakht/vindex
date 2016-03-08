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
      	api: "=",
        showTagDetails: "&"
      },
      link: function postLink(scope, element, attrs) {
      	scope.stamps = VideoFactory.videos[scope.videoIndex].timestamps;
      	scope.title = VideoFactory.videos[scope.videoIndex].title;

        scope.$watch('videoIndex', function(newValue, oldValue) {
          if(newValue !== oldValue) {
            scope.stamps = VideoFactory.videos[scope.videoIndex].timestamps;
            scope.title = VideoFactory.videos[scope.videoIndex].title;
          }
        }, true);

      	scope.remove = function(stamp) {
      		VideoFactory.removeStamp(scope.videoIndex, stamp);
      	}

      	scope.seek = function(stamp) {
      		scope.api.seekTime(timeStrToSeconds(stamp.time));
      		scope.api.play();
      	}

        scope.callback = function(tag) {
          scope.showTagDetails()(removeMention(tag));
        };

  	  	function timeStrToSeconds(time) {
  	  		var minutes = time.match(/\d+/)[0];
  	  		var seconds = time.match(/\:(\d+)/)[1];
  	  		return parseInt(minutes) * 60 + parseInt(seconds);
  	  	}

          //remove @
        function removeMention(str) {
          return str.substring(1);
        }

      }
    };
  });
