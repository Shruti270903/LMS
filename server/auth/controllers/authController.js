import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Details missing, All fields are required",
      });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
  res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "none",                              // 🔑 IMPORTANT
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    //sendiing welcome email to user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Our Platform!",
      text: `Hello ${user.name},\n\nThank you for registering on our platform. We're excited to have you on board!\n\nBest regards,\nThe Team`,
    };
    await transporter.verify();
    console.log("SMTP connection successful");

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error)
            } else {
                console.log("Email sent successfully:", info.response)
                }
                });
    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
        res.status(500).json({success:false, message:"Error in registering user"});
    }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Details missing, All fields are required",
      });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "none",                              // 🔑 IMPORTANT
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res
      .status(200)
      .json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in logging in" });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send Verify OTP to the user's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        //  const {userId} = req.body;
        const userId = req.userId;


         const user = await userModel.findById(userId);
            if(user.isAccountVerified){
                return res.status(400).json({success:false, message:"User is already verified"});
            } 
        // Generate OTP
       const otp =String (Math.floor(100000 +  Math.random() * 900000));

       user.verifyOtp = otp;
       user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // OTP valid for 24 hours
         await user.save();
         const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Your Account Verification OTP",
        text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\nThis OTP is valid for 24 hours.\n\nBest regards,\nThe Team`,
    };
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error)
            } else {
                console.log("Email sent successfully:", info.response)
                }
                });
        return res.status(200).json({success:true, message:"OTP sent to your email for verification"});

    }catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

//Verify User Email with OTP

export const verifyEmail = async (req, res) => {
  //  const {userId, otp} = req.body;
     const userId = req.userId;   // ✅ from JWT middleware
  const { otp } = req.body;    // ✅ from request body
   if(!userId || !otp){
    return res.status(400).json({success:false, message:"Details missing, All fields are required"});
    }   
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(400).json({success:false, message:"User does not exist"});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.status(400).json({success:false, message:"Invalid OTP"});
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.status(400).json({success:false, message:"OTP has expired"});
        }   
         user.isAccountVerified = true;  
            user.verifyOtp = '';
            user.verifyOtpExpireAt = 0;

        await user.save();
        return res.status(200).json({success:true, message:"Account verified successfully"});

}catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    }
}

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true, user: req.user });
    } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    }
};
 
//SEND PASSWORD RESET OTP TO EMAIL
export const sendResetOtp = async (req, res)=>{
  const {email} = req.body;
  if(!email){
    return res.status(400).json({success:false, message:"Email is required"});
  }
  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(400).json({success:false, message:"User does not exist"});
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your Password Reset OTP",
      text: `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\nThis OTP is valid for 15 minutes.\n\nBest regards,\nThe Team`,
    };
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log("Error sending email:", error)
          } else {
              console.log("Email sent successfully:", info.response)
              }
              });
    return res.status(200).json({success:true, message:"OTP sent to your email for password reset"});

}catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};  

//Reset User Password 
export const resetPassword = async (req, res)=>{
  const {email, otp, newPassword} = req.body;
  if(!email || !otp || !newPassword){
    return res.status(400).json({success:false, message:"Details missing, All fields are required"});
  }
  try {
    const user = await userModel.findOne({email});         
    if(!user){
      return res.status(400).json({success:false, message:"User does not exist"});
    }
    if(user.resetOtp === '' || user.resetOtp !== otp){
      return res.status(400).json({success:false, message:"Invalid OTP"});
    }
    if(user.resetOtpExpireAt < Date.now()){
      return res.status(400).json({success:false, message:"OTP has expired"});
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.status(200).json({success:true, message:"Password reset successfully"});
}catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
    
