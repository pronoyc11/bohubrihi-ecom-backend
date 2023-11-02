const { Schema, model } = require("mongoose");
const joi = require("joi");

module.exports.Product = model(
  "Product",
  Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: String,
      price: Number,
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      quantity: Number,
      photo: {
        data: Buffer,
        contentType: String,
      },
      sold:{type:Number,default:0},

      ratings: [
        {
          star: Number,
          postedBy: { type: Schema.Types.ObjectId, ref: "User" },
        },
      ],
      comments: [
        {
          comment: String,
          postedBy: { type: Schema.Types.ObjectId, ref: "User" },
          name:String
        },
      ],
      totalRating:{
        type:Number,
        def:0
      }
    },
    { timestamps: true }
  )
);

module.exports.validateProduct = (product) => {
  const schema = joi.object({
    name: joi.string().min(3).max(255).required(),
    description: joi.string().max(2000).required(),
    price: joi.number().required(),
    quantity: joi.number().required(),
    category: joi.string().required(),
    comment: joi.string().min(3),
  });
  return schema.validate(product);
};
