import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "../configs/mongodb.js";
import User from "../models/User.models.js";

const createSuperAdmin = async () => {
  try {
    await connectDB();

    const name = process.env.SUPERADMIN_NAME;
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "SUPERADMIN_NAME, SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are required in .env"
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`A user with ${email} already exists.`);
      console.log(`Current role: ${existingUser.role}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "superadmin",
      isAccountVerified: true,
    });

    console.log("Super Admin created successfully!");
    console.log("Email:", superAdmin.email);
    console.log("Role:", superAdmin.role);

    process.exit(0);
  } catch (error) {
    console.error("Error creating Super Admin:", error.message);
    process.exit(1);
  }
};

createSuperAdmin();