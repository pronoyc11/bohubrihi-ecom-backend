const passport = require("passport");

const router = require("express").Router();
require("../config/authGoogleConfig");


//http://127.0.0.1:3001/auth/google
router.route("/")
      .get(passport.authenticate("google",{scope:["profile","email"]}))


//http://127.0.0.1:3001/auth/google/redirect
router.route("/redirect")
      .get(passport.authenticate("google",{session:false}),(req,res)=>{

            return res.send(req.user);
      })
 

module.exports = router ;