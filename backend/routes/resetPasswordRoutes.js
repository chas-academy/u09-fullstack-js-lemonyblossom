const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// REQUEST PASSWORD RESET
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate JWT token for password reset
    const resetToken = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Construct password reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Setup email transport for sending password reset email
    const transporter = nodemailer.createTransport({
     /*  service: 'hotmail', 
      auth: {
        user: process.env.EMAIL,         
        pass: process.env.EMAIL_PASSWORD 
      } */
     service: "hotmail",
     host: "smtp-mail.outlook.com",
     port: 587,
auth:{
  user:"emmath93@hotmail.com",
  pass: "Jagarenlitenhast123",
} ,
   });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Hello ${user.username},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetLink}\n\nThis link is valid for 1 hour.\nIf you did not request this, please ignore this email.`,
    };

    // Try sending email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.response);
      return res.status(200).json({ message: 'Password reset link has been sent to your email' });
    } catch (emailError) {
      console.error('Error sending email: ', emailError);
      return res.status(500).json({ message: 'Error sending password reset email', error: emailError.message });
    }

  } catch (error) {
    console.error('Error in /request-password-reset: ', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user based on the decoded token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password and update the user's password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    // Handle specific JWT and password reset errors
    if (error.name === 'TokenExpiredError') {
      console.error('Error: Token expired');
      return res.status(400).json({ message: 'Reset token has expired. Please request a new one.' });
    } else if (error.name === 'JsonWebTokenError') {
      console.error('Error: Invalid token');
      return res.status(400).json({ message: 'Invalid token. Please request a new reset link.' });
    } else {
      console.error('Error in /reset-password: ', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

module.exports = router;
