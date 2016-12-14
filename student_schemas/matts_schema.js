
const User = mongoose.model('User', {
 username: String,
 password: String,
 following: [ObjectId],
 followers: [ObjectId]
});

const Tweet = mongoose.model('Tweet', {
 tweet: String,
 date: Date,
 username: String,
 userID: ObjectId
});

// World Timeline

Tweet.find().limit(20)

// User Profile page

bluebird.all([
  Tweet.find({ userID: theUserID }).limit(20),
  User.findById(theUserId)
])
.spread(function(tweets, user) {

});

// My timeline

User.findById(theUserId)
  .then(function(user) {
    return Tweet.find({
      userID: {
        $in: user.following.concat([user._id])
      }
    });
  })
  .then(function(tweets) {
    // you have the tweets
  });
