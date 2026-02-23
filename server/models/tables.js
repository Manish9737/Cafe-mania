const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // make sure you have User model
      required: true,
    },

    date: {
      type: String, // e.g. "2026-02-01"
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "7:00 PM - 9:00 PM"
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Booked', 'Completed', 'Cancelled'],
      default: 'Booked',
    },
    notes: {
      type: String,
    }
  },
  { timestamps: true }
);

const tableSchema = new mongoose.Schema(
  {
    tableNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Reserved', 'Inactive'],
      default: 'Available',
    },
    bookings: [bookingSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Tables = mongoose.model('Table', tableSchema);
module.exports = Tables