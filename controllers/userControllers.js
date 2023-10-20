const { validateUser, User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

module.exports.signUp = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already registered!");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const token = user.genJWT();

  try {
    const result = await user.save();
    return res.status(201).send({
      message: "Registration successfull",
      token: token,
      user: _.pick(result, ["_id", "name", "email"]),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Failed to register!");
  }
};

module.exports.signIn = async (req, res) => {

    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("No user found!");

    let validUser = await bcrypt.compare(req.body.password,user.password);

    if(!validUser) return res.status(400).send("Invalid password!");
     const token = user.genJWT();

    return res.status(200).send({
        message: "Login successfull",
        token: token,
        user: _.pick(user, ["_id", "name", "email"]),
      })


};
