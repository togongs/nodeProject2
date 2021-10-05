// 댓글 스키마

const mongoose = require("mongoose");

const { Schema } = mongoose;
const commentSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  comment: {
      type: String,
      required: true,
  },
})

module.exports = mongoose.model("comment", commentSchema);