const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users.push({ username, password });

  res.status(201).json({ message: 'User registered successfully' });
});
// Get the book list available in the shop
/* public_users.get('/book-list', (req, res) => {
  res.json(books);
}); */


public_users.get('/book-list', (req, res) => {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then(result => {
    res.json(result);
  })
  .catch(error => {
    res.status(500).json({ message: 'Error fetching books', error });
  });
});
// Get book details based on Id

/* public_users.get('/isbn/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); 
  
  const book = books[id];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
}); */
public_users.get('/isbn/:id', (req, res) => {
  // Retrieve the ID from request parameters
  const id = parseInt(req.params.id, 10); 

  // Simulate an asynchronous operation with a Promise
  new Promise((resolve, reject) => {
    // Find the book with the matching ID
    const book = books[id];
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Book not found'));
    }
  })
  .then(result => {
    // Return the book details if found
    res.json(result);
  })
  .catch(error => {
    // Return a 404 error if the book is not found
    res.status(404).json({ message: error.message });
  });
});
  
// Get book details based on author
/* public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  
  const booksArray = Object.values(books);
  
  const booksByAuthor = booksArray.filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: 'No books found by this author' });
  }
}); */
public_users.get('/author/:author', (req, res) => {
  // Retrieve the author from request parameters
  const author = req.params.author;

  // Simulate an asynchronous operation with a Promise
  new Promise((resolve, reject) => {
    // Convert books object to an array of book values
    const booksArray = Object.values(books);

    // Filter books by the author
    const booksByAuthor = booksArray.filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(new Error('No books found by this author'));
    }
  })
  .then(result => {
    // Return the list of books by the author if found
    res.json(result);
  })
  .catch(error => {
    // Return a 404 error if no books are found
    res.status(404).json({ message: error.message });
  });
});
// Get all books based on title
/* public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  const booksArray = Object.values(books);
  const booksByTitle = booksArray.filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: 'No books found with this title' });
  }
}); */
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const booksArray = Object.values(books);

    const booksByTitle = booksArray.filter(book => book.title === title);

    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject(new Error('No books found with this title'));
    }
  })
  .then(result => {
    res.json(result);
  })
  .catch(error => {
    res.status(404).json({ message: error.message });
  });
});

//  Get book review
public_users.get('/review/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert ID to a number

  const book = books[id];

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
