const mongoose = require("mongoose");

const instagramPostSchema = new mongoose.Schema(
  {
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },

    instagramUrl: {
      type: String,
      trim: true,
      default: "",
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("InstagramPost", instagramPostSchema);
