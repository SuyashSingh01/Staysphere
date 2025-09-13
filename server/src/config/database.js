import mongoose from "mongoose";
import { ENV } from "../constant/env.js";

export const dbConnect = async () => {
  console.info("DbURL", ENV.MONGODB_URL);
  mongoose
    .connect(ENV.MONGODB_URL)
    .then(() => {
      console.info("Db connected Successfully!");
    })
    .catch((err) => {
      console.error("Db connection issue", err);
    });
};
