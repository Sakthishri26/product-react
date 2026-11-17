const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("role");

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }
  
    if (!user.isActive) {
      return res.status(401).json({ error: "Your account is disabled" });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role ? user.role.name : null,
      permissions: user.role ? user.role.permissions : [],
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = auth;