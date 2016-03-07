'use strict';

/**
 * @ngdoc function
 * @name vindexApp.controller:AddvideoctrlCtrl
 * @description
 * # AddvideoctrlCtrl
 * Controller of the vindexApp
 */
angular.module('vindexApp')
  .controller('AddVideoCtrl', function ($scope, VideoFactory) {

  	$scope.video = {};

  	$scope.addVideo = function() {
  		VideoFactory.addVideo($scope.video.title, $scope.video.url, "mp4");
  		$scope.video.url = "";
  	}

  });
