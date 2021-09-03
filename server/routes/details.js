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
router.get("/me", verifyUser, async (req, res, next) => {
  const { firstName } = req.body;
  const user = await User.findOne({ firstName: firstName });
  res.send(`User with first name of ${user.firstName} has been found`);
});


// A route to get all user details
router.get("/getDetails", verifyUser, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne(_id);
    const {details} = user
    res.json({user});
  } catch (err) {
    console.log(err);
  }
});


// Route to set the details for a specific user
router.post("/setDetails", verifyUser, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { age, profession, description, email, phone } = req.body;
    const user = await User.findOneAndUpdate(_id, {
      $set: {
        details: {
          age: age,
          description: description,
          email: email,
          phone: phone,
        },
      },
    });
    // Push the specified professions onto the array
    user.details.profession.push({ $each: profession });
    user.save();

    res.json(user.details);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
