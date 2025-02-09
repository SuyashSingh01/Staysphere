import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();
import { generatOtp } from "./utlitity.js";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function createVerification(number) {
  try {
    const otp = generatOtp();
    const message = await client.messages
      .create({
        body: `Verify Yourself at Staysphere here is Your Otp  ${otp} valid for 5 minutes and will be expired after that `,
        to: `+91${number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      })
      .then((message) => console.log(message.sid));

    // console.log(verification);
    // console.log(verification.sid);
    return otp;
  } catch (err) {
    console.error(err);
  }
}
