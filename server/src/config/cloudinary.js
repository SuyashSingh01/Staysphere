import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { ENV } from "../constant/env.js";

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

export const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: ENV.CLOUDINARY_SERVICE.CLOUDINARY_CLOUD_NAME,
      api_key: ENV.CLOUDINARY_SERVICE.CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_SERVICE.CLOUDINARY_API_SECRET,
    });
    console.info("Cloudinary Connected ");
  } catch (error) {
    console.error(error);
  }
};

export default cloudinaryConnect;
