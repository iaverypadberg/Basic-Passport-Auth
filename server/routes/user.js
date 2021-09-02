const express = require("express");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");


const {
  verifyUser,
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
} = require("../authenticate");

// Allows parsing of json
router.use(express.json());

// Route for adding users to the database without verification
router.get('/me', verifyUser,async(req,res,next)=>{
    const { firstName } = req.body
    const user = await User.findOne({firstName:firstName})
    res.send(`User with first name of ${user.firstName} has been found`)
})

// Route for signing a user up
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password, firstName } = req.body;

    const user = await User.register({ username: username , firstName:firstName}, password);
      const token = getToken({ _id: user._id});
      const refreshToken = getRefreshToken({ _id: user._id });
      user.refreshToken.push({ refreshToken });
      console.log("Token:" + token);
      console.log("Refresh:" + refreshToken);
      user.save()
      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.send({ success: true, token });
    // const user = await User.findOne({ firstName: firstName });
  } catch (err) {
    console.log(err);
    res.send(err)
  }
});

//route for login
// Generate a refresh token and add it to the new created user
// router.post("/signup", async (req, res, next) => {
//   const { firstName } = req.body;
//   const user = new User({ firstName: firstName });
// });

//route for logout

//route for getting a refreshToken

module.exports = router;
