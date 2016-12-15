var app = angular.module('Twitter', ['ui.router', 'ngCookies']);

app.factory("TwitterApi", function factoryFunction($http, $rootScope, $cookies, $state) {
  var service = {};

  if ($cookies.get('token')) {
    $rootScope.loginState = true;
  }

  else if (!$cookies.get('token')) {
    $rootScope.loginState = false;
  }

  $rootScope.logout = function() {
    console.log('Logout');
    $cookies.remove('token');
    $cookies.remove('userId');
    $state.go('home');
  };

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

  service.getUserLogin = function(userId, password) {
    return $http ({
      url: '/userLogin/' + userId + '/' + password
    });
  };

  service.userSignup = function(userId, password, website, avatar_url){
    return $http({
      url: '/signup',
      method: 'POST',
      data: {
        _id : userId,
        password: password,
        website: website,
        avatar_url: avatar_url
      }
    });
  };

  service.createTweet = function(userID, text) {
    return $http({
      url: '/tweet/' + userID + '/' + text,
      method: 'POST'
    });
  };

  return service;
});



app.controller('HomeController', function($scope, $cookies, TwitterApi) {
  $scope.userId = $cookies.get('userId');
  TwitterApi.getUserInfo($scope.userId).success(function(result) {
    $scope.tweets = result;
  })
  .error(function(err) {
    console.log('Error: ', err.message);
  });

  $scope.tweet = function(text) {
    TwitterApi.createTweet($scope.userId, text).success(function(res) {
      console.log('Tweeted successfully');
    });
    $state.go('home');
  };
});

app.controller('ProfileController', function($scope, $stateParams, TwitterApi) {
  console.log($stateParams.userID);
  TwitterApi.getProfile($stateParams.userID).success(function(result) {
    $scope.tweets = result;
    console.log($scope.tweets);
  })
  .error(function(err) {
    console.log('Error: ', err);
  });
});

app.controller('LoginController', function($scope, $stateParams, $state, $cookies, TwitterApi, $rootScope) {
  $scope.userLogin = function(userId, password){

    TwitterApi.getUserLogin(userId, password).success(function(result) {
      if (result !== null) {
        if (result === 'nope'){
          console.log('Nope');
        }
        else {
          $rootScope.loginState = true;
          $cookies.put('token', result.token);
          $cookies.put('userId', userId);
          $state.go('home');
        }
      }

      else {
        $state.go('signup');
      }
    });
  };
});

app.controller('SignupController', function($scope, $stateParams, $state, TwitterApi) {
  $scope.userSignup = function(userId, password, website, avatar_url) {
    TwitterApi.userSignup(userId, password, website, avatar_url).success(function(result) {
      console.log(result);
    });
  };

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
      name: 'login',
      url: '/login',
      templateUrl: 'login.html',
      controller: 'LoginController'
    })
    .state({
      name: 'signup',
      url: '/signup',
      templateUrl: 'signup.html',
      controller: 'SignupController'
    })
    .state({
      name: 'home',
      url: '/home',
      templateUrl: 'home.html',
      controller: 'HomeController'
    });
});
