// 로그인, 회원가입 기능구현 위해 만듦

const mongoose = require("mongoose");

const { Schema } = mongoose;
const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
