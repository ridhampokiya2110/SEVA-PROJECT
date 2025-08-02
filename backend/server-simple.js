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
      name: 'Hope Orphanage',
      description: 'Providing care for orphaned children',
      category: 'orphanage',
      address: {
        street: '123 Hope St',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      contact: {
        phone: '+91-1234567890',
        email: 'hope@example.com'
      }
    },
    {
      id: '2', 
      name: 'Elder Care Home',
      description: 'Caring for elderly citizens',
      category: 'old-age-home',
      address: {
        street: '456 Care Ave',
        city: 'Delhi',
        state: 'Delhi'
      },
      contact: {
        phone: '+91-9876543210',
        email: 'elder@example.com'
      }
    }
  ]);
});

// Register user (mock implementation)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Mock user creation
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      role: role || 'donor',
      phone: phone || '1234567890'
    };

    // Generate simple token
    const token = `token_${mockUser.id}_${Date.now()}`;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user (mock implementation)
app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract user ID from token (simple implementation)
    const userId = token.split('_')[1];
    
    // Mock user data
    const mockUser = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      role: 'donor'
    };

    res.json({ user: mockUser });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 