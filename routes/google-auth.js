const express = require("express");
const passport = require("passport");
const GoogleStartegy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require("uuid");
const { userModel } = require("../models/userModel");
require("dotenv").config();

const googleRouter = express.Router();

googleRouter.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

googleRouter.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    let user = req.user;
    const token = jwt.sign({ userID: user._id }, "secret", {
      expiresIn: "1hr",
    });

    // Include user information in the query parameters of the redirect URL
    const redirectUrl = `/success?message=google-success&userInfo=${user.name}`;

    // Redirect home with user information in the URL
    res.redirect(redirectUrl);
  }
);

passport.use(
  new GoogleStartegy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_callbackURL, // change the callback link
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, cb) {
      let email = profile._json.email;
      let udata = await userModel.findOne({ email, provider: "google" });
      if (udata) {
        return cb(null, udata);
      }
      let name = profile._json.name;

      const user = new userModel({
        name,
        email,
        password: uuidv4(),
        provider: profile.provider,
      });
      await user.save();
      return cb(null, user);
    }
  )
);

module.exports = { googleRouter };
