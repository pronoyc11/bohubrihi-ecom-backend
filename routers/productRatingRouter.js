const { rating } = require("../controllers/productController");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();

router.route("/")
      .put(authorize,rating);

module.exports = router ;