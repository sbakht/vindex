'use strict';

/**
 * @ngdoc function
 * @name vindexApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vindexApp
 */
angular.module('vindexApp')
  .controller('MainCtrl', function ($scope, VideoFactory, hotkeys, $timeout, $location) {

		$scope.API = null;
		$scope.videos = VideoFactory.videos;
		$scope.currentTime = 0;
		$scope.currentVideoIndex = 0;
		$scope.activeTagStamps = null;
		$scope.activeTag = null;
		$scope.inputActiveTag = "";
		$scope.newStamp = { time: "00:00", input: "", notes: ""};
	    $scope.tags = [];

		VideoFactory.tags.$loaded().then(function(result) {
			var i = 0;
			while(true) {
				var record = VideoFactory.tags.$getRecord(VideoFactory.tags.$keyAt(i));
				if(record) {
					$scope.tags.push({ label: record.label});
				}else{
					break;
				}
				i++;
			}
		});

	    $scope.videos.$loaded().then(function(result) {
	      	var key = $scope.videos.$keyAt($scope.currentVideoIndex);
	      	var record = $scope.videos.$getRecord(key);
			$scope.activeVideo = record;
			if(!record) {
				$location.path("/addvideo");
			}else{
	      		$scope.config = {
					autoHide: false,
					autoHideTime: 3000,
					autoPlay: false,
					sources: $scope.activeVideo.sources,
					theme: {
						url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
					},
					plugins: {
						poster: "http://www.videogular.com/assets/images/videogular.png"
					}
				};
			}
	    }, function(error) {
	      console.log("error: " + error);
	    });

		$scope.onPlayerReady = function(API) {
			$scope.API = API;
		}

		$scope.onUpdateTime = function(currentTime, duration) {
	  		$scope.currentTime = currentTime;
	  		if($scope.newStamp.input.length === 0) {
	  			$scope.newStamp.time = secondsToTimeStr(currentTime);
	  		}
		}

	  	$scope.createStamp = function() {
	  		if($scope.newStamp.input.length) {
		    	$scope.newStamp.tags = getMatches($scope.newStamp.input, /@(\w+)/g, 1);
				VideoFactory.addStamp($scope.currentVideoIndex, $scope.newStamp);
				createTag();
				resetInputs();
				if($scope.activeTag) { //re-render tag occurences
					$scope.showTagDetails($scope.activeTag);
				}
			}
	  	}

  	  	function resetInputs() {
  			$scope.newStamp = {time: secondsToTimeStr($scope.currentTime), input: "", notes: ""};
  		}


  		$scope.seek = function(index, stamp) {
  			if($scope.currentVideoIndex === index) {
	      		$scope.API.seekTime(timeStrToSeconds(stamp.time));
	      		$scope.API.play();
  			}else{
	  			$scope.setVideo(index);
  				$timeout(function() {
  					$scope.API.seekTime(timeStrToSeconds(stamp.time));
  					$scope.API.play();
  				}, 50);
			}
  		}

		$scope.showTagDetails = function(tag) {
			$scope.activeTag = tag;
			$scope.inputActiveTag = "@" + tag;
			$scope.activeTagStamps = $scope.videos.map(function(video) {
				if(!video.timestamps) {
					return [];
				}
				var stamps = video.timestamps.filter(function(timestamp) {
					if(!timestamp.tags) {
						return false;
					}
					return timestamp.tags.indexOf(tag) > -1;
				});

				if(stamps.length) {
					return [ {index: video.index, title: video.title, timestamps: stamps}]
				}
				return [];

			}).concatAll();  
		}

		$scope.showTagDetailsIfIsValidTag = function() {
			// $scope.inputActiveTag = $scope.inputActiveTag.substring(1); //remove @
			var temp = $scope.inputActiveTag;
			if(temp[0] === "@") {
				temp = temp.substring(1);
			}
			$scope.tags.forEach(function(tag) {
				if(tag.label === temp) {
					$scope.showTagDetails(temp);
					return;
				}
			});
		}

		$scope.setVideo = function(index) {
			$scope.API.stop();
			$scope.config.sources = $scope.videos.$getRecord($scope.videos.$keyAt(index)).sources;
			$scope.currentVideoIndex = index;
			$scope.activeVideo = VideoFactory.videos[$scope.currentVideoIndex];
		};

		function createTag() {
		    var regex = /@(\w+)/g;
		    var matches = getMatches($scope.newStamp.input, regex, 1)
		    var match;
		    var exists;
	    	matches.forEach(function(match) {
	      		exists = false;
	      		$scope.tags.forEach(function(p) {
		        if(p.label == match) {
		            exists = true;
		            return;
		        }
		      	});
		      	if(!exists) {
		        	$scope.tags.push({label: match});
		        	VideoFactory.addTag(match);
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

	  	Array.prototype.concatAll = function() {
			var results = [];
			this.forEach(function(subArray) {
				results.push.apply(results, subArray);
			});

			return results;
		};
		  
		Array.prototype.filter = function(predicateFunction) {
			var results = [];
			this.forEach(function(itemInArray) {
			  if (predicateFunction(itemInArray)) {
				results.push(itemInArray);
			  }
			});

			return results;
		};
		  
		Array.prototype.map = function(projectionFunction) {
			var results = [];
			this.forEach(function(itemInArray) {
				results.push(projectionFunction(itemInArray));

			});

			return results;
		};

  });
