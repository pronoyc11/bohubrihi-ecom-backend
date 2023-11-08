const userRouter = require("../routers/userRouter");
const categoryRouter = require("../routers/categoryRouter");
const productRouter = require("../routers/productRouter");
const cartRouter = require("../routers/cartRouter");
const profileRouter = require("../routers/profileRouter");
const paymentRouter = require("../routers/paymentRouter");
const boughtProductRouter = require("../routers/boughtProductRouter");
const productRatingRouter = require("../routers/productRatingRouter");
const productCommentRouter = require("../routers/productCommentRouter");
const discountRouter = require("../routers/discountRouter");
const orderRouter = require("../routers/orderRouter");
// const authGoogleRouter = require("../routers/authGoogleRouter");
const authFacebookRouter = require("../routers/authFacebookRouter");
module.exports = (app)=>{

app.use("/api/profile",profileRouter)
app.use("/api/user",userRouter);
app.use("/api/category",categoryRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/payment",paymentRouter);
app.use("/api/boughtProduct",boughtProductRouter);
app.use("/api/ratings",productRatingRouter);
app.use("/api/comments",productCommentRouter);
app.use("/api/discount",discountRouter);
app.use("/api/orders",orderRouter);
// app.use("/api/auth/google",authGoogleRouter)
app.use("/api/auth/facebook",authFacebookRouter)
}