import mongoose from "mongoose";

// Connect to the MONGODB database
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database Connected"));
    mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

    // Use the URI as-is (it should include the database name)
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit process if unable to connect
  }
};

export default connectDB;
