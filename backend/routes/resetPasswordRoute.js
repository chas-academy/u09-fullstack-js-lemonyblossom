const nodemailer = require('nodemailer'); // Import nodemailer

// Transporter for sending email (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use another email provider or SMTP
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD // Your email password or app password
  }
});

// REQUEST PASSWORD RESET
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found with this email' });
    }

    // Create a reset token (valid for 1 hour)
    const resetToken = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send reset password link via email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Hello ${user.username},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetLink}\n\nThis link is valid for 1 hour.\nIf you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
