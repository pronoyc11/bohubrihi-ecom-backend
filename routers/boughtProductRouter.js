const { getBP, createBP } = require("../controllers/boughtProductControllers");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();

router.route("/")
.get(authorize,getBP)
.post(createBP);

module.exports = router ;