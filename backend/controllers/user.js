const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/user.model");

exports.signIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with given email already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      userId: savedUser._id,
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Authentication failed" });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Generate JWT
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Authentication successful",
      token,
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
