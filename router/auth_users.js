const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const books = require('./booksdb');
const regd_users = express.Router();

let users = []; 

const isValid = (username) => {
  return username && username.trim() !== '';
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

const JWT_SECRET = 'fxhhhhhhhhhhhhhhhhhhhhhhhhhhht777777775e7cy'; 

// Login route for registered users
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Validate the username
  if (!isValid(username)) {
    return res.status(400).json({ message: 'Invalid username' });
  }

  // Authenticate the user
  if (authenticatedUser(username, password)) {
    // Create a JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    // Store the token in the session
    req.session.token = token;

    // Send success response
    res.json({ message: 'Login successful', token });
  } else {
    // Return a 401 error if authentication fails
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.session.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded; 
      next(); 
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

const sampleUsername = 'testuser';

// Route to add or update a book review
regd_users.put('/auth/review/:id',authMiddleware, (req, res) => {
  const { id } = req.params;
  const { review } = req.query; 

  if (!review) {
    return res.status(400).json({ message: 'Review text is required' });
  }

  if (books[id]) {
    books[id].reviews = books[id].reviews || {};
    books[id].reviews[sampleUsername] = review; 
    res.json({ message: 'Review added/updated successfully' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

let currentUser = "testuser"; 

// Middleware to simulate user login (for testing purposes)
/* regd_users.use((req, res, next) => {
  currentUser = 'sampleUser'; 
  next();
}); */

// Route to delete a book review
regd_users.delete('/auth/review/:id',authMiddleware, (req, res) => {
  const { id } = req.params;

  if (!currentUser) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (books[id]) {
    if (books[id].reviews && books[id].reviews[currentUser]) {
      delete books[id].reviews[currentUser];
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Review deleted successfully' });
    }
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Example protected route (requires authentication)
regd_users.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
