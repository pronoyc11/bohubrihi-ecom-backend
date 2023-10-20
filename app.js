require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
//EXTERNAL FILES GO HERE
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const { error } = require("./middlewares/error");
//EXTERNAL FILES GO HERE

//USING SOME DEFAULT MIDDLEWARES START
app.use(express.json());
app.use(cors());
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}
//USING SOME DEFAULT MIDDLEWARES END


app.use("/api/user",userRouter);
app.use("/api/category",categoryRouter);
// app.use(error);
module.exports = app ;