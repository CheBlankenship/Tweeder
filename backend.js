var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Twitter");
var bluebird = require("bluebird");
mongoose.Promise = bluebird;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
const token = "define it later";
const uuid = require("node-uuid");

app.use(bodyParser.json());
app.use(express.static("public"));

app.get('/profile/:userID', function(req, res) {
  var theUserID = req.params.userID;
  bluebird.all([
    User.findById(theUserID),
    Tweet.find({ userID: theUserID }).sort('-timestamp')
    .then(function(tweets) {
      console.log(tweets);
      res.json(
        tweets
      );
    })
  ]);
});

app.get('/world/timeline', function(req,res) {
  Tweet.find().sort('-timestamp')
  .then(function(tweets) {
    console.log('Timeline: ', tweets);
    res.json(
      tweets
    );
  });
});


app.get('/userLogin/:userId/:password', function(req, res) {
  var theUserID = req.params.userId;
  var password = req.params.password;
  bluebird.all([
    User.findById(theUserID)
    .then(function(userId) {
      if (userId !== null) {
        if (userId.password === password) {
          res.json({
            token: userId.token
          });
        }
        else {
          var nope = 'nope';
          res.json (
            nope
          );
        }
      }
      else if (userId === null){
        res.json(
          userId
        );
      }
    })
  ]);
});

app.post('/signup', function(req, res) {
  console.log(req.body);
  User.create({
    _id: req.body._id,
    password: req.body.password,
    website: req.body.website,
    avatar_url: req.body.avatar_url,
    token: uuid.v4()
  });
});


app.get('/subfriends/:userID', function(req, res) {
  // add the userID to the button
  var theUserID = req.params.userID || req.body.userID;
  Follow.find({follower: theUserID})
    .then(function(follows) {
      res.json(
        follows
      );
    });
});

app.get('/follower/:userID', function(req, res) {
  var theUserID = req.params.userID || req.body.userID;
  console.log(theUserID);
  Follow.find({following: theUserID})
  .then(function(results) {
    res.json(
      results
    );
  });

});


app.post('/tweet/:userID/:text', function(req, res) {
  Tweet.create({
    text: req.params.text,
    timestamp: new Date(),
    userID: req.params.userID
  })
  .then(function(res) {
    console.log(res);
  });
});

app.post('/follow/:userID', function(req, res) {
  var followUser = req.params.userID;
  Follow.create(
    {
      follower: req.body.followerId,
      following: req.body.followingId || followUser
    }
  )
  .then(function(res) {
    console.log(res.followerID + ' is following', res.followingID);
    console.log("All data" + res);
    res.json(res);
  })
  .catch(function(err) {
    console.log('Error: ', err.message);
  });
});



const User = mongoose.model("User", {
  _id: String, // actually the username
  password: String,
  website: String,
  avatar_url: String,
  token:String
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
