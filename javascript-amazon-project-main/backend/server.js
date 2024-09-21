const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import CORS middleware
const app = express();
const port = 3000;

app.use(express.json());

// Use CORS to allow requests from different origins
app.use(cors());

// Connect to the SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// API route to get all products
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// API route to place users cart
app.post('/cart', (req, res) => {
  const { productId, user, qty } = req.body;

  const query = `INSERT INTO cart (pid, user_name, qty) VALUES (?, ?, ?)`;
  
  db.run(query, [productId, user, qty], function(err) {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }

      res.json({
          message: 'success',
          data: {
              productId: productId,
              user: user,
              qty: qty
          },
          id: this.lastID
      });
  });
});

//get users cart
app.get('/cart', (req, res) => {
  const user = req.query.user;

  if (!user) {
      return res.status(400).json({ error: 'User name is required' });
  }

  const query = `SELECT cart.id, products.name, products.price, cart.qty ,products.image
                 FROM cart 
                 JOIN products ON cart.pid = products.id 
                 WHERE cart.user_name = ?`;

  db.all(query, [user], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      if (rows.length === 0) {
          return res.json({ message: 'No items in the cart', data: [] });
      }

      res.json({
          message: 'success',
          data: rows
      });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
