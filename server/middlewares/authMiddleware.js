// import { clerkClient } from "@clerk/express";
// //middleware (protect educator routes)
// export const protectEducator = async (req, res, next) => {
//   try {
//     // const userId = req.auth();
//     const { userId } = req.auth;

//     const response = await clerkClient.users.getUser(userId);
//     if (
//       response.publicMetadata.role!== "educator") {
//       return res
//         .status(403)
//         .json({success: false,  error: "Access denied. Educator role required.\n Unauthoried Access" });
//     }
//     return next();
//     } catch (error) {
//        return res.json({ success: false, error: "Internal server error" });
//     }
// };                  
import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
  try {
    // ✅ Clerk injects auth object
    const { userId } = req.auth;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Educator role required",
      });
    }

    // optional: attach user for later use
    req.user = user;

    next();
  } catch (error) {
    console.error("protectEducator error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
