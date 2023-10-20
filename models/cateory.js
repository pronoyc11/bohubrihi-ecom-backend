const { Schema,model } = require("mongoose");
const joi = require("joi");


module.exports.Category = model("Category",Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true}))

module.exports.validateCategory = (category)=>{
    const Schema = joi.object({
        name:joi.string().min(3).max(50).required()
    });
    return Schema.validate(category);
}