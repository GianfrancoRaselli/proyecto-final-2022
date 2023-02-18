const { Schema, model } = require("mongoose");

const entitySchema = new Schema(
  {
    address: {
      type: String,
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
      maxLength: 50,
    },
    type: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      maxLength: 80,
      default: undefined,
    },
    phone: {
      type: String,
      trim: true,
      maxLength: 50,
      default: undefined,
    },
    photo: {
      type: String,
      default: undefined,
    },
    url: {
      type: String,
      trim: true,
      maxLength: 80,
      default: undefined,
    },
  },
  { collection: "entities", timestamps: true }
);

module.exports = model("Entity", entitySchema);
