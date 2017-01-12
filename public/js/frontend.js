var app = angular.module('Twitter', ['ui.router', 'ngCookies']);


app.factory("TwitterApi", function factoryFunction($http, $rootScope, $cookies, $state) {
  //-------------------------------
  $rootScope.worldStatement = false;
  $rootScope.loginState = false;
  //Login
  if ($cookies.get('token')) {
    $rootScope.loginState = true;
    console.log($rootScope.loginState);
  }

  else if (!$cookies.get('token')) {
    $rootScope.loginState = false;
    console.log($rootScope.loginState);
  }

  var service = {};

  $rootScope.logout = function() {
    console.log('Logout');
    $cookies.remove('token');
    $cookies.remove('userId');
    // $state.go('world', {}, {reload: true});
    location.reload();
    // console.log("check");
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

  service.userSignup = function(userId, password, website, avatar_url, location_name, introduction){
    return $http({
      url: '/signup',
      method: 'POST',
      data: {
        _id : userId,
        password: password,
        website: website,
        avatar_url: avatar_url,
        location_name: location_name,
        introduction: introduction
      }
    });
  };

  // service.edit = function(userID) {
  //   var tokenID = $cookies.get('token');
  //   return $http ({
  //     url: '/edit/' + userID + '/' + tokenID
  //   });
  // };

  service.userUpdate = function(userID, password, website, avatar_url, location_name, introduction) {
    return $http({
      url: '/edit/' + userID,
      method: 'POST',
      data: {
        // username: userId,
        _id: userID,
        password: password,
        website: website,
        avatar_url: avatar_url,
        location_name: location_name,
        introduction: introduction
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


  service.getUserInformation = function(userID){
    return $http({
      url: '/userInformation/' + userID,
      method: 'GET'
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
      console.log("User tweed >> ", result);
      $scope.tweedsMount = result.length;
      console.log($scope.tweets);
    })
    .error(function(err) {
      console.log('Error: ', err.message);
    });

    $scope.tweedingStatement = false;
    $scope.letsTweed = function(){
      if($scope.tweedingStatement === false){
        $scope.tweedingStatement = true;
      }
      else if($scope.tweedingStatement === true){
        $scope.tweedingStatement = false;
      }
    };

    $scope.tweet = function(text) {
      var lenlen = text.length;
      if(lenlen > 0){
        TwitterApi.createTweet($scope.userId, text).success(function(res) {
          console.log('Tweeted successfully');
        });
        $state.go('home', {}, {reload: true});
      }
    };

    TwitterApi.getUserInformation($scope.userId).success(function(usersInformation){
      console.log("Users home info >> ", usersInformation);
      $scope.usersInformation = usersInformation;
    })
    .error(function(err) {
      console.log(err.message);
    });


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
    var editId = $scope.userId;
    $scope.edit = function(){
      // var cookieId = $cookies.get('token');
      console.log(cookieId);
      $state.go("edit");
    };
    // ------------- swich using ig-if ------------------
  }


// Change the structure
  else if($rootScope.loginState === false) {
    TwitterApi.getWorldtimeline().success(function(result) {
      $scope.tweets = result;
      console.log("CHEKV >>", result);
      $state.go("world");
      location.reload();
    });
  }
});

app.controller('HelloController', function($scope, $stateParams, TwitterApi, $cookies, $state, $rootScope){
  $rootScope.loginState = false;
  // $scope.searchWorld = false;
  // $scope.welcomeAll = false;
  //Login
  if ($cookies.get('token')) {
    $rootScope.loginState = true;
    console.log($rootScope.loginState);
    $state.go('home');
  }

  else if (!$cookies.get('token')) {
    $rootScope.loginState = false;
    console.log($rootScope.loginState);
    console.log('CHECK');
    TwitterApi.getWorldtimeline().success(function(timelines) {
      $scope.timelines = timelines;
      console.log(timelines);
      $state.go('world');
    })
    .error(function(err) {
      console.log("Error, ", err.message);
    });

    $scope.searchTheWorld = function() {
      $scope.searchWorld = true;
      $scope.welcomeAll = true;
    };

    $scope.world = function() {
      $state.go('world');
    };
  }
});

app.controller('ProfileController', function($scope, $stateParams, TwitterApi, $cookies, $state, $rootScope) {
  console.log($stateParams.userID);
  $rootScope.logout = function() {
    console.log('Logout');
    $cookies.remove('token');
    $cookies.remove('userId');
    $state.go('world', {}, {reload: true});
    location.reload();
    // console.log("check");
  };
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

    TwitterApi.getUserInformation($stateParams.userID).success(function(usersInformation){
      console.log("Users home info >> ", usersInformation);
      $scope.usersInformation = usersInformation;
    })
    .error(function(err) {
      console.log(err.message);
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
      $scope.worldStatement = true;
      $scope.tweets = result;
      console.log("$scope.tweets >> ", result);
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
    $scope.userSignup = function(userId, password, website, avatar_url, location_name, introduction) {
      TwitterApi.userSignup(userId, password, website, avatar_url, location_name, introduction).success(function(result) {
        console.log("Check if I m in");
        console.log(result);
      });
      $state.go('login', {}, {reload: true});
    };
  }
});

app.controller('EditController', function($scope, $stateParams, $state, TwitterApi, $rootScope, $cookies) {
  // var token = $cookies.get('token');
  // console.log(token);
  console.log("If IM in here");
  $scope.userUpdate = function(userId, password, website, avatar_url, location_name, introduction){
    console.log("Call update func");
    TwitterApi.userUpdate(userId, password, website, avatar_url, location_name, introduction).success(function(result) {
      console.log("Edit result >> ", result);
    })
    .error(function(err) {
      console.log("ERROR >> ", err.message);
    });
    // $state.go('home', {}, {reload: true});
  };
});



app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  // .state({
  //   name: 'hello',
  //   url: '/',
  //   templateUrl: 'index.html',
  //   controller: 'HelloController'
  // })
    .state({
      name: 'home',
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: 'HomeController'
    })
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
      name: 'world',
      url: '/world',
      templateUrl: '/templates/world.html',
      // controller: 'WorldController'
    })
    .state({
      name: 'edit',
      url: '/edit',
      templateUrl: '/templates/edit_profile.html',
      controller: 'EditController'
    });
});
