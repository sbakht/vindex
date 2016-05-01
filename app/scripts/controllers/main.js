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
		$scope.currentVideoId = 0;
		$scope.activeTagStamps = null;
		$scope.activeTag = null;
		$scope.inputActiveTag = "";
		$scope.newStamp = { time: "00:00", input: "", notes: ""};
	    $scope.tags = [];

		initHotkeys();
	  	initArrayHelpers();

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
	      	var key = $scope.videos.$keyAt(0);
	      	$scope.currentVideoId = key;
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
	      console.log("error loading video: " + error);
	    });

		$scope.onPlayerReady = function(API) {
			$scope.API = API;
		}

		$scope.onUpdateTime = function(currentTime, duration) {
	  		$scope.currentTime = currentTime;
	  		if($scope.newStamp.input.length === 0) {
	  			$scope.newStamp.time = util.
	  			util.secondsToTimeStr(currentTime);
	  		}
		}

	  	$scope.createStamp = (function() {

			function addNewTags(tags) {
	  			tags.filter( tag => isNewTag(tag) ).map( tag => addTag(tag) );
		    }

		    function isNewTag(tag) {
		      	return !$scope.tags.some( item => tag === item.label );
		    }

		    function addTag(tag) {
	        	$scope.tags.push({label: tag});
	        	VideoFactory.addTag(tag);
		    }

	  		return function() {
		  		var stamp = $scope.newStamp;
		  		if(stamp.input.length > 0) {
			    	stamp.tags = util.getMatches(stamp.input, /@(\w+)/g, 1);
					VideoFactory.addStamp($scope.currentVideoId, stamp);

					addNewTags(stamp.tags);

					resetInputs();
					if($scope.activeTag) { //re-render tag occurences
						$scope.showTagDetails($scope.activeTag);
					}
				}
			}
	  	})()

  	  	function resetInputs() {
  			$scope.newStamp = {time: util.secondsToTimeStr($scope.currentTime), input: "", notes: ""};
  		}


  		$scope.seek = function(id, stamp) {
  			if($scope.currentVideoId === id) {
	      		$scope.API.seekTime(util.timeStrToSeconds(stamp.time));
	      		$scope.API.play();
  			}else{
	  			$scope.setVideo(id);
  				$timeout(function() {
  					$scope.API.seekTime(util.timeStrToSeconds(stamp.time));
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
					return [ {id: video.$id, title: video.title, timestamps: stamps}]
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

		$scope.setVideo = function(id) {
			$scope.API.stop();
			$scope.config.sources = $scope.videos.$getRecord(id).sources;
			$scope.currentVideoId = id;
			$scope.activeVideo = $scope.videos.$getRecord(id);
		};


		var util = {
		  	secondsToTimeStr: function(time) {
		  		var seconds = Math.floor(time % 60);
		  		var minutes = Math.floor(time / 60);
		  		if(seconds < 10) {
		  			seconds = "0" + seconds;
		  		}
		  		if(minutes < 10) {
		  			minutes = "0" + minutes;
		  		}
		  		return minutes + ":" + seconds; 
		  	},
		  	timeStrToSeconds: function(time) {
		  		var minutes = time.match(/\d+/)[0];
		  		var seconds = time.match(/\:(\d+)/)[1];
		  		return parseInt(minutes) * 60 + parseInt(seconds);
		  	},
		  	getMatches: function(string, regex, index) {
				index || (index = 1); // default to the first capturing group
			    var matches = [];
		   	    var match;
				while (match = regex.exec(string)) {
				    matches.push(match[index]);
				}
				return matches;
			}
	  	};

	  	function initArrayHelpers() {
		  	Array.prototype.concatAll = function() {
				var results = [];
				this.forEach(function(subArray) {
					results.push.apply(results, subArray);
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
		}

		function initHotkeys() {
			var allowIn = ['INPUT', 'SELECT', 'TEXTAREA'];
		  	hotkeys.add({
			    combo: 'alt+left',
			    description: '-5 to video time',
			    allowIn: allowIn, 
			    callback: function(event) {
			  	  event.preventDefault();
	  	          $scope.API.seekTime($scope.currentTime - 5);
		      	  $scope.API.play();
			    }
			});
		  	hotkeys.add({
			    combo: 'alt+right',
			    description: '+5 to video time',
			    allowIn: allowIn, 
			    callback: function(event) {
			  	  event.preventDefault();
	  	          $scope.API.seekTime($scope.currentTime + 5);
		      	  $scope.API.play();
			    }
			});

		  	hotkeys.add({
			    combo: 'shift+right',
			    description: '+5 to creating stamp time',
			    allowIn: allowIn, 
			    callback: function(event) {
		    	event.preventDefault();
			      var videoLength = $scope.API.totalTime;
			      var seconds = util.timeStrToSeconds($scope.newStamp.time) + 5;
			      if(seconds <= videoLength) {
			      	$scope.newStamp.time = util.secondsToTimeStr(seconds);
			      }
			    }
			});

		  	hotkeys.add({
			    combo: 'shift+left',
			    description: '-5 to creating stamp time',
			    allowIn: allowIn, 
			    callback: function(event) {
		    	  event.preventDefault();
			      var seconds = util.timeStrToSeconds($scope.newStamp.time) - 5;
			      if(seconds >= 0) {
			      	$scope.newStamp.time = util.secondsToTimeStr(seconds);
			  	  }
			    }
			});

		  	hotkeys.add({
			    combo: 'ctrl+space',
			    description: 'set creating stamp time to current video time',
			    allowIn: allowIn, 
			    callback: function() {
			      	$scope.newStamp.time = util.secondsToTimeStr($scope.currentTime);
			    }
			});

		}

  });
