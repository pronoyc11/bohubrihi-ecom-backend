const { User } = require("../models/user");
const axios = require("axios");
module.exports.postFB = async (req, res) => {
    try {
        const {  userId , accessToken } = req.body;
        if(!userId || userId == '' || !accessToken || accessToken == ''){
          return  res.status(400).json({ message: "userId and accessToken are required"}); 
        }
        //get user by facebook userId and accesToken
        let { data } = await getUserByFacebookIdAndAccessToken(accessToken, userId);
        //check if user exist
        var user = await User.findOne({ facebookId: data.id});
        var authObject= {}
        if(user){ 
          var token = user.genJWT();
          authObject = { auth: true, token, user, message: "Successfully logged in." };
          
    return res.status(200).send({
        message: "Login successfull",
        token: token,
        user: _.pick(user, ["_id", "name", "email"]),
      })
        }
        else{
          user = new User({
            name: data.name,
            email: data.email?data.email:Date.now().toString() + Math.round(Math.random()).toString() + "@gmail.com",
            facebookId: data.id,
            password:"facebookPassword"
          }) 
          var token = user.genJWT();
     
          const result = await user.save();
          return res.status(201).send({
            message: "Registration successfull",
            token: token,
            user: _.pick(result, ["_id", "name", "email"]),
          });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message}); 
    }
}

let getUserByFacebookIdAndAccessToken = ( accessToken ,userId) => {
    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}?fields=id,name,email&access_token=${accessToken}`;
    let result = axios.get(urlGraphFacebook);
    return result;
    
}