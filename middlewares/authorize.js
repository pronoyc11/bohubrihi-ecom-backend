const jwt = require("jsonwebtoken");

module.exports = async (req,res,next)=>{
let token = req.header("Authorization");
if(!token) return res.status(401).send("Unauthorized attempt!");
else token = token.split(" ")[1].trim();
try{
const decoded = await jwt.verify(token,process.env.JSON_KEY);



    
req.user = decoded 

next();
}catch(err){
    return res.status(400).send("Invalid token!");
}


}