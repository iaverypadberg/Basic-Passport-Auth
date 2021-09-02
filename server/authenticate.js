const passport = require('passport');
const jwt = require('passport-jwt')
const dev = process.env.NODE_ENV !== 'production'

exports.COOKIE_OPTIONS = {
    httpOnly:true,
    signed:true,
    maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY),
    sameSite: 'strict',
}


exports.getToken = user => {
    return jwt.sign(user, process.env.JWT_SECRET,{
        expiresIn: eval(process.env.SESSION_EXPIRY),
    })
}

exports.getRefreshToken = user =>{
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
    })
    return refreshToken
}

exports.verifyUser = passport.authenticate("jwt",{session:false})