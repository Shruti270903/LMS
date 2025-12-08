import { clerkClient } from "@clerk/express";

//middleware (protect educator routes)
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth().userId;
    const response = await clerkClient.users.getUser(userId);
    if (
      response.publicMetadata.role!== "educator") {
      return res
        .status(403)
        .json({success: false,  error: "Access denied. Educator role required.\n Unauthoried Access" });
    }
    return next();
    } catch (error) {
       return res.json({ success: false, error: "Internal server error" });
    }
};                  
