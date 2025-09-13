import nodemailer from "nodemailer";
import otpTemplate from "../mailTemplate/otpverificationEmail.js";
import { ENV } from "../constant/env.js";

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
      host: ENV.MAIL_SERVICE.MAIL_HOST,
      auth: {
        user: ENV.MAIL_SERVICE.MAIL_USER,
        pass: ENV.MAIL_SERVICE.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: "Staysphere || Admin - SUYASH SINGH",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
      attachments: attachments,
    });
    // console.log("mail:", info);
    return info;
  } catch (error) {
    console.error(error.message);
  }
};

export default mailSender;
