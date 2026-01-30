const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createJwt = async (id) => {
  const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.expiresIn,
  });
  return token;
};
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findByEmail(email)) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const [result] = await User.create(name, email, hashPassword);
    const webToken = await createJwt(result.insertId);
    return res.status(201).json({
      message: "User registered successfully",
      token: webToken,
      user: {
        id: result.insertId,
        name: name,
        email: email,
      },
    });
  } catch (err) {
    console.log("server error", err.message);
    return res.status(500).json({
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = await createJwt(user.id);
    return res.status(200).json({
      message: "login successfuly",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("server error", err.message);
    return res.status(500).json({
      message: "server error",
    });
  }
};
