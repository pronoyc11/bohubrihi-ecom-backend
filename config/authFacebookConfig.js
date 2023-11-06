const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const _ = require("lodash");
const { User } = require("../models/user");

const strategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_REDIRECT_URL,
  },
  async (accessToken, refreshToken, profile, cb) => {
    let user = await User.findOne({
      fbId: profile.id,
      name: profile.displayName,
    });

    if (user) {
      const token = user.genJWT();
      const response = {
        token: token,
        user: _.pick(user, ["_id", "email", "name"]),
      };
      cb(null, response);
    } else {
      user = new User({
        fbId: profile.id,
        name: profile.displayName,
        email: profile.email ? profile.email : Date.now().toString() + Math.round(Math.random()).toString() + "@gmail.com",
        password: "facebook",
      });
      await user.save();
      const token = user.genJWT();
      const response = {
        token: token,
        user: _.pick(user, ["_id", "email", "name"]),
      };
      cb(null, response);
    }
  }
);
passport.use(strategy);
