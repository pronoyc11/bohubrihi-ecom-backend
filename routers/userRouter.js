const express = require("express");
const router = express.Router();
const { signUp, signIn, googleSignIn } = require("../controllers/userControllers");






router.route("/signUp")
.post(signUp)

router.route("/signIn")
.post(signIn);

router.route("/google/signIn")
      .post(googleSignIn)


module.exports = router ;