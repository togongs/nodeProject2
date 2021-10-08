const mongoose = require("mongoose");

const { Schema } = mongoose;
const writeSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  pw: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("write", writeSchema);
