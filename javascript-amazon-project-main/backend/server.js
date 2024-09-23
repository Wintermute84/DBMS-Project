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
app.post('/addToCart', (req, res) => {
  const { productId, user, qty} = req.body;

  // First, check if the product already exists in the cart for the user
  const selectQuery = `SELECT qty FROM cart WHERE pid = ? AND user_name = ?`;
  
  db.get(selectQuery, [productId, user], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (row) {
      // Product already exists, update the quantity
      const updatedQty = row.qty + qty;
      const updateQuery = `UPDATE cart SET qty = ? WHERE pid = ? AND user_name = ?`;
      
      db.run(updateQuery, [updatedQty, productId, user], function(err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        res.json({
          message: 'success',
          data: {
            productId: productId,
            user: user,
            qty: updatedQty
          }
        });
      });
    } else {
      // Product doesn't exist, insert it into the cart
      const insertQuery = `INSERT INTO cart (pid, user_name, qty) VALUES (?, ?, ?)`;
      
      db.run(insertQuery, [productId, user, qty], function(err) {
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
    }
  });
});


//get users cart
app.get('/cart', (req, res) => {
  const user = req.query.user;

  if (!user) {
      return res.status(400).json({ error: 'User name is required' });
  }

  const query = `SELECT cart.id, products.name, products.price, cart.qty ,products.image,cart.deliveryoptionid
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

//get cart quantity
app.get('/cartquantity', (req, res) => {
  const user = req.query.user;
  if (!user) {
      return res.status(400).json({ error: 'User name is required' });
  }
  const query = `SELECT sum(qty) as cartQty
                 FROM cart  
                 WHERE user_name = ?`;

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

//update quantity of product if already existing in user cart
app.post('/cartupdatequantity', (req, res) => {
  const { productId, user, qty } = req.body;
  const selectQuery = `SELECT qty FROM cart WHERE user_name = ? AND pid = ?`;
  db.get(selectQuery, [user, productId], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (row) {
          const newQty = row.qty + qty;
          const updateQuery = `UPDATE cart SET qty = ? WHERE user_name = ? AND pid = ?`;

          db.run(updateQuery, [newQty, user, productId], function(err) {
              if (err) {
                  return res.status(400).json({ error: err.message });
              }

              res.json({
                  message: 'success',
                  data: {
                      productId: productId,
                      user: user,
                      qty: newQty
                  },
                  id: this.lastID
              });
          });
      } else {
          res.status(404).json({ error: 'Product not found in cart' });
      }
  });
});

//updates the delivery option
app.post('/updateDeliveryOption', (req, res) => {
  const { productId, user, deliveryoptionid } = req.body;

  const updateQuery = `UPDATE cart SET deliveryoptionid = ? WHERE id = ? AND user_name = ?`;

  db.run(updateQuery, [deliveryoptionid, productId, user], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: {
        pid: productId,
        user: user,
        deliveryoptionid: deliveryoptionid
      }
    });
  });
});

//deletes a cart item
app.post('/deleteCartItem', (req, res) => {
  const { id, user } = req.body;

  const deleteQuery = `DELETE from cart WHERE id = ? AND user_name = ?`;

  db.run(deleteQuery, [id, user], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: {
        user: user
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
