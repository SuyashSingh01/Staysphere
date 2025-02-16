import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { JsonResponse } from "../utils/jsonResponse.js";

export async function uploadImageCloudinary(file, folder, quality) {
  const options = {
    folder,
  };
  options.resource_type = "auto";
  if (quality) {
    options.quality = quality;
  }
  // Upload the File on cloud
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function localfileupload(req, res) {
  try {
    // to access the file from req body we use heirarchy req.files.file;
    const file = req.files.file;
    console.log("file: ", file);
    // we can add extension in it
    let folderpath = __dirname + "/files/" + Date.now() + path.extname(file);

    console.log("path: ", folderpath);
    // then move the file on this path
    file.mv(folderpath, (err) => {
      console.log(err);
    });
    return JsonResponse(res, {
      status: 200,
      message: "Local File uploaded successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
}

// make an routes handler over here for cloudinary uploading

export const imageupload = async (fileImages) => {
  try {
    const files = fileImages.images;
    console.log("files in imageupload", files);

    if (!files || files.length === 0 || files.length === 1) {
      throw new Error(
        "Image upload error file not found or less than required files"
      );
    }
    // Prepare an array to store uploaded image data
    const uploadedImages = [];
    await Promise.all(
      files?.map(async (file) => {
        const types = path.extname(file.name).split(".")[1].toLowerCase();
        const supportedTypes = ["jpg", "png", "jpeg", "webp"];
        const checkValidType = supportedTypes.includes(types);

        if (!checkValidType) {
          throw new Error("Invalid type of File Uploaded");
        }
        // Upload the image to Cloudinary
        const cloudinaryResponse = await uploadImageCloudinary(
          file,
          "Staysphere"
        );
        console.log("cloudinaryres: ", cloudinaryResponse);
        // Add the image data to the uploadedImages array
        uploadedImages.push(cloudinaryResponse.secure_url);
      })
    );
    // If all files were successfully uploaded and saved
    return uploadedImages;
  } catch (err) {
    console.log(err);
    throw new Error("Error while uploading Images ");
  }
};

export async function videoupload(req, res) {
  try {
    const file = req.files.file;
    console.log("file: ", file);

    // validation whether it is supported or not
    const types = file.name.split(".")[1].toLowerCase();
    const supportedtype = ["mov", "mkv", "mp4", "avi", "flv"];
    const checkvalidtype = supportedtype.includes(types);

    // if file is valid type
    if (checkvalidtype) {
      const cloudinaryresponse = await uploadImageCloudinary(
        file,
        "StaysphereVideo"
      );
      console.log("cloudinaryres: ", cloudinaryresponse);
      // Create a new file record in the database
      const User = await UserFile.create({
        name: req.body.name,
        mediaurl: cloudinaryresponse.secure_url,
        email: req.body.email,
      });
      return res.status(200).json({
        message: "Video uploaded successfully",
        success: true,
        data: User,
        videourl: cloudinaryresponse.secure_url,
        publicid: cloudinaryresponse.public_id,
      });
    } else {
      return res.status(400).json({
        message: "File type not supported",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something Went Wrong",
      error: err.message,
      success: false,
    });
  }
}

// imagesizereducer
export async function imagecompress(req, res) {
  try {
    const file = req.files.file;
    console.log("file: ", file);

    // validation whether it is supported or not
    const types = file.name.split(".")[1].toLowerCase();
    const supportedtype = ["jpg", "png", "jpeg", "webp"];
    const checkvalidtype = supportedtype.includes(types);

    // if file is valid type
    if (checkvalidtype) {
      const cloudinaryresponse = await uploadImageCloudinary(
        file,
        "StaysphereImage",
        50
      );
      console.log("cloudinaryres: ", cloudinaryresponse);
      // Create a new file record in the database
      const User = await UserFile.create({
        name: req.body.name,
        mediaurl: cloudinaryresponse.secure_url,
        email: req.body.email,
      });
      return res.status(200).json({
        message: "Image uploaded successfully",
        success: true,
        data: User,
        imageurl: cloudinaryresponse.secure_url,
        publicid: cloudinaryresponse.public_id,
      });
    } else {
      return res.status(400).json({
        message: "File type not supported",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something Went Wrong",
      error: err.message,
      success: false,
    });
  }
}

// another way in cjs
// module.exports = { imageupload, videoupload, loacalfile };

// another way in mjs
// export { imageupload, videoupload, localfileupload, imagecompress };
