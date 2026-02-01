const Tables = require('../models/tabless');


exports.createTable = async (req, res) => {
  try {
    const { tableNo, capacity } = req.body;

    const table = await Tables.create({
      tableNo,
      capacity,
    });

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: table,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Tables.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const table = await Tables.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    res.json({
      success: true,
      message: 'Table updated',
      data: table,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await Tables.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    res.json({
      success: true,
      message: 'Table deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
