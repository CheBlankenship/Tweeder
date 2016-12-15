var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Twitter");
var bluebird = require("bluebird");
mongoose.promise = bluebird;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static("public"));

app.get('/profile/:userID', function(req, res) {
  var theUserID = req.params.userID;
  bluebird.all([
    User.findById(theUserID),
    Tweet.find({ userID: theUserID })
    .then(function(tweets) {
      res.json(
        tweets
      );
    })
  ]);
});

app.get('/user_info/:userID', function(req, res) {
  var theUserID = req.params.userID;
  Follow.find({ follower: theUserID })
    .then(function(follows) {
      var followingIds = follows.map(function(follow) {
        return follow.following;
      });
      // find all following's tweets
      return Tweet.find({
        userID: {
          $in: followingIds.concat([theUserID])
        }
      });
    })
    .then(function(tweets) {
      res.json(tweets);
    });
});

const User = mongoose.model("User", {
  _id: String, // actually the username
  website: String,
  avatar_url: String
});

const Tweet = mongoose.model("Tweet", {
  text: String,
  timestamp: Date,
  userID: String // points to User._id
});

const Follow = mongoose.model("Follow", {
  follower: String,
  following: String
});

app.listen(3000, function() {
  console.log('Listening on 3000');
});

// User.create({
//   _id: 'guy',
//   website: 'www.buddy.com',
//   avatar_url: '@notyourfriend'
// });

// Follow.create(
//   {
//     follower: 'robdunn220',
//     following: 'guy'
//   }
// )
// .then(function(res) {
//   console.log(res.follower + ' is following', res.following);
// })
// .catch(function(err) {
//   console.log('Error: ', err.message);
// });

// Tweet.create({
//   text: 'Im not your buddy, pal!',
//   timestamp: new Date(),
//   userID: 'guy'
// })
// .then(function(res) {
//   console.log(res);
// });

// world timeline

// Tweet.find()
// .then(function(tweets) {
//   console.log('Timeline: ', tweets);
// });
//
// // user profile page
//

// var theUserID = 'robdunn220';
//
// bluebird.all([
//   User.findById(theUserID),
//   Tweet.find({ userID: theUserID })
//   .then(function(tweets) {
//     console.log(tweets);
//   })
// ]);

//
// // your timeline
// //
// var theUserID = 'guy';
// Follow.find({ follower: theUserID })
//   .then(function(follows) {
//     var followingIds = follows.map(function(follow) {
//       return follow.following;
//     });
//     // find all following's tweets
//     return Tweet.find({
//       userID: {
//         $in: followingIds.concat([theUserID])
//       }
//     });
//   })
//   .then(function(tweets) {
//     console.log(tweets);
//   });
