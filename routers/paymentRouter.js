const router = require("express").Router();
const { initPayment, ipn, paymentSuccess, paymentCancled, paymentFailed } = require("../controllers/paymentController");
const authorize = require("../middlewares/authorize");

router.route("/")
 .get(authorize,initPayment);

 router.route("/ipn")
 .post(ipn);

 router.route("/success")
    .post(paymentSuccess);
router.route("/cancled")
    .post(paymentCancled)
router.route("/failed")
    .post(paymentFailed)

 module.exports = router