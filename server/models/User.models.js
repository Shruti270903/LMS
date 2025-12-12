import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String },  // Clerk user ID
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, default: "" },
     enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
