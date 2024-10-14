const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,  
    minlength: 5
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true, 
    match: [/.+@.+\..+/, 'Invalid email address'] 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    default: 'user'
  },
  savedTools: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tool' 
    }]
  }, {
  timestamps: true 
});

const User = mongoose.model('User', userSchema, 'UserInfo');

module.exports = User;
