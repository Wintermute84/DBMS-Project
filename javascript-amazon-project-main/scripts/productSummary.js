 // Function to fetch products from the backend API
 import { renderProductsGrid } from "../data/products.js";
 import { formatCurrency } from "../data/utils/money.js";
 import { addToCart } from "../data/cart.js";

 let product = [];

 function fetchProducts() {
    fetch('http://localhost:3000/products') // Make a request to the backend
      .then(response => response.json())  // Parse the response as JSON
      .then(data => {
          product = data.data;
          renderProductsGrid(product, formatCurrency, addToCart); 
      })
      .catch(error => {
          console.error('Error fetching products:', error);
      });
}


function fetchCart(userName) {
  fetch(`http://localhost:3000/cart/${userName}`) // Make a request to the backend
      .then(response => response.json())  // Parse the response as JSON
      .then(data => {
          console.log(data); // Log the entire response to inspect it

          // Check if data.data exists
          if (data.data) {
              console.log(data);
          } else {
              console.error('Error: No data field in response');
          }
      })
      .catch(error => {
          console.error('Error fetching products:', error);
      });
}


  // Call the function to fetch products when the page loads
 window.onload = fetchProducts();
