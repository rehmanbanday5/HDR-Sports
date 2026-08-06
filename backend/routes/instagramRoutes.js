const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/instagramController");

const { protect, restrictTo } = require("../middleware/auth");

const upload = require("../middleware/upload");

// Public
router.get("/", ctrl.getInstagramPosts);

// Admin
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  ctrl.createInstagramPost,
);

router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  ctrl.updateInstagramPost,
);

router.delete("/:id", protect, restrictTo("admin"), ctrl.deleteInstagramPost);

module.exports = router;
