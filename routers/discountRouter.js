const { getDiscount, createDiscount } = require("../controllers/discountController");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");


const router = require("express").Router();

router.route("/")
      .get(getDiscount)
      .post([authorize,admin],createDiscount)


module.exports = router ;