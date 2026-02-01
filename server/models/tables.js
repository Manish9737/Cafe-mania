const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      trim: true,
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
  },
  { timestamps: true }
);

const tableSchema = new mongoose.Schema(
  {
    tableNo: {
      type: String,
      required: true,
      unique: true, // T1, T2, VIP-1, etc
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