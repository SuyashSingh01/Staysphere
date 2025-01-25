import { twilio } from "twilio";
import { generatOtp } from "./generatOtp";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function createVerification(number) {
  try {
    const otp = generatOtp();
    const verification = await client.verify.v2
      .services("VAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      .verifications.create({
        channel: "sms",
        to: `${number}`,
        code: `OTP:  ${otp}`,
        from: "+15017122661",
      })
      .then(() => console.log("OTP sent successfully"));
    console.log(verification);
    console.log(verification.sid);
    return otp;
  } catch (err) {
    console.error(err);
  }
}
