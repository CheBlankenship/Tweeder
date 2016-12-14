var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Twitter");
var bluebird = require("bluebird");
mongoose.promise = bluebird;


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

// world timeline

// Tweet.find();
//
// // user profile page
//
// bluebird.all([
//   User.findById(theUserID),
//   Tweet.find({ userID: theUserID })
// ])
//
// // your timeline
//
// Follow.find({ follower: theUserID })
//   .then(function(follows) {
//     let followingIds = follows.map(function(follow) {
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
//     // got the tweets
//   });
