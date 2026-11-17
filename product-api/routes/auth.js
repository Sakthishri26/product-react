const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const auth = require("../middleware/auth");

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    role: user.role ? user.role.name : null,
    permissions: user.role ? user.role.permissions : [],
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const staff = await Role.findOne({ name: "Staff" });
    if (!staff) {
      return res.status(500).json({ error: "Roles are not set up. Run node seed.js" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: staff._id });
    await user.populate("role");

    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = email
      ? await User.findOne({ email: String(email).toLowerCase() }).populate("role")
      : null;
    const match = user && password ? await bcrypt.compare(password, user.password) : false;

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is disabled" });
    }

    await User.updateOne({ _id: user._id }, { lastLogin: new Date() });
    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("role");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true }).populate("role");
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    const match = user ? await bcrypt.compare(oldPassword || "", user.password) : false;
    if (!match) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;