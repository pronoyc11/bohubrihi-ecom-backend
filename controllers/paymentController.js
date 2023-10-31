const { CartItem } = require("../models/cartItem");
const { Order } = require("../models/order");
const { Payment } = require("../models/payment");
const { Profile } = require("../models/profile");
const PaymentSession = require("ssl-commerz-node").PaymentSession;
const path = require("path");
module.exports.ipn = async (req, res) => {
  const payment = new Payment(req.body);
  const tran_id = payment["tran_id"];
  if(payment["status"] === "VALID"){
    const order = await Order.updateOne({transanction_id:tran_id},{status:"complete"});
    
    const count = order.cartItems ;
    console.log(count);
    
    await CartItem.deleteMany(order.cartItems)
    //Here gose all additional operation for assignment



  }else{
    await Order.deleteOne({transaction_id:tran_id})
  }
  await payment.save();
  return res.status(200).send('IPN');
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
    .reduce((a, b) => a + b,0);

  const tran_id =
    "_" + Math.random().toString(36).substring(2, 9) + (new Date()).getTime();

  const payment = new PaymentSession(
    true,
    process.env.SSLCOMMERZ_STORE_ID,
    process.env.SSLCOMMERZ_STORE_PASSWORD
  );

  // Set the urls
  payment.setUrls({
    success: "https://bohubrihi-ecom-backend.onrender.com/api/payment/success", // If payment Succeed
    fail: "yoursite.com/fail", // If payment failed
    cancel: "yoursite.com/cancel", // If user cancel payment
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
    cartItem: cartItems,
    user: userId,
    transanction_id: tran_id,
    adress: profile,
  });
  
  if(response.status === "SUCCESS"){
    order.sessionKey = response["sessionkey"]; 
    order.save();
  }
  return res.status(200).send(response);
};

module.exports.paymentSuccess = async (req,res) =>{
res.sendFile(path.join(__basedir + "/public/success.html"));
}