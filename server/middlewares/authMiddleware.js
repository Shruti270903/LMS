import userAuth from "../auth/middleware/userAuth.js";

// Protect routes that require a logged-in user
export const protectUser = userAuth;

// Protect educator routes
export const protectEducator = async (req, res, next) => {
  try {
    // First verify the JWT and load the user
    await userAuth(req, res, async () => {
      if (req.user.role !== "educator") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Educator role required",
        });
      }

      next();
    });
  } catch (error) {
    console.error("protectEducator error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Protect admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    // First verify JWT and load the user
    await userAuth(req, res, async () => {
      if (!["admin", "superadmin"].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin role required",
        });
      }

      next();
    });
  } catch (error) {
    console.error("protectAdmin error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Protect super admin routes
export const protectSuperAdmin = async (req, res, next) => {
  try {
    // First verify JWT and load the user
    await userAuth(req, res, async () => {
      if (req.user.role !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Super Admin role required",
        });
      }

      next();
    });
  } catch (error) {
    console.error("protectSuperAdmin error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};