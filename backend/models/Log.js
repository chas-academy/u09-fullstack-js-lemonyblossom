const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // from user mmodel
  mood: { type: Number, required: true, min: 1, max: 5 },  
  sleepHours: { type: Number, required: true, min: 0, max: 24 },  
  note: { type: String, trim: true },  // Optional note
  createdAt: { type: Date, default: Date.now }  //  entry timestamp
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
