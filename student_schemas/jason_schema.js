

const User = {
  name : {type: String, unique: true},
  avatar : String,
  followers : [
    {follower_username : String}
  ],
  following : [
    {following_username : String}
  ],
  tweets: [
    {
      text : String,
      timestamp: Date
    }
  ]
};

const Twitter = mongoose.model('Twitter', {
  users: [User]
});

// World timeline

Twitter.findOne()
  .then(function(twitter) {
    var tweets = [];
    twitter.users.forEach(function(user) {
      var convertedTweet = user.tweets.map(function(t) {
        return {
          username: user.name,
          text: t.text,
          timestamp: t.timestamp
        };
      });
      tweets = tweets.concat(convertedTweet);
    });
    // have all the tweets
  });

// User profile

Twitter.findOne()
  .then(function(twitter) {
    var userFound = null;
    twitter.users.forEach(function(user) {
      if (user._id === theUserID) {
        userFound = user;
      }
    });
    // have user and all his tweets
  });

// user timeline

Twitter.findOne()
  .then(function(twitter) {
    var userFound = null;
    twitter.users.forEach(function(user) {
      if (user._id === theUserID) {
        userFound = user;
      }
    });
    var following = user.following;
    var tweets = [];
    twitter.users.forEach(function(user) {
      // if userFound is following user
      if (following.indexOf(user._id) !== -1) {
        var convertedTweet = user.tweets.map(function(t) {
          return {
            username: user.name,
            text: t.text,
            timestamp: t.timestamp
          };
        });
        tweets = tweets.concat(convertedTweet);
      }
    });
    // have user and all his tweets
  });
