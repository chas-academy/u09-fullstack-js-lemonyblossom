const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User'); 
const logRoutes = require('./routes/logRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');
const toolsRoutes = require('./routes/toolsRoutes'); 

const jwt = require('jsonwebtoken')

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['https://feelstate.netlify.app', 'http://localhost:3000'], 
  credentials: true,  
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

const PORT = process.env.PORT || 5001;

// Verify token endpoint
app.get('/verifyToken', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Use routes
app.use('/users', userRoutes);
app.use('/logs', logRoutes);
app.use('/admin', adminRoutes);
app.use('/password', resetPasswordRoutes);
app.use('/tools', toolsRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
