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
		$scope.onPlayerReady = function(API) {
			$scope.API = API;
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

  });
