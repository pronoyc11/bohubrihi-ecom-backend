const passport = require("passport");
const { postFB } = require("../controllers/facebookController");

const router = require("express").Router();
// require("../config/authFacebookConfig");


//http://127.0.0.1:3001/auth/facebook
router.route("/")
  .post(postFB)

// router.route("/redirect")
//       .get(passport.authenticate("facebook",{session:false}),(req,res)=>{
//   return res.send(req.user);
//       })// 

module.exports = router;
