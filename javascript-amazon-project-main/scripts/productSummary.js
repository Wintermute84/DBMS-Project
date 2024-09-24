 // Function to fetch products from the backend API
 import { renderProductsGrid } from "../data/products.js";
 import { formatCurrency } from "../data/utils/money.js";
 import { addToCart, calculateCartQuantity } from "../data/cart.js";
import { Product } from "../data/products.js";
import { calculateDate } from "../data/utils/date.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export let products =[];

 export function fetchProducts() {
    const promise = fetch('http://localhost:3000/products') // Make a request to the backend
      .then(response => response.json())  // Parse the response as JSON
      .then(data => {
          products = data.data.map((productDetails) => {
            return new Product(productDetails);
          });
          //renderProductsGrid(product, formatCurrency, addToCart); 
      })
      .catch(error => {
          console.error('Error fetching products:', error);
      });

      return promise;
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


async function loadPage() {
    try{
        await fetchProducts();
        console.log(products);
        renderProductsGrid(products, formatCurrency, addToCart); 
        calculateCartQuantity('johndoe');
    } catch(error){
        console.log(error);
    }
}

loadPage();

