const { Schema, model } = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    googleId: {
      type:String
    },
    fbId:{
      type:String
    }
  },
  { timestamps: true }
);

userSchema.methods.genJWT = function () {
  const token = jwt.sign({
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role
  },process.env.JSON_KEY,{expiresIn:"7d"});

  return token ;
};

const validateUser = (user) =>{
    const schema = joi.object({
        name:joi.string().min(3).max(100).required(),
        email:joi.string().min(5).max(255).required(),
        password:joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}
const User = model("User",userSchema);

module.exports.User = User ;
module.exports.validateUser = validateUser ;