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

// Route for signing a user up
router.post("/signup", async (req, res, next) => {
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
  "/login",
  passport.authenticate("local"),
  async (req, res, next) => {
    try {
      const { _id } = req.user;
      const token = getToken({ _id: _id });
      const refreshToken = getRefreshToken({ _id: _id });

      const user = await User.findOne(_id);
      // TODO: Every time login occurs a new refreshToken is added, need to delete the old ones
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
router.get("/logout", verifyUser, async (req, res, next) => {
  // Delete the JWT token
  const { _id } = req.user;
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  const user = await User.findOne(_id);

  const tokenIndex = await user.refreshToken.findIndex(
    (item) => item.refreshToken === refreshToken
  );

  if (tokenIndex !== -1) {
    user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
  }

  user.save();

  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.send({ success: true });
});

//route for getting a refreshToken
// TODO: Fix bug which always returns Unauthorized
router.post("/refreshToken", verifyUser, async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (refreshToken) {
    try {
      // Compare the provided token and the secret used to create it
      // If the token is correct, the payload is decoded
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      //The payload will contain the users id, when it was created, and its expiration
      const { _id } = payload._id;
      const user = await User.findOne(_id);

      if (user) {
        // Find the refresh token against the user record in database
        const tokenIndex = user.refreshToken.findIndex(
          (item) => item.refreshToken === refreshToken
        );
        if (tokenIndex === -1) {
          res.statusCode = 401;
          res.send("Unauthorized");
        } else {
          const token = getToken(_id);
          // If the refresh token exists, then create new one and replace it.
          const newRefreshToken = getRefreshToken(_id);
          user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
          user.save();

          res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
          res.send({ success: true, token });
        }
      }
      (err) => next(err);
    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
});

// Logout
router.get("/logout", verifyUser, (req, res, next) => {
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
