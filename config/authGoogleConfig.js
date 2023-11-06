const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const _ = require("lodash");
const { User } = require("../models/user");

const strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL,
  },
  async (accessToken, refreshToken, profile, cb) => {

 
    let user = await User.findOne({
      googleId: profile.id,
      email: profile._json.email,
    });

    if (user) {
      //console.log("User existed",user);
      const token = user.genJWT();
      const response = {
        user: _.pick(user, ["email", "_id","name"]),
        token: token,
      };
      cb(null, response);
    } else {
      user = new User({ googleId: profile.id, email: profile._json.email,name:profile._json.name,password:"google" });
      await user.save();
      const token = user.genJWT();
      const response = {
        user: _.pick(user, ["email", "_id","name"]),
        token: token,
      };
      cb(null, response);
      //console.log("New user:",user);
    }
  }
);

passport.use(strategy);
