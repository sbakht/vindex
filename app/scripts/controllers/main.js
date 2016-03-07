'use strict';

/**
 * @ngdoc function
 * @name vindexApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vindexApp
 */
angular.module('vindexApp')
  .controller('MainCtrl', function ($scope, VideoFactory) {

		$scope.API = null;
		$scope.videos = VideoFactory.videos;
		$scope.currentTime = 0;
		$scope.stamps = [];
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
				$scope.stamps.push($scope.newStamp);
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
			sources: VideoFactory.videos[0].sources,
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
		};

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

  });
