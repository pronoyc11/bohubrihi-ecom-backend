const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { validateProduct, Product } = require("../models/product");

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

module.exports.getProducts = async (req, res) => {
  //QUERY STRING

  let order = req.query.order === "desc" ? -1 : 1;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const products = await Product.find()
    .select({ photo: 0, description: 0 })
    .populate("category", "name")
    .limit(limit)
    .sort({ [sortBy]: order });

  return res.status(200).send(products);
};

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
  console.log("This is filter");
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

  const products = await Product.find(args)
    .select({ photo: 0 })
    .sort({ [sortBy]: order })
    .populate("category","name _id")
    .skip(skip)
    .limit(limit);

  return res.status(200).send(products);
};
