// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     host:'smtp-relay.brevo.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     }

// });
// console.log("SMTP_USER:", process.env.SMTP_USER);
// console.log("SMTP_PASS loaded:", !!process.env.SMTP_PASS);
// export default transporter;
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

export default transporter;
