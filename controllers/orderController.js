const { Order } = require("../models/order")

module.exports.getOrders = async (req,res) =>{
const orders = await Order.find({user:req.user._id})
if(!orders) return res.status(404).send("No order is placed.")

return res.status(200).send(orders);

}

module.exports.deleteOrders = async (req,res) =>{
const deletedOrder = await Order.deleteOne({_id:req.query.orderId})

if(!deletedOrder) return res.status(404).send("No order found to delete!!");
 return res.status(200).send(deletedOrder);

}