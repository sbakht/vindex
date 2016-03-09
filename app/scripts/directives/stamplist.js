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
        var key, record;
        var videos = VideoFactory.videos;

        videos.$loaded().then(function(result) {
          key = videos.$keyAt(0);
          scope.video = videos.$getRecord(key);
        }, function(error) {
          console.log("error: " + error);
        });

        scope.$watch('videoIndex', function(newValue, oldValue) {
          if(newValue !== oldValue) {
            key = videos.$keyAt(scope.videoIndex);
            scope.video = videos.$getRecord(key);
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
