const express = require("express");
const Role = require("../models/Role");
const authorize = require("../middleware/authorize");
const { ALL_PERMISSIONS } = require("../config/permissions");

const router = express.Router();

const SYSTEM_ROLES = ["Admin", "Staff"]; 

function invalidPermissions(list) {
  return list.filter((p) => !ALL_PERMISSIONS.includes(p));
}


router.get("/", authorize("ROLE_MANAGE"), async (req, res) => {
  try {
    res.json(await Role.find().sort({ name: 1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/permissions", authorize("ROLE_MANAGE"), (req, res) => {
  res.json(ALL_PERMISSIONS);
});


router.post("/", authorize("ROLE_MANAGE"), async (req, res) => {
  try {
    const { name, permissions = [] } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Role name is required" });
    }
    if (!Array.isArray(permissions) || invalidPermissions(permissions).length > 0) {
      return res.status(400).json({ error: "Invalid permissions" });
    }
    const role = await Role.create({ name: String(name).trim(), permissions });
    res.status(201).json(role);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Role name already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});


router.put("/:id", authorize("ROLE_MANAGE"), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    const { name, permissions } = req.body;

    if (permissions !== undefined) {
      if (!Array.isArray(permissions) || invalidPermissions(permissions).length > 0) {
        return res.status(400).json({ error: "Invalid permissions" });
      }
      
      if (role.name === "Admin" && !permissions.includes("ROLE_MANAGE")) {
        return res.status(400).json({ error: "The Admin role must keep ROLE_MANAGE" });
      }
      role.permissions = permissions;
    }

    if (name !== undefined && name !== role.name) {
      if (SYSTEM_ROLES.includes(role.name)) {
        return res.status(400).json({ error: "System roles can't be renamed" });
      }
      role.name = String(name).trim();
    }

    await role.save();
    res.json(role);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Role name already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;