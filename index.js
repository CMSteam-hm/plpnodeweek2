// index.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Mock user data (for demonstration purposes)
const users = [
  {
    id: 1,
    username: 'user1',
    passwordHash: '$2a$10$35UscWJl8AlfgBth.NN33O4UWH9lZx7Cn8J4mJr7A11BrPv/v5T4u', // Hashed password: 'password1'
    name: 'User One'
  },
  {
    id: 2,
    username: 'user2',
    passwordHash: '$2a$10$6S4tv0rTbQ3Bp1/6o99tb.iBcA6zlaXMoZppFZm0TBc5iF.nZwTCC', // Hashed password: 'password2'
    name: 'User Two'
  }
];

// Password hashing function
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// JWT secret key (replace with a long, random string in production)
const jwtSecretKey = 'your_jwt_secret_key';

// Authentication endpoint with input validation and JWT token generation
app.post('/api/auth/login',
  [
    // Validate username and password
    body('username').trim().isLength({ min: 1 }).escape(),
    body('password').trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Find user by username
      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '1h' });

      // Return success with token
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Example of a secured endpoint (requires JWT token)
app.get('/api/users', verifyToken, (req, res) => {
  // Access userId from verified token (you might fetch user data from DB)
  const userId = req.userId;
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Verify JWT token middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ message: 'Access denied, invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// Input data sanitization middleware
app.use((req, res, next) => {
  // Sanitize request body
  req.body = sanitizeRequestData(req.body);
  next();
});

// Function to sanitize request data (for demonstration purposes)
function sanitizeRequestData(data) {
  // Sanitize HTML in user inputs
  const sanitizedData = {};
  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      sanitizedData[key] = sanitizeHtml(data[key]);
    }
  }
  return sanitizedData;
}

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
