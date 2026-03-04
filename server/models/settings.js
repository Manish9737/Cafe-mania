const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    cafeName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    taxPercentage: {
      type: Number,
      default: 0,
    },
    openingTime: {
      type: String,
    },
    closingTime: {
      type: String,
    },
    footerText: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Settings", settingsSchema);
