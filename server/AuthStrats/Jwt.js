const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models/user")

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET
  }

  passport.use(
      new JwtStrategy(opts, function(jwt_payload, done){
          // If the _id is matched to a user, call the function with the user
        User.findOne({_id:jwt_payload._id}, function(err,user){
            if(err){
                return done(err, false)
            }
            if(user){
                return done(null,user)
            }else{
                return done(null,false)
            }
        })
      })
  )