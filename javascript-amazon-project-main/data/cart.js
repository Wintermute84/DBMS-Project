export function addToCart(productId) {
  const user = 'johndoe'; // Replace with dynamic user data if needed
  const qty = 1; // Default quantity for now
  console.log(typeof productId);
  fetch('http://localhost:3000/cart', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          productId: productId,
          user: user,
          qty: qty
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.message === 'success') {
          alert('Product added to cart!');
      } else {
          alert('Failed to add product to cart');
      }
  })
  .catch(error => console.error('Error adding product to cart:', error));
}