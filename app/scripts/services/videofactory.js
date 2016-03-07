'use strict';

/**
 * @ngdoc service
 * @name vindexApp.videoFactory
 * @description
 * # videoFactory
 * Factory in the vindexApp.
 */
angular.module('vindexApp')
  .factory('VideoFactory', function ($sce) {
  // .factory('videoFactory', function ($firebaseArray) {

    // var ref = new Firebase("https://forkpoll.firebaseio.com");
    // var polls = $firebaseArray(ref);
    
    // var getPolls = function() {
    //     return $firebaseArray(ref);
    // };

    // var addPoll = function(poll) {
    //     return polls.$add(poll);
    // };

    // var removePoll = function(poll) {
    //     var index = polls.indexOf(poll);
    //     if(index !== -1) {
    //         polls.splice(index, 1);
    //     }
    // };

    var videos = [
      {
        sources: [
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
        ]
      },
      {
        sources: [
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov"), type: "video/mp4"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"), type: "video/ogg"}
        ]
      }
    ];

    return {
      videos: videos,
      // getPolls: getPolls,
      // addPoll: addPoll,
      // removePoll: removePoll
    };
  });
