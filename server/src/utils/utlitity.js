import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const isOverlapping = (
  existingCheckIn,
  existingCheckOut,
  newCheckIn,
  newCheckOut
) => {
  return (
    (newCheckIn >= existingCheckIn && newCheckIn < existingCheckOut) ||
    (newCheckOut > existingCheckIn && newCheckOut <= existingCheckOut) ||
    (newCheckIn <= existingCheckIn && newCheckOut >= existingCheckOut)
  );
};

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
}

export function generatOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}
