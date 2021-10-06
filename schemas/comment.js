// 댓글 스키마

const mongoose = require("mongoose");

const { Schema } = mongoose;
const commentSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  comment: {
      type: String,
      required: true,
  },
  postId: {
      type: String,
      required: true,
  },
})

module.exports = mongoose.model("comment", commentSchema);