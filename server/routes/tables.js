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
  getBookingsByUserId,
  cancelBooking,
  addBookingByAdmin,
} = require("../controllers/bookingController");
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");

router.post("/", createTable);
router.get("/", getAllTables);
router.patch("/:id", updateTable);
router.delete("/:id", deleteTable);

router.get("/bookings", getAllBookings);
router.get("/bookings/:bookingId", getBookingById);
router.get("/:tableId/bookings", getBookingsByTableId);

router.post("/:tableId/bookings", auth, addBooking);
router.post("/admin/:tableId/bookings", adminAuth, addBookingByAdmin);

router.patch("/:tableId/bookings/:bookingId", updateBooking);
router.delete("/:tableId/bookings/:bookingId", deleteBooking);
router.patch("/:tableId/bookings/:bookingId/cancel", auth, cancelBooking);

router.get("/users/:userId/bookings", getBookingsByUserId);


module.exports = router;
