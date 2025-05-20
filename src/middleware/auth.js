const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-passowrd");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access to admins only
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied: Admin privileges required" });
  }
};

// Middleware to restrict access to admins and superusers only
exports.adminOrSuperuser = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "superuser")
  ) {
    next();
  } else {
    res
      .status(403)
      .json({
        message: "Access denied: Admin or Superuser privileges required",
      });
  }
};
