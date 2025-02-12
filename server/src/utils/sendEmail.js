import nodemailer from "nodemailer";
import { config } from "dotenv";
import otpTemplate from "../mailTemplate/otpverificationEmail.js";
config();

export async function sendVerificationEmail(email, otp, role = "User") {
  try {
    const mailResponse = await mailSender(
      email,
      `Verification Email For Staysphere ${role} `,
      otpTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

const mailSender = async (email, title, body, attachments = null) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: "Staysphere || Admin- SUYASH SINGH",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
      attachments: attachments,
    });
    // console.log("mail:", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

export default mailSender;
