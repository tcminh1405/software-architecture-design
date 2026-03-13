const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const initUsers = require('./initUsers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CMS Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize default users on startup
setTimeout(() => {
  initUsers().catch(err => console.error('Failed to initialize users:', err));
}, 3000); // Wait 3 seconds for database to be ready

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
