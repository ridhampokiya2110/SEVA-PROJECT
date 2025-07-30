const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Seva Backend API is working!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Seva API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
}); 