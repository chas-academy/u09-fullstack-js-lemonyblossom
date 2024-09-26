const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  link: { type: String }, 
}, { timestamps: true });

const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool;
