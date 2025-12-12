import { Webhook } from "svix";
import User from "../models/User.models.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import { request } from "express";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
dotenv.config();

export const clerkWebhooks = async (req, res) => {
  try {

    console.log("WEBHOOK ROUTE REACHED");

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ❗ req.body is already a RAW BUFFER (don't convert)
    const payload = req.body;

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const event = await webhook.verify(payload, headers);
    const { data, type } = event;

    console.log("🔔 Webhook received:", type);
    console.log("Event data:", data);

    if (type === "user.created") {
      await User.create({
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        imageUrl: data.profile_image_url || "",
        isVerified: true,
      });

      console.log("User created:", data.id);
    }

    if (type === "user.updated") {
      await User.findByIdAndUpdate(
        data.id,
        {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.profile_image_url || "",
        }
      );

      console.log("User updated:", data.id);
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
      console.log("🗑 User deleted:", data.id);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).json({ error: err.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(request, response)=>{
  const sig = request.headers['stripe-signature'];

  let event;

  try{
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET );
  }
  catch(err){
    response.status(400).send(`Webhook Error: ${err.message}`);
  }



//Handle the event

switch(event.type){
  case 'paymentIntent.succeeded' : {
  const paymentIntent = event.data.object;
  const paymentIntentId = paymentIntent.id;

       const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
       })

       const {purchaseId} = session.data[0].metadata; 

       const purchaseData = await Purchase.findById(purchaseId)
       const userData = await User.findById(purchaseData.userId)
       const courseData = await Course.findById(purchaseData.courseId.toString())

       courseData.enrolledStudents.push(userData)
       await courseData.save()

       userData.enrolledCourses.push(courseData._id)
       await userData.save()

       purchaseData.status = 'completed'
       await purchaseData.save()
       
  break;
  }

  case 'payment_intent.payment_failed' :{ 
  const paymentIntent = event.data.object;
  const paymentIntentId = paymentIntent.id;

       const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
       })

       const {purchaseId} = session.data[0].metadata; 
       const purchaseData = await Purchase.findById(purchaseId)
       purchaseData.status = 'failed'
       await purchaseData.save()
       
  break;
  }
  //handle other event type
  default:
    console.log(`Unhandled event type ${event.type}`);
}

//Return a response to acknowledge receipt of the event
response.json({received:true});

}