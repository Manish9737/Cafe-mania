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
} = require("../controllers/bookingController");

router.post("/", createTable);
router.get("/", getAllTables);
router.patch("/:id", updateTable);
router.delete("/:id", deleteTable);

router.post("/:tableId/bookings", addBooking);
router.patch("/:tableId/bookings/:bookingId", updateBooking);
router.delete("/:tableId/bookings/:bookingId", deleteBooking);

module.exports = router;
