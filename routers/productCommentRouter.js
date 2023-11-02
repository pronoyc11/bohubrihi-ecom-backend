const { getComments, postComment } = require("../controllers/productController");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();

router.route("/:id")
      .get(getComments)
      .post(authorize,postComment);

module.exports = router ;