const { BoughtProducts } = require("../models/boughtProducts")

module.exports.getBP = async(req,res) =>{
const products = await BoughtProducts.findOne({user:req.user._id}).select({products:1});
if(!products) return res.status(403).send("No bought products found!")
return res.status(200).send(products);

}

module.exports.createBP = async(req,res) =>{
let bp = await BoughtProducts.findOne({user:req.body.user});

if(bp) return res.status(400).send("This user exists!");

if(req.body.products){
    try{
    
        bp = new BoughtProducts(req.body);
        const result = await bp.save();
        return res.status(201).send(result);
        
        }catch(error){
           console.log(error);
           return res.status(400).send("Creating bp failed!")
        }
        
        
}else{
    return res.status(400).send("Please provide products field!")
}

}