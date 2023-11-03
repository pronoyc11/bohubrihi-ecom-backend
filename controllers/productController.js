const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { validateProduct, Product } = require("../models/product");
const { Order } = require("../models/order");
const { BoughtProducts } = require("../models/boughtProducts");
const { default: axios } = require("axios");

module.exports.createProduct = async (req, res) => {

  console.log("Hi this is create product")
  //WE ARE IMPORTING OR DATA IN A FORM FORMAT HERE NOT IN A JSON FORMAT.
  let form = new formidable.IncomingForm();
  // console.log(form);
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send("Something wrong.Failed to parse!");
    // console.log(fields);
    console.log(req.body);
console.log(fields);

    //RETRIEVING DATA FROM AN ARRAY STARTS
    let reqObj = {};

    for (let key in fields) {
      reqObj = { ...reqObj, [key]: fields[key][0] };
    }
    //RETRIEVING DATA FROM AN ARRAY ENDS
    //Checking if the value is in array format starts
    let checkName = fields.name;
    for (let key in fields) {
      checkName = fields[key];
    }

    let valueType = typeof checkName;

    //Checking if the value is in array format ends






        const {error} = validateProduct(_.pick(valueType === "string" ? fields : reqObj,["name","description","price","category","quantity"]));
    if(error) return res.status(400).send(error.details[0].message);







    
    const product = new Product(_.pick(valueType === "string" ? fields : reqObj, [
      "name",
      "description",
      "price",
      "category",
      "quantity",
    ]));
    //console.log( files.photo[0]._writeStream.path);

    if (files.photo) {
      // <input type="file" name="photo" />
      fs.readFile(files.photo[0].filepath, (err, data) => {
        if (err) return res.status(400).send("Problem in file data!");
        product.photo.data = data;
        product.photo.contentType = files.photo[0].mimetype;
        product
          .save()
          .then((response) => {
            return res.status(201).send({
              message: "Product created successfully!",
              data: _.pick(response, [
                "name",
                "description",
                "price",
                "category",
                "quantity",
              ]),
            });
          })
          .catch((err) => res.status(500).send("internal server error!"));
      });
    } else {
      return res.status(400).send("No photo provided!");
    }
  });
};
//GET PRODUCTS FUNCTION STARTS HERE
module.exports.getProducts = async (req, res) => {
  //QUERY STRING

  //asssignment starts
//  const orders = await Order.find({transanction_id:"_nxgyau91698818307103"}).select({cartItems:1,user:1});
//  const boughtUserId = orders[0].user ;
//    const productIdAndCount = [];
//   const productId = [];
// orders[0].cartItems.forEach(item=>{
//   productIdAndCount.push({id:item.product._id,count:item.count});
//   productId.push(item.product._id);
//   })
//   const productss = await Product.find({_id:[...productId]}).select({photo:0,description:0});
 
// for(let j = 0;j<productss.length;j++){
//   for(let i = 0 ;i < productIdAndCount.length; i++){
    
//     if(productIdAndCount[i].id.toString() === productss[j]._id.toString()){
//       productss[j].sold += productIdAndCount[i].count 
      
//       productss[j].quantity -= productIdAndCount[i].count
    
//     }
//   }
// }
// productss.forEach(async (item)=>{
//  await Product.findByIdAndUpdate(item._id,item);
// })
//assignment ends
//console.log(orders);


// const bps = await BoughtProducts.findOne({user:boughtUserId}); 
// let bpsArr = [] ;
// if(bps){
//   bpsArr = bps.products ;
// }
// //HAVING BOUGHT PRODUCTS END 
//   productss.forEach(async (item)=>{
  
//    //Update or create BoughtProducts
//    //boughtUserId,[item._id]
//    if(bps){
//     //update bought products
    
//       if(!bps.products.includes(item._id)){
//       bpsArr.push(item._id);
//      console.log("Milenai reeeee")
//       }
    
    
 
//    }else{
//     //create bought products arr
//     bpsArr.push(item._id);
//    }
//   });
//   //Final touch for bps
//   if(bps){
//     await BoughtProducts.findOneAndUpdate({user:boughtUserId},{products:[...bpsArr]}) ;
//   }else{
//     const newBp = new BoughtProducts({user:boughtUserId,products:bpsArr});
//     await newBp.save();
//   }

  //TESTING ENDS
// let val_id = "2311011857491SQ84DQcpjmxoXg";

// let response = await axios.get(`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=abc653cf3571418c&store_passwd=abc653cf3571418c@ssl`)
      
// console.log(response.data["status"]); 




// const orders = await Order.findOneAndUpdate(
//   { transanction_id: "_kzsoijt1698927481472" },
//   { status: "complete" },
  
// )
// console.log(orders.user)
 //await CartItem.deleteMany(order.cartItems);








  let order = req.query.order === "desc" ? -1 : 1;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let skip = req.query.skip? parseInt(req.query.skip) : 0 ;
  const products = await Product.find()
    .limit(limit)
    .skip(skip)
    .select({ photo: 0, description: 0 })
    .populate("category", "name")
    .sort({ [sortBy]: order })
   
    

  return res.status(200).send(products);
};
//GET PRODUCTS FUNCTION ENDS HERE

module.exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId)
    .select("-photo")
    .populate("category", "name");
  if (!product) return res.status(404).send("Not found");

  return res.status(200).send(product);
};

module.exports.getPhoto = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId).select({ photo: 1 });

  if (!product) return res.status(400).send("No photo found on this id!");
  res.set("Content-type", product.photo.contentType);
  return res.status(200).send(product.photo.data);
};
//get product by id
//collect form data
//Update provided form feilds
//update photo if provided
module.exports.updateProductById = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) return res.status(404).send("No product found on this id!");

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    //RETRIEVING DATA FROM AN ARRAY STARTS
    let reqObj = {};

    for (let key in fields) {
      reqObj = { ...reqObj, [key]: fields[key][0] };
    }
    //RETRIEVING DATA FROM AN ARRAY ENDS
    //Checking if the value is in array format starts
    let checkName = fields.name;
    for (let key in fields) {
      checkName = fields[key];
    }

    let valueType = typeof checkName;

    //Checking if the value is in array format ends
    if (err) return res.status(400).send("Wrong parsing!");
    const updatedFields = _.pick(valueType === "string" ? fields : reqObj, [
      "name",
      "description",
      "price",
      "category",
      "quantity",
    ]);

    _.assignIn(product, updatedFields);

    if (files.photo) {
      fs.readFile(files.photo[0].filepath, (err, data) => {
        if (err) return res.status(400).send("Failed to read!");

        product.photo.data = data;
        product.photo.contentType = files.photo[0].mimetype;

        //FS.READFILE IS AN ASYNCHRONAS CALL,SO REMEMBER TO CALL THE SAVE EVENT IN TO OTHERWISE IT'LL SAVE THE PRODUCT BEFORE ASSIGNING THE PHOTO DATA!
        product
          .save()
          .then((response) => {
            return res.status(200).send({
              message: "product updated successfully.",
            });
          })
          .catch((err) => {
            return res.status(500).send("Failed to update photo!");
          });
      });
    } else {
      product
        .save()
        .then((response) => {
          return res.status(200).send({
            message: "product updated successfully.",
          });
        })
        .catch((err) => {
          return res.status(500).send("Failed to update!");
        });
    }
  });
};

//Filter products as our wish !~
const body = {
  order: "desc",
  sortBy: "price",
  limit: 6,
  skip: 0,
  filters: {
    price: [1000, 2000],
    category: ["blablabla", "bla"],
  },
};
module.exports.filterProducts = async (req, res) => {
  
  let order = req.body.order === "desc" ? -1 : 1;
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = parseInt(req.body.skip);
  let filters = req.body.filters;
  let args = {};
  for (let key in filters) {
    if (filters[key].length > 0) {
      if (key === "price") {
        args["price"] = {$gte:filters[key][0],$lte:filters[key][1]}
      
      }
      if (key === "category") {
        args["category"] = {$in:filters[key]}
      }
    }
  }

  const products = await Product.find(args).limit(limit)
    .skip(skip)
    .select({ photo: 0 })
    .sort({ [sortBy]: order })
    .populate("category","name _id");

  return res.status(200).send(products);
};


//RATING FUNCTION FOR ASSIGNMENTS START
module.exports.rating = async(req,res)=>{

  console.log(req.body);
  const { _id } = req.user ;
  const { star,prodId } = req.body ;
  try{
const product =await Product.findById(prodId);
const alreadyRated = product.ratings.find((userId)=> userId.postedBy.toString()=== _id.toString());
if(alreadyRated){
const updateRating = await Product.updateOne({
  ratings:{$elemMatch:alreadyRated} 
},
{
  $set:{"ratings.$.star":star}
},
{
  new:true
}
);

}else{
const rateProduct = await Product.findByIdAndUpdate(prodId,
  {
  $push:{
    ratings:{
      star:star,
      postedBy:_id
    }
  }
},
{
  new:true
}).select({photo:0})



}
const getAllRatings = await Product.findById(prodId);
const totalRatings = getAllRatings.ratings.length;
const ratingSum = getAllRatings.ratings.map(item=>item.star).reduce((prev,curr) => prev + curr,0);
const actualRating = Math.round(ratingSum/totalRatings);
const finalProduct = await Product.findByIdAndUpdate(prodId,{
  totalRating:actualRating
},
{new:true}
).select({photo:0});
return res.send(finalProduct);
  }catch(error){


  }

} 
//RATING FUNCTION FOR ASSIGNMENTS END

//COMMENTING FUNCTION STARTS
module.exports.getComments = async(req,res)=>{
   const id = req.params.id ;
const comments = await Product.findById(id).select({comments:1});

return res.status(200).send(comments);

}
module.exports.postComment = async(req,res)=>{
const id = req.params.id ;
const cmnt = req.body.comment ;
const uId = req.user._id;
const name = req.user.name;

try{
  const comment = await Product.findByIdAndUpdate(id,{
    $push:{
      comments:{
      comment:cmnt,
      postedBy:uId,
      name:name
      }
    }
  },{
    new:true
  }).select({photo:0});
  return res.status(201).send(comment);
}catch(error){
  return res.status(400).send("Something wrong!")
}


}

//COMMENTING FUNCTION ENDS