const asyncHandler = require("express-async-handler");
const InstagramPost = require("../models/instagramPost");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");

// ==============================
// Get Active Posts
// GET /api/instagram
// ==============================

exports.getInstagramPosts = asyncHandler(async (req, res) => {
  const posts = await InstagramPost.find({ isActive: true }).sort(
    "displayOrder createdAt",
  );

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});

// ==============================
// Create Post
// POST /api/instagram
// ==============================

exports.createInstagramPost = asyncHandler(async (req, res) => {
  const { title, instagramUrl, displayOrder } = req.body;

  const post = new InstagramPost({
    title,
    instagramUrl,
    displayOrder,
  });

  if (req.file) {
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64",
    )}`;

    const result = await uploadToCloudinary(base64, "HDR/instagram");

    post.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  await post.save();

  res.status(201).json({
    success: true,
    post,
  });
});

// ==============================
// Update Post
// PUT /api/instagram/:id
// ==============================

exports.updateInstagramPost = asyncHandler(async (req, res) => {
  const post = await InstagramPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Instagram post not found");
  }

  Object.assign(post, req.body);

  if (req.file) {
    if (post.image?.publicId) {
      await deleteFromCloudinary(post.image.publicId);
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64",
    )}`;

    const result = await uploadToCloudinary(base64, "HDR/instagram");

    post.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  await post.save();

  res.status(200).json({
    success: true,
    post,
  });
});

// ==============================
// Delete Post
// DELETE /api/instagram/:id
// ==============================

exports.deleteInstagramPost = asyncHandler(async (req, res) => {
  const post = await InstagramPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Instagram post not found");
  }

  if (post.image?.publicId) {
    await deleteFromCloudinary(post.image.publicId);
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Instagram post deleted",
  });
});
