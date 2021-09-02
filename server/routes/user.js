const express = require("express")
const mongoose = require("mongoose")
const User = require('../models/user')
const router = express.Router();

// Allows parsing of json
router.use(express.json());

// route for getting protected data
router.post('/me', async(req,res,next)=>{
    const { firstName } = req.body
    const user = new User({firstName:firstName})
    await user.save()
    res.send(`User with first name of ${user.firstName} has been added to the database`)
})

router.get('/me', async(req,res,next)=>{
    const { firstName } = req.body
    const user = await User.findOne({firstName:firstName})
    res.send(`User with first name of ${user.firstName} has was found in the database`)
})

//route for login

//route for logout

//route for getting a refreshToken

module.exports = router;