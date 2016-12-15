var app = angular.module('Twitter', ['ui.router']);

app.factory("TwitterApi", function factoryFunction($http) {
  var service = {};

  service.getProfile = function(userID) {
    return $http ({
      url: '/profile/' + userID
    });
  };

  service.getUserInfo = function(userID) {
    return $http ({
      url: '/user_info/' + userID
    });
  };

  return service;
});

app.controller('HomeController', function($scope, $stateParams, TwitterApi) {
  TwitterApi.getUserInfo($stateParams.userID).success(function(result) {
    $scope.tweets = result;
    console.log($scope.tweets);
  })
  .error(function(err) {
    console.log('Error: ', err.message);
  });
});

app.controller('ProfileController', function($scope, $stateParams, TwitterApi) {
  console.log($stateParams.userID);
  TwitterApi.getProfile($stateParams.userID).success(function(result) {
    $scope.tweets = result;
    console.log($scope.tweets);
  })
  .error(function(err) {
    console.log('Error: ', err.message);
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state({
      name: 'profile',
      url: '/profileInfo/{userID}',
      templateUrl: 'profile.html',
      controller: 'ProfileController'
    })
    .state({
      name: 'home',
      url: '/home/{userID}',
      templateUrl: 'home.html',
      controller: 'HomeController'
    });
});
