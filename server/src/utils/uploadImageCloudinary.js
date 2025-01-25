export const uploadImageCloudinary = async (file, folder, quality) => {
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
};
