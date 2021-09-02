// Dependencies
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport');


// File imports
const userRoutes = require('./routes/user')

const { startDatabase } = require('./utils.js/database')
require("dotenv").config()
require("./AuthStrats/Jwt")
require("./AuthStrats/Local")
require('./authenticate')
const app = express();
startDatabase()

// Cors, cookie settings, morgan logger, json
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan('tiny'))
app.use(express.json())

// Passport
app.use(passport.initialize())

// Routes
app.use('/user',userRoutes)

// Start server
app.listen(process.env.PORT,()=>{
    console.log(`Lisenting on ${process.env.PORT}`)
})