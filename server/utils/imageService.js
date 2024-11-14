import * as dotenv from "dotenv"
dotenv.config()
import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default {
    uploadImageToCloudinary: async (filePath) => {
        return cloudinary.v2.uploader.upload(filePath, { folder: "community_issue_report" });
    },
    deleteLocalFile: async (filePath) => {
        await fs.promises.unlink(filePath);
    },
    deleteLocalFiles: async (files) => {
        for (const file of files) {
            await fs.promises.unlink(file.path);
        }
    },
    cleanupFailedUpload: async (uploads) => {
        for (const upload of uploads) {
            await cloudinary.v2.uploader.destroy(upload.image_public_url);
        }
    }
};
