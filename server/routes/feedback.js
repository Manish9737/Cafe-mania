const express = require('express');
const { newFeedback, updateFeedback, allFeedbacks } = require('../controllers/feedback');
const router = express.Router();

router.get("/", allFeedbacks);
router.post("/", newFeedback);
router.patch("/:id", updateFeedback);

module.exports = router;