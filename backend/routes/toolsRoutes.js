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
    res.status(500).json({ message: 'Server error while fetching tools' });
  }
});

// Search tools by title (name)
router.get('/search', async (req, res) => {
  console.log('Search route hit');
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query (q) is required' });
  }

  try {
    // Find tools where the name matches the search query (case-insensitive)
    const tools = await Tool.find({ name: { $regex: q, $options: 'i' } });
    
    if (tools.length === 0) {
      return res.status(404).json({ message: 'No tools found matching the search criteria' });
    }

    res.status(200).json(tools);
  } catch (error) {
    console.error('Error searching tools:', error);
    res.status(500).json({ message: 'Server error while searching tools' });
  }
});

module.exports = router;
