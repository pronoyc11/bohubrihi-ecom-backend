const {Schema,model} = require("mongoose");

module.exports.Discount = model("Discount",Schema({
    name:String,
    ammount:Number
}))