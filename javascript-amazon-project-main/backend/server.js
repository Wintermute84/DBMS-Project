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

// API route to get a product based on productId
app.get('/getproduct', (req, res) => {
  const {id} = req.query;
  db.get('SELECT * FROM products where id = ?', [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row
    });
  });
});

// API route to place users cart
app.post('/addToCart', (req, res) => {
  const { productId, user, qty, exp_delivery_date} = req.body;

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
      const insertQuery = `INSERT INTO cart (pid, user_name, qty, exp_delivery_date) VALUES (?, ?, ?, ?)`;
      
      db.run(insertQuery, [productId, user, qty, exp_delivery_date], function(err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        res.json({
          message: 'success',
          data: {
            productId: productId,
            user: user,
            qty: qty,
            exp_delivery_date: exp_delivery_date
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

  const query = `SELECT cart.id, cart.pid,products.name, products.price, cart.qty ,products.image,cart.deliveryoptionid,cart.exp_delivery_date
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
  const { productId, user, deliveryoptionid, exp_delivery_date } = req.body;

  const updateQuery = `UPDATE cart SET deliveryoptionid = ?, exp_delivery_date = ? WHERE id = ? AND user_name = ?`;

  db.run(updateQuery, [deliveryoptionid, exp_delivery_date, productId, user], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: {
        pid: productId,
        user: user,
        deliveryoptionid: deliveryoptionid,
        exp_delivery_date: exp_delivery_date
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

//update the quantity of a cart item
app.post('/updateCartQuantity', (req, res) => {
  const { id, user, quantity } = req.body;

  const updateQuery = `UPDATE cart set qty = ? WHERE id = ? AND user_name = ?`;

  db.run(updateQuery, [quantity, id, user], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: {
        user: user,
        quantity: quantity
      }
    });
  });
});


//Place your order
app.post('/placeOrder', (req, res) => {
  const { user, totalAmount, cartItems, order_date } = req.body;

  // Insert the order into the orders table
  const orderQuery = `
      INSERT INTO orders (user_name, total_amount, order_date)
      VALUES (?, ?, ?);
  `;

  db.run(orderQuery, [user, totalAmount, order_date], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      const orderId = this.lastID;

      // Insert each item into the order_items table
      const orderItemsQuery = `
          INSERT INTO order_items (oid, pid, qty, arrival_date)
          VALUES (?, ?, ?, ?);
      `;

      cartItems.forEach(item => {
          db.run(orderItemsQuery, [orderId, item.pid, item.qty, item.exp_delivery_date], (err) => {
              if (err) {
                  return res.status(500).json({ error: err.message });
              }
          });
      });

      res.json({ message: 'Order placed successfully!', orderId: orderId });
  });
});

//delete the cartItems after placing the order
app.post('/deleteCart', (req, res) => {
  const { user } = req.body;

  // Insert the order into the orders table
  const deleteQuery = `
      DELETE FROM cart where user_name=?;
  `;

  db.run(deleteQuery, [user], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Cart deleted successfully!', user: user });
  });
});


//Fetching order details
app.get('/fetchOrder', (req, res) => {
  const { user } = req.query; // Get user_name

  const query = `
      SELECT o.id, o.user_name, o.order_date, o.total_amount, 
             oi.pid, oi.qty, oi.arrival_date, oi.id AS order_item_id,
             p.name AS product_name, p.image AS product_image
      FROM orders o
      JOIN order_items oi ON o.id = oi.oid
      JOIN products p ON oi.pid = p.id
      WHERE o.user_name = ? order by o.id desc;
  `;

  db.all(query, [user], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (rows.length === 0) {
          return res.status(404).json({ message: 'Order not found' });
      }

      res.json({ message: 'success', data: rows });
  });
});



//api route to get products of a particular seller
app.get('/getSellerProducts', (req, res) => {
  const {sellerId} = req.query;
  db.all('SELECT * FROM products where seller = ?', [sellerId], (err, rows) => {
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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
