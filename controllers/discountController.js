const { Discount } = require("../models/discount")

module.exports.getDiscount = async (req,res) =>{
 const discountAmmount = await Discount.findOne({name:req.query.name}).select({ammount:1});
 if(!discountAmmount) return res.status(400).send('No coupon is detected!')
 
 return res.status(200).send({discount:parseInt(discountAmmount.ammount)});

}

module.exports.createDiscount = async (req,res)=>{
    const isDis = await Discount.findOne({name:req.body.name})
    if(isDis) return res.status(400).send('Already have this coupon!')
   if(req.body.name && req.body.ammount){
    const discount = new Discount(req.body);

    let dist = await discount.save();
    
    return res.status(201).send({message:"Coupon creted.",coupon:dist});
   }else{
    return res.status(400).send("Please provide all feilds correctly!")
   }

}