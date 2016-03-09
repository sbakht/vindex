'use strict';

/**
 * @ngdoc service
 * @name vindexApp.videoFactory
 * @description
 * # videoFactory
 * Factory in the vindexApp.
 */
angular.module('vindexApp')
  .factory('VideoFactory', function ($firebaseArray) {

    var refTags = new Firebase("https://vindex.firebaseio.com/tags");
    var refVideos = new Firebase("https://vindex.firebaseio.com/videos");
    var tags = $firebaseArray(refTags);
    var videos = $firebaseArray(refVideos);

    var addVideo = function(title, url, type) {
        var video = {index: videos.length, title: title, sources: [ { src: url, type: "video/" + type } ], timestamps: [] };
        videos.$add(video);
    }

    var addStamp = function(index, stamp) {
      var record = videos.$getRecord(videos.$keyAt(index));
      if(!record.timestamps) {
        record.timestamps = [];
      }
      record.timestamps.push(stamp);
      videos.$save(index);
    } 

    var removeStamp = function(index, stamp) {
      var record = videos.$getRecord(videos.$keyAt(index));
      if(record) {
        var stampIndex = record.timestamps.indexOf(stamp);
        if(stampIndex > -1) {
          record.timestamps.splice(stampIndex, 1);
          videos.$save(index)
        }
      }
    }

    var addTag = function(tag) {
      tags.$add({ label: tag });
      tags.$save();
    }

    return {
      videos: videos,
      tags: tags,
      addVideo: addVideo,
      addStamp: addStamp,
      removeStamp: removeStamp,
      addTag: addTag
    };
  });
