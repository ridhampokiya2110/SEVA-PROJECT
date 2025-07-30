# Seva Backend API

Backend API for the Seva Food Donation App, built with Express.js and MongoDB.

## Features

- User authentication and authorization
- NGO management
- Food donation tracking
- JWT-based security
- RESTful API design

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### NGOs
- `GET /api/ngos` - Get all NGOs
- `GET /api/ngos/:id` - Get NGO by ID
- `GET /api/ngos/category/:category` - Get NGOs by category
- `POST /api/ngos` - Create new NGO (Admin only)
- `PUT /api/ngos/:id` - Update NGO (Admin only)
- `DELETE /api/ngos/:id` - Delete NGO (Admin only)

### Donations
- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get donation by ID
- `POST /api/donations` - Create new donation
- `PATCH /api/donations/:id/status` - Update donation status (Admin only)
- `DELETE /api/donations/:id` - Cancel donation

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Run development server: `npm run dev`
5. Run production server: `npm start`

## Deployment on Render

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Create a new Web Service
4. Set environment variables in Render dashboard
5. Deploy!

## Database Schema

### User
- name, email, password, phone, role, address

### NGO
- name, description, category, address, contact, capacity, currentOccupancy, image, isActive

### Donation
- donor, ngo, foodType, foodCategory, quantity, servingSize, pickupLocation, pickupDateTime, deliveryMethod, status, notes 