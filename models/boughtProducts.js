const { Schema,model } = require("mongoose");

const BoughtProductsSchema = Schema({
    user : {
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    products:[
        {
            type:Schema.Types.ObjectId,
            ref:"Product",
            required:true
        }
    ]
})

module.exports.BoughtProductsSchema = BoughtProductsSchema;
module.exports.BoughtProducts = model("BoughtProducts",BoughtProductsSchema);