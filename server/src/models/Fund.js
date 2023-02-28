const { Schema, model } = require("mongoose");

const fundSchema = new Schema(
  {
    address: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
      maxLength: 80,
    },
    creator: {
      type: String,
      trim: true,
      required: true,
      maxLength: 80,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxLength: 1000,
    },
    image: {
      type: String,
      default: undefined,
    },
  },
  { collection: "funds", timestamps: true }
);

module.exports = model("Fund", fundSchema);
