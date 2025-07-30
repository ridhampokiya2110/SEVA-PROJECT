const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoints
app.get('/', (req, res) => {
  res.json({ message: 'Seva Backend API is working!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Seva API is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock NGO data
app.get('/api/ngos', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Test NGO 1',
      description: 'This is a test NGO',
      category: 'orphanage',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State'
      }
    },
    {
      id: '2', 
      name: 'Test NGO 2',
      description: 'Another test NGO',
      category: 'old-age-home',
      address: {
        street: '456 Test Ave',
        city: 'Test City',
        state: 'Test State'
      }
    }
  ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 