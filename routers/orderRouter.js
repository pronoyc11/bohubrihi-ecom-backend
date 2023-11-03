const { getOrders, deleteOrders } = require("../controllers/orderController");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();

router.route("/")
      .get(authorize,getOrders)
      .delete(authorize,deleteOrders)

module.exports = router ;
