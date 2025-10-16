import { Webhook } from "svix";
import User from "../models/User.models.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // 🧾 1️⃣ Verify webhook signature
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Raw body from Clerk
    const payload = req.body.toString("utf8"); // must convert Buffer → string
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const event = await webhook.verify(payload, headers);
    const { data, type } = event;

    // 🧩 2️⃣ Handle event types
    console.log("🔔 Webhook received:", type);
    console.log("Event data:", data);
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
          isVerified: true,
        };
        await User.create(userData);
        console.log("✅ User created:", userData.email);
        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        console.log("🔄 User updated:", userData.email);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        return res.status(200).json({ success: true });
      }

      default:
        console.log("ℹ️ Ignored event:", type);
        return res.status(200).json({ success: true, message: "Event ignored" });
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};
