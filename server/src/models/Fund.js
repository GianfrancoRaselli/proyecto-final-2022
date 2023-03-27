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
      maxLength: 1000,
    },
    image: {
      type: String,
      default: undefined,
    },
    imageVersion: {
      type: Number,
      default: 0,
    },
    history: {
      type: String,
      trim: true,
      maxLength: 5000,
    },
    risks: {
      type: String,
      trim: true,
      maxLength: 5000,
    },
    rewards: {
      type: String,
      trim: true,
      maxLength: 5000,
    },
    images: [
      {
        type: String,
      },
    ],
    imagesNumner: {
      type: Number,
      default: 0,
    },
    updates: [
      {
        type: String,
        trim: true,
        maxLength: 1000,
      },
    ],
  },
  { collection: "funds", timestamps: true }
);

module.exports = model("Fund", fundSchema);
