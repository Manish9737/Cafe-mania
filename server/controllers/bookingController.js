const Tables = require("../models/tables");

exports.addBooking = async (req, res) => {
  try {
    const { tableId } = req.params;
    const bookingData = req.body;

    const table = await Tables.findById(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    table.bookings.push(bookingData);
    table.status = "Reserved";

    await table.save();

    res.status(201).json({
      success: true,
      message: "Booking added successfully",
      data: table,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const tables = await Tables.find().select(
      "tableNo capacity status bookings",
    );

    const allBookings = tables.flatMap((table) =>
      table.bookings.map((booking) => ({
        _id: booking._id,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        date: booking.date,
        timeSlot: booking.timeSlot,
        guests: booking.guests,
        status: booking.status,
        createdAt: booking.createdAt,

        // Table Info
        tableId: table._id,
        tableNo: table.tableNo,
        tableCapacity: table.capacity,
        tableStatus: table.status,
      })),
    );

    res.status(200).json({
      success: true,
      count: allBookings.length,
      data: allBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const table = await Tables.findOne({
      "bookings._id": bookingId,
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = table.bookings.id(bookingId);

    res.status(200).json({
      success: true,
      data: {
        _id: booking._id,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        date: booking.date,
        timeSlot: booking.timeSlot,
        guests: booking.guests,
        status: booking.status,
        createdAt: booking.createdAt,

        // Table Info
        tableId: table._id,
        tableNo: table.tableNo,
        tableCapacity: table.capacity,
        tableStatus: table.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { tableId, bookingId } = req.params;

    const table = await Tables.findById(tableId);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const booking = table.bookings.id(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    Object.assign(booking, req.body);
    await table.save();

    res.json({
      success: true,
      message: "Booking updated",
      data: table,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { tableId, bookingId } = req.params;

    const table = await Tables.findById(tableId);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    table.bookings.id(bookingId).remove();
    await table.save();

    res.json({
      success: true,
      message: "Booking removed successfully",
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
