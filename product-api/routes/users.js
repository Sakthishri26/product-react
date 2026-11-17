const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");
const authorize = require("../middleware/authorize");

const router = express.Router();

const populated = (query) => query.select("-password").populate("role", "name");

router.get("/", authorize("USER_VIEW"), async (req, res) => {
  try {
    res.json(await populated(User.find().sort({ createdAt: -1 })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authorize("USER_CREATE"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password and role are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const roleDoc = await Role.findById(role);
    if (!roleDoc) {
      return res.status(400).json({ error: "Role not found" });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: roleDoc._id,
    });

    res.status(201).json(await populated(User.findById(user._id)));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", authorize("USER_EDIT"), async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, role, isActive } = req.body;
    const isSelf = req.params.id === req.user.id;

    if (isSelf) {
      const roleChanged = role !== undefined && String(role) !== String(target.role);
      const statusChanged = isActive !== undefined && Boolean(isActive) !== target.isActive;
      if (roleChanged || statusChanged) {
        return res
          .status(403)
          .json({ message: "You cannot change your own role or status" });
      }
    }

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return res.status(400).json({ error: "Name is required" });
      }
      target.name = trimmed;
    }
    if (role !== undefined) {
      const roleDoc = await Role.findById(role);
      if (!roleDoc) {
        return res.status(400).json({ error: "Role not found" });
      }
      target.role = roleDoc._id;
    }
    if (isActive !== undefined) {
      target.isActive = Boolean(isActive);
    }

    await target.save();
    res.json(await populated(User.findById(target._id)));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:id/reset-password", authorize("USER_EDIT"), async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: "User not found" });
    }
    target.password = await bcrypt.hash(newPassword, 10);
    await target.save();
    res.json({ message: "Password reset" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;