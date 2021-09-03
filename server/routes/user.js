const express = require('express');
const User = require("../models/user");
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  verifyUser,
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
} = require('../authenticate');

// Allows parsing of json
router.use(express.json());

// Route for adding users to the database without verification
router.get('/me', verifyUser, async (req, res, next) => {
  const { firstName } = req.body;
  const user = await User.findOne({ firstName: firstName });
  res.send(`User with first name of ${user.firstName} has been found`);
});



// Route for signing a user up
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password, firstName } = req.body;

    const user = await User.register(
      { username: username, firstName: firstName },
      password
    );

    const token = getToken({ _id: user._id });
    const refreshToken = getRefreshToken({ _id: user._id });
    user.refreshToken.push({ refreshToken });

    console.log("Token:" + token);
    console.log("Refresh:" + refreshToken);

    user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.send({ success: true, token });
    // const user = await User.findOne({ firstName: firstName });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//route for login
router.post(
  '/login',
  passport.authenticate("local"),
  async (req, res, next) => {
    try {
      const { _id } = req.user;
      const token = getToken({ _id: _id });
      const refreshToken = getRefreshToken({ _id: _id });

      // Find a user and if the exist, invalidate all refreshTokens by clearing the array
      const user = await User.findOneAndUpdate(_id, {
        $set: { refreshToken: [] },
      });
      user.refreshToken.push({ refreshToken });
      user.save();

      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.send({ success: true, token });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);

//route for logout
router.get('/logout', verifyUser, async (req, res, next) => {
  // Delete the JWT token
  const { _id } = req.user;
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  const user = await User.findOne(_id);

  // Get the index of the refresh token which the user provided
  const tokenIndex = await user.refreshToken.findIndex(
    (item) => item.refreshToken === refreshToken
  );

  // Upon logout, remove the invalidate the refreshToken by removing it from the array in the database
  if (tokenIndex !== -1) {
    user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
  }

  user.save();

  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.send({ success: true });
});

//route for getting a refreshToken

// This route is for renewing the refreshToken.
// The user must already have a validaRefreshToken stored as a signedCookie in their request
// They do not need to have a valid JWT token though, as it might have expired

// TODO: Fix bug where user can only get one refresh token per login(this will limit session time)
router.post('/refreshToken', async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  // console.log({refreshToken})
  if (refreshToken) {
    try {
      // Compare the provided token and the secret used to create it
      // If the token is correct, the payload is decoded
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      // console.log({payload})
      //The payload will contain the users id, when it was created, and its expiration
      const { _id } = payload._id;
      const user = await User.findOne(_id);

      // console.trace({user})

      if (user) {
        // Find the refresh token against the user record in database
        // Look through the refreshToken array, if the item being checkedout equals the refresh token, return the index
        const tokenIndex = await user.refreshToken.findIndex(
          (item) => item.refreshToken === refreshToken
        );
        if (tokenIndex === -1) {
          res.statusCode = 401;
          res.send("Token Index is -1");
        } else {
          // Generate a new new JWT token
          const token = getToken({ _id: _id });
          // If the refresh token exists, then create new one and replace it.
          const newRefreshToken = getRefreshToken({ _id: _id });
          user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
          // console.log({user})
          user.save();

          res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
          res.send({ success: true, token });
        }
      }
    } catch (err) {
      res.statusCode = 401;
      console.log(err);
      res.send("Unauthorized 2");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized 3");
  }
});

// Logout
router.get('/logout', verifyUser, (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  User.findById(req.user._id).then(
    (user) => {
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken
      );
      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          res.clearCookie("refreshToken", COOKIE_OPTIONS);
          res.send({ success: true });
        }
      });
    },
    (err) => next(err)
  );
});

module.exports = router;
