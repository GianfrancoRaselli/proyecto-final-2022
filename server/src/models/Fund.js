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
    imageVersion: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: undefined,
    },
    history: {
      type: String,
      maxLength: 100000,
    },
    risks: {
      type: String,
      maxLength: 100000,
    },
    rewards: {
      type: String,
      maxLength: 100000,
    },
    imagesAmount: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    updates: [
      {
        updater: {
          type: String,
          trim: true,
          maxLength: 80,
        },
        description: {
          type: String,
          trim: true,
          maxLength: 1000,
        },
        updatedAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  { collection: "funds", timestamps: true }
);

module.exports = model("Fund", fundSchema);
