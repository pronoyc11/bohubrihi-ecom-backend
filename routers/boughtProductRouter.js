const { getBP, createBP } = require("../controllers/boughtProductControllers");

const router = require("express").Router();

router.route("/")
.get(getBP)
.post(createBP);

module.exports = router ;