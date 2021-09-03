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

// Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []
const corsOptions = {
  
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  withCredentials:true
  
}
//Allow app to make HTTP requests to express app
app.use(cors(corsOptions))

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