module.exports.error = (err,req,res,next)=>{
    return res.status(500).send("Sorry something internally went wrong!!")
}