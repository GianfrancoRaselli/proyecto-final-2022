const { Schema, model } = require("mongoose");

const entitySchema = new Schema(
  {
    address: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
      maxLength: 80,
    },
    fullname: {
      type: String,
      trim: true,
      required: true,
      minLength: 2,
      maxLength: 80,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxLength: 1000,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      maxLength: 80,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      maxLength: 50,
    },
    location: {
      type: String,
      trim: true,
      required: true,
      maxLength: 100,
    },
    url: {
      type: String,
      trim: true,
      maxLength: 320,
      default: undefined,
    },
    imageVersion: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: undefined,
    },
    savedFunds: [
      {
        type: String,
      },
    ],
  },
  { collection: "entities", timestamps: true }
);

module.exports = model("Entity", entitySchema);
