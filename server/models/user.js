const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose")

// Session to store the valid refreshTokens
const Session = new Schema({
    refreshToken: {
      type: String,
      default: "",
    },
  })

// Added More fields
const userSchema = new Schema({
  firstName: { type: String,  unique:false },
  lastName: {type:String, unique:false},

  details:{
    date: Date,
    age: Number,
    profession:[String],
    description: String,
    email: String,
    phone: {type:mongoose.Mixed, unique:true}
  },
  refreshToken:[Session]
})

// Delete the refresh token from the response so that it is not sent back in API calls
userSchema.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret.refreshToken
      return ret
    },
  })
  
  userSchema.plugin(passportLocalMongoose)
  
  
  const User = mongoose.model("User", userSchema)
  
  module.exports = User;


