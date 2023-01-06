const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      passwordHash,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret1234",
      {
        expiresIn: "30d",
      }
    );

    res.json({ ...user._doc, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "couldn't perform registration",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return req
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return req
        .status(403)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const token = jwt.sign({ _id: user._id }, "secret1234", {
      expiresIn: "30d",
    });

    res.json({ ...user._doc, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "couldn't perform login",
      error,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred",
      error,
    });
  }
};

module.exports = { register, login, getMe };
