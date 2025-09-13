import twilio from "twilio";
import { generatOtp } from "./utlitity.js";
import { ENV } from "../constant/env.js";

const accountSid = ENV.TWILIO_SERVICE.TWILIO_ACCOUNT_SID;
const authToken = ENV.TWILIO_SERVICE.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function createVerification(number, otp) {
  try {
    const message = await client.messages
      .create({
        body: `Verify Yourself at Staysphere here is Your Otp  ${otp} valid for 5 minutes and will be expired after that `,
        to: `+91${number}`,
        from: `${ENV.TWILIO_SERVICE.TWILIO_PHONE_NUMBER}`,
      })
      .then((message) => console.log(message.sid));
    return message;
  } catch (err) {
    console.error(err);
    throw new Error("Error sending OTP");
  }
}
