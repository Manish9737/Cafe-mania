const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: false,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    }, 
    customerPhone: {
      type: String,
      required: true,
    },
    date: {
      type: Date, 
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
      enum: ['Booked', 'Completed', 'Cancelled', 'Confirmed'],
      default: 'Booked',
    },
    notes: {
      type: String,
    }
  },
  { timestamps: true, _id: true }
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