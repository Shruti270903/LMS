import { Webhook } from "svix";
import User from "../models/User.models.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // 1️⃣ Verify the webhook signature
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Make sure the request body is in raw format (string)
    const payload = JSON.stringify(req.body);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await webhook.verify(payload, headers);

    // 2️⃣ Extract event type and data from Clerk
    const { data, type } = req.body;

    switch (type) {
      // 🧩 When a user is created in Clerk
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };

        await User.create(userData);
        return res.status(200).json({ success: true });
      }

      // 🧩 When user details are updated in Clerk
      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };

        await User.findByIdAndUpdate(data.id, userData, { new: true });
        return res.status(200).json({ success: true });
      }

      // 🧩 When a user is deleted in Clerk
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });
      }

      // Default case — ignore other events
      default:
        return res.status(200).json({ success: true, message: "Event ignored" });
    }
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};
