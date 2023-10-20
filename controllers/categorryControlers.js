const _ = require("lodash");
const { validateCategory, Category } = require("../models/cateory")

module.exports.createCategory = async (req,res)=>{
const {error} = validateCategory(_.pick(req.body,["name"]));
if(error) return res.status(400).send(error.details[0].message)

const category = new Category(_.pick(req.body,["name"]));

const result = await category.save();
return res.status(201).send({
    message:"Category created successfully.",
    data:result.name
})

}

module.exports.categoryList = async (req,res)=>{
    const categories = await Category.find().sort({name:1}).select({name:1,_id:1});

    return res.status(200).send(categories)

}