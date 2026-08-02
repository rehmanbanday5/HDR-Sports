const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64/data-uri or local file path buffer to Cloudinary.
 * @param {string} fileStr - base64 data URI (from multer memory storage)
 * @param {string} folder - cloudinary subfolder, e.g. 'products'
 */

const uploadToCloudinary = (fileStr, folder = "HDR Sports/products") => {
  return cloudinary.uploader.upload(fileStr, {
    folder,
    resource_type: "image",
    transformation: [
      { width: 1600, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });
};

const deleteFromCloudinary = (publicId) => cloudinary.uploader.destroy(publicId);

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
