import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOncloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("file is uploaded on cloudinary", response.url);

    // ✅ Option A: Delete file asynchronously with callback
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // ✅ Option B: Safely delete file synchronously in case of failure
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOncloudinary };
