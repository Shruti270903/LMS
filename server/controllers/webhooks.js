import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller Function to manage Clerk User with database

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// import { Webhook } from "svix";
// import User from "../models/User.js";

// export const clerkWebhooks = async (req, res) => {
//   try {
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
//     const evt = whook.verify(
//       JSON.stringify(req.body),
//       {
//         "svix-id": req.headers["svix-id"],
//         "svix-timestamp": req.headers["svix-timestamp"],
//         "svix-signature": req.headers["svix-signature"],
//       }
//     );

//     console.log("✅ Clerk Webhook Received:", evt);

//     const { id, name, email_addresses, image_url } = evt.data;

//     const newUser = new User({
//       _id: id,
//       name: name,
//       email: email_addresses[0].email_address,
//       imageUrl: image_url,
//     });

//     await newUser.save();
//     console.log("✅ User saved to DB:", newUser);

//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("❌ Error in webhook:", err);
//     res.status(400).json({ error: "Webhook failed" });
//   }
// };
