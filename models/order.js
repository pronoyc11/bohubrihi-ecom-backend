const { Schema, model } = require("mongoose");
const { CartItemSchema } = require("./cartItem");

module.exports.Order = model(
  "Order",
  Schema({
    cartItems: [CartItemSchema],
    transanction_id : {
        type:String,
        unique:true
    },
    adress:{
        phone:String,
        address1: String,
        address2: String,
        city:String,
        state:String,
        postcode:Number,
        country:String
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","complete"]
    },
    user : {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    sessionKey:String

  })
);
