const express = require("express");
const router = express.Router();

const {
  createTable,
  getAllTables,
  updateTable,
  deleteTable,
} = require("../controllers/tablesController");
const {
  addBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  getBookingsByTableId,
} = require("../controllers/bookingController");

router.post("/", createTable);
router.get("/", getAllTables);
router.patch("/:id", updateTable);
router.delete("/:id", deleteTable);

router.get("/bookings", getAllBookings);
router.get("/bookings/:bookingId", getBookingById);
router.get("/:tableId/bookings", getBookingsByTableId);
router.post("/:tableId/bookings", addBooking);
router.patch("/:tableId/bookings/:bookingId", updateBooking);
router.delete("/:tableId/bookings/:bookingId", deleteBooking);

module.exports = router;
