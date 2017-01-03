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
      url: '/worldTimeline'
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
      url: '/follow/' + following,
      method: 'POST',
      data: {
        followerId: follower,
        followingId: following
      }
    });
  };

  service.unFollowUser = function(follower, following) {
    return $http({
      url: '/unfollow/' + follower,
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

    // popup tweeds text box


    // window.onload = function() {
    // document.getElementById("tweed-button").onclick = function(){
    //       var overlay = document.getElementById("overlay");
    //       var popup = document.getElementById("popup");
    //       overlay.style.display = "block";
    //       popup.style.display = "block";
    //   };
    //
    // document.getElementById("CloseBtn").onclick = function(){
    //     var overlay = document.getElementById("overlay");
    //     var popup = document.getElementById("popup");
    //     overlay.style.display = "none";
    //     popup.style.display = "none";
    //   };
    // };


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


// Change the structure
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
      $scope.userStatement = true;
    if($stateParams.userID === $cookies.get('userId')) {
      $scope.userStatement = false;
    }

    $scope.tweedState = true;
    $scope.followerState = false;
    $scope.followingUserState = false;
    console.log("first difinishion ", $scope.followerState);
    console.log("first difinishion ", $scope.followingUserState);
    console.log("first difinishion ", $scope.tweedState);


    TwitterApi.getSubfriends($stateParams.userID).success(function(results) {
      $scope.results = results;
      console.log("People this person following ", results);
      $scope.number = results.length;
    });
    // show the folllower for that person
    $rootScope.connectingStatement = true;
    TwitterApi.getFollower($stateParams.userID).success(function(results) {
      $scope.followers = results;
      console.log("Line 193 get Follower ", results);
      $scope.numberOfFollowers = results.length;
      var len = results.length;
      console.log("number of followers ", $scope.numberOfFollowers);
      for(var i=0; i< len; i++){
        var obj = results[i];
        console.log(obj.follower);
        if($scope.userId === obj.follower){
          $rootScope.connectingStatement = false;
          console.log($rootScope.connectingStatement);
          // location.reload();
        }
      }
    });
    // When I click, it gets the follower persons info and shows it
    $scope.showFollowers = function(){
      console.log("IM clicking this btn");
      TwitterApi.getFollower($stateParams.userID).success(function(getFollower) {
        $scope.getfollowers = getFollower;
        $scope.tweedState = false;
        $scope.followerState = true;
        $scope.followingUserState = false;
        console.log("getfollower difinishion ", $scope.followerState);
        console.log("getfollower difinishion ", $scope.followingUserState);
        console.log("getfollower difinishion ", $scope.tweedState);
        console.log("getting follower info ", $scope.followers);
        console.log(getFollower);
      });
    };

    $scope.tweeds = function() {
      $scope.followingUserState = false;
      $scope.followerState = false;
      $scope.tweedState = true;
      // location.reload();
    };

    TwitterApi.getProfile($stateParams.userID).success(function(result) {
      $scope.tweets = result;
      $scope.tweedsMount = result.length;
      console.log($scope.tweets);
      TwitterApi.getSubfriends($cookies.get('userId')).success(function(result) {
        console.log();
        $scope.len = result.length;
        var leng = result.length;
        console.log($scope.len);
        console.log(result);
        $rootScope.connectingStatement = true;
        console.log($scope.connectingStatement);
        for(var i=0; i< leng; i++){
          var obj = result[i];
          $scope.following = obj.following;
          console.log("Get the value in the for loop ", $scope.following);
          if($stateParams.userID === obj.following){
            $rootScope.connectingStatement = false;
            console.log($rootScope.connectingStatement);
            // location.reload();
          }
        }
      });
    })
    .error(function(err) {
      console.log('Error: ', err.message);
    });
      $scope.showSubfriend = function() {
      TwitterApi.getSubfriends($stateParams.userID).success(function(sub) {
        $scope.tweedState = false;
        $scope.followerState = false;
        $scope.followingUserState = true;
        console.log("followeing friends difinishion ", $scope.followerState);
        console.log("followeing friends difinishion ", $scope.followingUserState);
        console.log("followeing friends difinishion ", $scope.tweedState);
        $scope.subfriend = sub;
        // console.log($scope.subfriend);
      });
    };
// follow a user then change the statement
      $scope.follow = function() {
        TwitterApi.followUser($cookies.get('userId'), $stateParams.userID)
        .success(function(statement) {
          console.log("CHECK IF IM IN THIS PLACE WHEN I CLICK FOLLOW");
          console.log(statement);
          // console.log($rootScope.connectingStatement);
          });
          // $state.go('profile', {}, {reload: true});
          location.reload();
      };

// unfollow a user then change the statement
      $scope.unfollow = function() {
        TwitterApi.unFollowUser($cookies.get('userId'), $stateParams.userID)
        .success(function(statement) {
          console.log("CHECK IF IM IN THIS PLACE WHEN I CLICK unFOLLOW");
          console.log(statement);
        });
        location.reload();
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

// $scope.world = function() {
//   TwitterApi.getWorldtimeline().success(function(result) {
//     console.log(result);
//   });
// });

app.controller('TimeLineController', function($scope, $state, TwitterApi, $rootScope) {
  console.log('CHECK');
  TwitterApi.getWorldtimeline().success(function(timelines) {
    $scope.timelines = timelines;
  })
  .error(function(err) {
    console.log("Error, ", err.message);
  });
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
      name: 'timeline',
      url: '/worldTimeline',
      templateUrl: '/templates/timeline.html',
      controller: 'TimeLineController'
    })
    .state({
      name: 'home',
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: 'HomeController'
    });
});
