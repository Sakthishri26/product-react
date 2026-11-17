function authorize(permission) {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      return res
        .status(403)
        .json({ message: "You don't have permission to do this" });
    }
    next();
  };
}

module.exports = authorize;