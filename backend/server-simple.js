const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');

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

// Get NGOs from Supabase
app.get('/api/ngos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ngos')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password, // In production, hash this password
          phone,
          role: role || 'donor'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Registration failed' });
    }

    // Generate simple token (in production, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract user ID from token (simple implementation)
    const userId = token.split('_')[1];
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 