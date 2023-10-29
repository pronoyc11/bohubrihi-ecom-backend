require("dotenv/config");
const app = require("./app");

const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_SERVER.replace("<PASSWORD>",process.env.MONGODB_PASSWORD)

mongoose.connect(mongoDB)
.then(()=>console.log("Connected to MongoDb."))
.catch((err)=>console.log(err));

const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})