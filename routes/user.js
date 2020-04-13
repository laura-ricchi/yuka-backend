const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

// Route Sign-Up
router.post("/user/sign-up", async (req, res) => {
  try {
    const userEmail = await User.findOne({ email: req.fields.email });

    const userUsername = await User.findOne({
      username: req.fields.username,
    });

    if (userEmail) {
      res.status(400).json({ error: "This email already has an account." });
    } else if (userUsername) {
      res.status(400).json({ error: "This username already has an account." });
    } else {
      if (
        req.fields.email &&
        req.fields.username &&
        req.fields.password &&
        req.fields.name
      ) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const newUser = new User({
          email: req.fields.email,
          token: token,
          salt: salt,
          hash: hash,
          username: req.fields.username,
          name: req.fields.name,
        });
        await newUser.save();
        res.json({
          _id: newUser._id,
          token: newUser.token,
          email: newUser.email,
          username: req.fields.username,
          name: req.fields.name,
        });
      } else {
        res.status(400).json({ error: "Missing parameters" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});
// Route Log-In
router.post("/user/log-in", async (req, res) => {
  const user = await User.findOne({ email: req.fields.email });
  if (user) {
    if (
      SHA256(req.fields.password + user.salt).toString(encBase64) === user.hash
    ) {
      res.json({
        _id: user._id,
        token: user.token,
        email: user.email,
        username: user.username,
        name: user.name,
      });
    } else {
      return res.json("username or email incorrect");
    }
  } else {
    return res.json({ message: "User not found" });
  }
});

module.exports = router;
