var app = angular.module('Twitter', ['ui.router', 'ngCookies']);

app.factory("TwitterApi", function factoryFunction($http, $rootScope, $cookies, $state) {
  var service = {};

  //Login
  if ($cookies.get('token')) {
    $rootScope.loginState = true;
  }

  else if (!$cookies.get('token')) {
    $rootScope.loginState = false;
  }



  //-------------------------------

  $rootScope.logout = function() {
    console.log('Logout');
    $cookies.remove('token');
    $cookies.remove('userId');
    $state.go('home', {}, {reload: true});
    location.reload();
    console.log("check");
  };

  service.getProfile = function(userID) {
    return $http ({
      url: '/profile/' + userID
    });
  };

  service.getWorldtimeline = function() {
    return $http({
      url: '/world/timeline'
    });
  };


  service.getFollower = function(userID) {
    return $http({
      url: '/follower/' + userID
    });
  };

// get following people!
  service.getSubfriends = function(userID) {
    return $http({
      url: '/subfriends/' + userID
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

  service.followUser = function(follower, following) {
    return $http({
      url: '/follow/' + userID,
      method: 'POST',
      data: {
        followerId: follower,
        followingId: following
      }
    });
  };
  return service;
});



app.controller('HomeController', function($scope, $cookies, TwitterApi, $state, $rootScope) {
  if($rootScope.loginState === true){
    $scope.tweedState = true;
    $scope.followerState = false;
    $scope.followingUserState = false;
    console.log($scope.followerState);
    console.log($scope.followingUserState);
    console.log($scope.tweedState);

    $scope.userId = $cookies.get('userId');
    TwitterApi.getProfile($scope.userId).success(function(result) {
      $scope.tweets = result;
      $scope.tweedsMount = result.length;
      console.log($scope.tweets);
    })
    .error(function(err) {
      console.log('Error: ', err.message);
    });


    $scope.tweet = function(text) {
      TwitterApi.createTweet($scope.userId, text).success(function(res) {
        console.log('Tweeted successfully');
      });
      $state.go('home', {}, {reload: true});
    };


    TwitterApi.getSubfriends($scope.userId).success(function(results) {
      $scope.results = results;
      console.log($scope.results);
      $scope.number = results.length;
    });

    TwitterApi.getFollower($scope.userId).success(function(results) {
      $scope.followers = results;
      $scope.numberOfFollowers = results.length;
      console.log($scope.numberOfFollowers);
    });

    // change tweeds, follow and folower by using ng-if


    $scope.showFollowers = function(){
      TwitterApi.getFollower($scope.userId).success(function(results) {
        $scope.followerState = true;
        $scope.followingUserState = false;
        $scope.tweedState = false;
        $scope.followers = results;
        console.log($scope.followers);
        $scope.numberOfFollowers = results.length;
        console.log($scope.numberOfFollowers);
      });
    };

    $scope.showSubfriend = function() {
      TwitterApi.getSubfriends($scope.userId).success(function(results) {
        $scope.followingUserState = true;
        $scope.followerState = false;
        $scope.tweedState = false;
        $scope.results = results;
        console.log($scope.results);
        $scope.number = results.length;
      });
    };



    $scope.tweeds = function() {
      $scope.followingUserState = false;
      $scope.followerState = false;
      $scope.tweedState = true;
      // location.reload();
    };
    // ------------- swich using ig-if ------------------
  }

  else if($rootScope.loginState === false) {
    TwitterApi.getWorldtimeline().success(function(result) {
      $scope.tweets = result;
    });
  }


});

app.controller('ProfileController', function($scope, $stateParams, TwitterApi, $cookies, $state, $rootScope) {
  console.log($stateParams.userID);
  if($rootScope.loginState === true){
    $scope.userId = $cookies.get('userId');
    console.log($scope.userId);
    TwitterApi.getSubfriends($stateParams.userID).success(function(results) {
      $scope.results = results;
      console.log("People this person following ", results);
      $scope.number = results.length;
    });
    // show the folllower for that person
    TwitterApi.getFollower($stateParams.userID).success(function(results) {
      $scope.followers = results;
      console.log("Line 193 get Follower ", results);
      $scope.numberOfFollowers = results.length;
      console.log("number of followers ", $scope.numberOfFollowers);
    });
    // When I click, it gets the follower persons info and shows it
    $scope.showFollowers = function(){
      console.log("IM clicking this btn");
      TwitterApi.getFollower($stateParams.userID).success(function(getFollower) {
        $scope.followers = getFollower;
        console.log("getting follower info ", $scope.followers);
      });
    };
    TwitterApi.getProfile($stateParams.userID).success(function(result) {
      $scope.tweets = result;
      $scope.tweedsMount = result.length;
      console.log($scope.tweets);
      TwitterApi.getSubfriends($stateParams.userID).success(function(result) {
        console.log();
        $scope.len = result.length;
        var leng = result.length;
        console.log($scope.len);
        console.log(result);
        $rootScope.followingState = true;
        console.log($scope.followingState);
        for(var i=0; i< leng; i++){
          var obj = result[i];
          $scope.following = obj.following;
          if($stateParams.userID === obj.following){
            $rootScope.followingState = false;
            console.log($rootScope.followingState);
            // location.reload();
          }
        }
      });
    })
    .error(function(err) {
      console.log('Error: ', err.message);
    });
// $scope.normal = true;
      $scope.showSubfriend = function() {
      TwitterApi.getSubfriends($stateParams.userID).success(function(sub) {
        $scope.normal = false;
        $scope.subfriend = sub;
        console.log($scope.subfriend);
      });
    };
// follow a user
      $scope.follow = function() {
        TwitterApi.followUser($cookies.get('userId'), $stateParams.userID).success(function(statement) {
          console.log("CHECK IF IM IN THIS PLACE WHEN I CLICK FOLLOW");
          console.log(statement);
          console.log($rootScope.followingState);
          });
          $state.go('profile', {}, {reload: true});
      };
    }
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
          $state.go('home', {}, {reload: true});
        }
      }

      else {
        $state.go('home', {}, {reload: true});
      }
    });
  };
});


app.controller('SignupController', function($scope, $stateParams, $state, TwitterApi, $rootScope) {
  if($rootScope.loginState === false) {
    $scope.userSignup = function(userId, password, website, avatar_url) {
      TwitterApi.userSignup(userId, password, website, avatar_url).success(function(result) {
        console.log(result);
      });
      $state.go('login', {}, {reload: true});
    };
  }
});




app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state({
      name: 'profile',
      url: '/profileInfo/{userID}',
      templateUrl: '/templates/profile.html',
      controller: 'ProfileController'
    })
    .state({
      name: 'login',
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'LoginController'
    })
    .state({
      name: 'signup',
      url: '/signup',
      templateUrl: '/templates/signup.html',
      controller: 'SignupController'
    })
    .state({
      name: 'home',
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: 'HomeController'
    });
});
