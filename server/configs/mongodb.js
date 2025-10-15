import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//Connect to the mongodb database
const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("MongoDB Database connected successfully")
  );

  await mongoose
    .connect(`${process.env.MONGODB_URI}/lms`)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log("Error in DB connection", err);
    });
};
export default connectDB;
