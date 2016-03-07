'use strict';

/**
 * @ngdoc function
 * @name vindexApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vindexApp
 */
angular.module('vindexApp')
  .controller('MainCtrl', function ($scope, VideoFactory, hotkeys) {

		$scope.API = null;
		$scope.videos = VideoFactory.videos;
		$scope.currentTime = 0;
		$scope.currentVideoIndex = 0;
		$scope.onPlayerReady = function(API) {
			$scope.API = API;
		}

		$scope.onUpdateTime = function(currentTime, duration) {
	  		$scope.currentTime = currentTime;
	  		if($scope.newStamp.input.length === 0) {
	  			$scope.newStamp.time = secondsToTimeStr(currentTime);
	  		}
		}

		$scope.newStamp = { time: "00:00", input: ""};

	  	$scope.createStamp = function() {
	  		if($scope.newStamp.input.length) {
				VideoFactory.addStamp($scope.currentVideoIndex, $scope.newStamp);
				createTag();
				resetInputs();
			}
	  	}

  	  	function resetInputs() {
  			$scope.newStamp = {time: secondsToTimeStr($scope.currentTime), input: ""};
  		}

		$scope.config = {
			autoHide: false,
			autoHideTime: 3000,
			autoPlay: false,
			sources: VideoFactory.videos[$scope.currentVideoIndex].sources,
			theme: {
				url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
			},
			plugins: {
				poster: "http://www.videogular.com/assets/images/videogular.png"
			}
		};

		$scope.setVideo = function(index) {
			$scope.API.stop();
			$scope.config.sources = VideoFactory.videos[index].sources;
			$scope.currentVideoIndex = index;
		};

	    $scope.tags = [
		    { label: 'Joe'},
		    { label: 'Mike'},
		    { label: 'Diane'}
		];

		function createTag() {
		    var regex = /@(\w+)/g;
		    var matches = getMatches($scope.newStamp.input, regex, 1)
		    var match;
		    var exists;
	    	matches.forEach(function(match) {
	      		exists = false;
	      		$scope.tags.forEach(function(p) {
		        if(p.label.toLowerCase() == match.toLowerCase()) {
		            exists = true;
		            return;
		        }
		      	});
		      	if(!exists) {
		        	$scope.tags.push({label: match});
		      	}
	    	});
	   }
  
		function getMatches(string, regex, index) {
			index || (index = 1); // default to the first capturing group
		    var matches = [];
	   	    var match;
			while (match = regex.exec(string)) {
			    matches.push(match[index]);
			}
			return matches;
		}

	  	hotkeys.add({
		    combo: 'alt+up',
		    description: '+1 to creating stamp time',
		    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
		    callback: function() {
		      var videoLength = $scope.API.totalTime;
		      var seconds = timeStrToSeconds($scope.newStamp.time) + 1;
		      if(seconds <= videoLength) {
		      	$scope.newStamp.time = secondsToTimeStr(seconds);
		      }
		    }
		});

	  	hotkeys.add({
		    combo: 'alt+down',
		    description: '-1 to creating stamp time',
		    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
		    callback: function() {
		      var seconds = timeStrToSeconds($scope.newStamp.time) - 1;
		      if(seconds >= 0) {
		      	$scope.newStamp.time = secondsToTimeStr(seconds);
		  	  }
		    }
		});

	  	hotkeys.add({
		    combo: 'shift+up',
		    description: '+5 to creating stamp time',
		    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
		    callback: function() {
		      var videoLength = $scope.API.totalTime;
		      var seconds = timeStrToSeconds($scope.newStamp.time) + 5;
		      if(seconds <= videoLength) {
		      	$scope.newStamp.time = secondsToTimeStr(seconds);
		      }
		    }
		});

	  	hotkeys.add({
		    combo: 'shift+down',
		    description: '-5 to creating stamp time',
		    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
		    callback: function() {
		      var seconds = timeStrToSeconds($scope.newStamp.time) - 5;
		      if(seconds >= 0) {
		      	$scope.newStamp.time = secondsToTimeStr(seconds);
		  	  }
		    }
		});


	  	function secondsToTimeStr(time) {
	  		var seconds = Math.floor(time % 60);
	  		var minutes = Math.floor(time / 60);
	  		if(seconds < 10) {
	  			seconds = "0" + seconds;
	  		}
	  		if(minutes < 10) {
	  			minutes = "0" + minutes;
	  		}
	  		return minutes + ":" + seconds; 
	  	}

	  	function timeStrToSeconds(time) {
	  		var minutes = time.match(/\d+/)[0];
	  		var seconds = time.match(/\:(\d+)/)[1];
	  		return parseInt(minutes) * 60 + parseInt(seconds);
	  	}

  });
