import mongoose from "mongoose";
import { config } from "dotenv";
config();

export const dbConnect = async () => {
  console.log("DbURL", process.env.MONGODB_URL);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Db connected Successfully!");
    })
    .catch((err) => {
      console.log("Db connection issue", err);
    });
};
