const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,  
    minlength: 3 // Min length username
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true, 
    match: [/.+@.+\..+/, 'Invalid email address'] // verifiera e-postformat
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  }
}, {
  timestamps: true 
});

const User = mongoose.model('User', userSchema, 'UserInfo');

module.exports = User;
