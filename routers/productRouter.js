const { createProduct, getProducts, getProductById, updateProductById, getPhoto, filterProducts, rating } = require("../controllers/productController");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

const router = require("express").Router();



router.route("/")
      .get(getProducts)
      .post([authorize,admin],createProduct);

router.route("/:id")
 .get(getProductById)
 .put([authorize,admin],updateProductById);
 
router.route("/photo/:id")
.get(getPhoto);

router.route("/filter")
       .post(filterProducts);

 module.exports = router ;