const mongoose = require("mongoose");

const PostModel = mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    tags: { type: Array, default: [] },
    viewsCount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostModel);
