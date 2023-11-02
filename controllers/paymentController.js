const { default: axios } = require("axios");
const { BoughtProducts } = require("../models/boughtProducts");
const { CartItem } = require("../models/cartItem");
const { Order } = require("../models/order");
const { Payment } = require("../models/payment");
const { Product } = require("../models/product");
const { Profile } = require("../models/profile");
const PaymentSession = require("ssl-commerz-node").PaymentSession;
const path = require("path");
module.exports.ipn = async (req, res) => {
  const payment = new Payment(req.body);
  const tran_id = payment["tran_id"];
  //validation starts
  let val_id = payment["val_id"] ;         //"2311011857491SQ84DQcpjmxoXg";

let response = await axios.get(`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=abc653cf3571418c&store_passwd=abc653cf3571418c@ssl`)
      
let sslStatus = response.data["status"]; 
//validation ends
  if (sslStatus === "VALID" || sslStatus === "VALIDATED") {
    const order = await Order.findOneAndUpdate(
      { transanction_id: tran_id },
      { status: "complete" }
    
    );
     await CartItem.deleteMany({user:order.user});
    //Here gose all additional operation for assignment
    
    const orders = await Order.find({transanction_id:tran_id}).select({cartItems:1,user:1});
    const productIdAndCount = [];
    const productId = [];
    const boughtUserId = orders[0].user ;
  orders[0].cartItems.forEach(item=>{
    productIdAndCount.push({id:item.product._id,count:item.count});
    productId.push(item.product._id);
    })
    const productss = await Product.find({_id:[...productId]}).select({photo:0,description:0});
   
  for(let j = 0;j<productss.length;j++){
    for(let i = 0 ;i < productIdAndCount.length; i++){
      
      if(productIdAndCount[i].id.toString() === productss[j]._id.toString()){
        productss[j].sold += productIdAndCount[i].count 
        
        productss[j].quantity -= productIdAndCount[i].count
      
      }
    }
  }
//HAVING BOUGHT PRODUCTS START
const bps = await BoughtProducts.findOne({user:boughtUserId}); 
let bpsArr = [] ;
if(bps){
  bpsArr = bps.products ;
}
//HAVING BOUGHT PRODUCTS END 
  productss.forEach(async (item)=>{
    await Product.findByIdAndUpdate(item._id,item);
  });

  //order cartItems adding to bought
  orders[0].cartItems.forEach(item=>{
   //Update or create BoughtProducts
   //boughtUserId,[item._id]
   if(bps){
    //update bought products
    
      if(!bps.products.includes(item.product._id)){
      bpsArr.push(item.product._id);
    
      }

   }else{
    //create bought products arr
 
    bpsArr.push(item.product._id);
  
   }
  })
  //Final touch for bps
  if(bps){
    await BoughtProducts.findOneAndUpdate({user:boughtUserId},{products:[...bpsArr]}) ;
  }else{
    const newBp = new BoughtProducts({user:boughtUserId,products:[...bpsArr]});
    await newBp.save();
  }

  //ADDITIONAL ASSIGNMENT OPERATION ENDS HERE
  } else {
    await Order.deleteOne({ transaction_id: tran_id });
  }
  await payment.save();
  return res.status(200).send("IPN");
};

module.exports.initPayment = async (req, res) => {
  const userId = req.user._id;
  const cartItems = await CartItem.find({ user: userId });
  const profile = await Profile.findOne({ user: userId });

  const { address1, address2, city, state, postcode, country, phone } = profile;

  const total_amount = cartItems
    .map((item) => item.count * item.price)
    .reduce((a, b) => a + b, 0);
  const total_item = cartItems
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);

  const tran_id =
    "_" + Math.random().toString(36).substring(2, 9) + new Date().getTime();

  const payment = new PaymentSession(
    true,
    process.env.SSLCOMMERZ_STORE_ID,
    process.env.SSLCOMMERZ_STORE_PASSWORD
  );

  // Set the urls
  payment.setUrls({
    success: "https://bohubrihi-ecom-backend.onrender.com/api/payment/success", // If payment Succeed
    fail: "https://bohubrihi-ecom-backend.onrender.com/api/payment/failed", // If payment failed
    cancel: "https://bohubrihi-ecom-backend.onrender.com/api/payment/cancled", // If user cancel payment
    ipn: "https://bohubrihi-ecom-backend.onrender.com/api/payment/ipn", // SSLCommerz will send http post request in this link
  });

  // Set order details
  payment.setOrderInfo({
    total_amount: total_amount, // Number field
    currency: "BDT", // Must be three character string
    tran_id: tran_id, //"ref12345667", // Unique Transaction id
    emi_option: 0, // 1 or 0
  });

  // Set customer info
  payment.setCusInfo({
    name: req.user.name,
    email: req.user.email,
    add1: address1,
    add2: address2,
    city: city,
    state: state,
    postcode: postcode,
    country: country,
    phone: phone,
    fax: phone,
  });

  // Set shipping info
  payment.setShippingInfo({
    method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
    num_item: 2,
    name: req.user.name,
    add1: address1,
    add2: address2,
    city: city,
    state: state,
    postcode: postcode,
    country: country,
  });

  // Set Product Profile
  payment.setProductInfo({
    product_name: "Bohubrihi e-com products",
    product_category: "general",
    product_profile: "general",
  });

  const response = await payment.paymentInit();
  let order = new Order({
    cartItems: cartItems,
    user: userId,
    transanction_id: tran_id,
    adress: profile,
  });

  if (response.status === "SUCCESS") {
    order.sessionKey = response["sessionkey"];
    order.save();
  }
  return res.status(200).send(response);
};

module.exports.paymentSuccess = async (req, res) => {
  res.sendFile(path.join(__basedir + "/public/success.html"));
};
module.exports.paymentFailed = async (req, res) => {
  res.sendFile(path.join(__basedir + "/public/failed.html"));
};
module.exports.paymentCancled = async (req, res) => {
  res.sendFile(path.join(__basedir + "/public/cancled.html"));
};
