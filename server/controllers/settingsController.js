const Settings = require("../models/settings");


// ================= CREATE OR UPDATE SETTINGS =================
exports.upsertSettings = async (req, res) => {
  try {
    const data = req.body;

    let settings = await Settings.findOne();

    if (settings) {
      // Update existing
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        data,
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Settings updated successfully",
        settings,
      });
    }

    // Create new
    settings = await Settings.create(data);

    res.status(201).json({
      success: true,
      message: "Settings created successfully",
      settings,
    });

  } catch (error) {
    console.error("Settings Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ================= GET SETTINGS (PUBLIC) =================
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    res.status(200).json({
      success: true,
      settings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};