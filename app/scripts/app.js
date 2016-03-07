'use strict';

/**
 * @ngdoc overview
 * @name vindexApp
 * @description
 * # vindexApp
 *
 * Main module of the application.
 */
angular
  .module('vindexApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    "cfp.hotkeys",
    "mentio"
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/addvideo', {
        templateUrl: 'views/addvideo.html',
        controller: 'AddVideoCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
