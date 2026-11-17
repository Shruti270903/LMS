
import userAuth from "../auth/middleware/userAuth.js";

// Logged-in user
export const protectUser = userAuth;

// Educator access
export const protectEducator = (req, res, next) => {
  userAuth(req, res, () => {
    if (req.user?.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Educator role required",
      });
    }

    next();
  });
};

// Admin access
export const protectAdmin = (req, res, next) => {
  userAuth(req, res, () => {
    if (!["admin", "superadmin"].includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required",
      });
    }

    next();
  });
};

// Super Admin access
export const protectSuperAdmin = (req, res, next) => {
  userAuth(req, res, () => {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super Admin role required",
      });
    }

    next();
  });
};
