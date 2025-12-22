import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Configured with Cloud Name:", cloudinary.config().cloud_name);
console.log("Cloudinary Configured with API Key:", cloudinary.config().api_key);
console.log("Cloudinary Configured with API Secret:", cloudinary.config().api_secret);

export default cloudinary;