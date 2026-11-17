require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Role = require("./models/Role");
const User = require("./models/User");
const { PERMISSIONS: P, ALL_PERMISSIONS } = require("./config/permissions");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const roleData = [
    { name: "Admin", permissions: ALL_PERMISSIONS },
    {
      name: "Manager",
      permissions: [
        P.PRODUCT_VIEW,
        P.PRODUCT_CREATE,
        P.PRODUCT_EDIT,
        P.PRODUCT_DELETE,
        P.USER_VIEW,
      ],
    },
    { name: "Staff", permissions: [P.PRODUCT_VIEW, P.PRODUCT_CREATE] },
  ];

  const roles = {};
  for (const r of roleData) {
    roles[r.name] = await Role.findOneAndUpdate(
      { name: r.name },
      { $setOnInsert: { permissions: r.permissions } },
      { upsert: true, new: true }
    );
  }
  console.log("Roles ready:", Object.keys(roles).join(", "));

  const oldUsers = await User.collection
    .find({ $or: [{ role: { $type: "string" } }, { role: { $exists: false } }] })
    .toArray();
  for (const u of oldUsers) {
    const target = u.role === "admin" ? roles.Admin : roles.Staff;
    await User.collection.updateOne({ _id: u._id }, { $set: { role: target._id } });
  }
  console.log("Old users converted:", oldUsers.length);

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@smartmart.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const exists = await User.findOne({ email });
  if (!exists) {
    await User.create({
      name: "Admin",
      email,
      password: await bcrypt.hash(password, 10),
      role: roles.Admin._id,
    });
    console.log(`Admin created: ${email} / ${password}`);
  } else {
    console.log("Admin already exists:", email);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});