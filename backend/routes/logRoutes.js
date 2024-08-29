const express = require('express');
const jwt = require('jsonwebtoken');
const Log = require('../models/Log'); 
const router = express.Router();

// Middleware to check auth and extract userId from token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// CREATE LOG
router.post('/', authenticate, async (req, res) => {
  const { mood, sleepHours, note } = req.body;

  try {
    const newLog = new Log({
      mood,
      sleepHours,
      note,
      userId: req.userId,
    });

    await newLog.save();
    res.status(201).json({ message: 'Log created successfully', log: newLog });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET LOGS FOR A USER
router.get('/', authenticate, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE LOG
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { mood, sleepHours, note } = req.body;

  try {
    const log = await Log.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { mood, sleepHours, note },
      { new: true }
    );
    if (!log) {
      return res.status(404).json({ message: 'Log not found or user not authorized' });
    }
    res.status(200).json({ message: 'Log updated successfully', log });
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE LOG
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const log = await Log.findOneAndDelete({ _id: id, userId: req.userId });
    if (!log) {
      return res.status(404).json({ message: 'Log not found or user not authorized' });
    }
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// AGGREGATE LOGS BY DAY
router.get('/stats', async (req, res) => {
  try {
    const logs = await Log.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          moodAvg: { $avg: '$mood' },
          sleepAvg: { $avg: '$sleepHours' },
        },
      },
      { $sort: { _id: 1 } } // Sort by date
    ]);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
