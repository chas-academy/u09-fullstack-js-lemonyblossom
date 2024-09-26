const express = require('express');
const Tool = require('../models/Tool'); // Import your Tool model
const router = express.Router();

// Fetch all tools
router.get('/', async (req, res) => {
  try {
    const tools = await Tool.find(); // Fetch all tools from the database
    res.status(200).json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
