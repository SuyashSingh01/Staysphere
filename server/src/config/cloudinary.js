import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import multer from "multer";
config();

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

export const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary Connected ");
  } catch (error) {
    console.log(error);
  }
};

export default cloudinaryConnect;
