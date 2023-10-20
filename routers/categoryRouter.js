const { createCategory, categoryList } = require("../controllers/categorryControlers");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();



router.route("/")
      .get(categoryList)
      .post([authorize,admin],createCategory)

module.exports = router ;