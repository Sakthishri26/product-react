const mongoose = require("mongoose");
const { ALL_PERMISSIONS } = require("../config/permissions");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    permissions: [{ type: String, enum: ALL_PERMISSIONS }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);