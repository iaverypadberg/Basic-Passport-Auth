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

// Limited fields in user to keep it simple for now
const userSchema = new Schema({
  firstName: { type: String, required:true },
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


