export function addToCart(productId) {
  const user = 'johndoe'; // Replace with dynamic user data if needed
  const qty = 1; // Default quantity for now
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



export function renderCart(CartItems, formatCurrency) {
    let html = ``;
    CartItems.forEach((item)=>{
        html +=`
        <div class="cart-item-container">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${item.image}">

              <div class="cart-item-details">
                <div class="product-name">
                    ${item.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(item.price)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${item.qty}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-1">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-1">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-1">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>    
        `;
    });
    return html;
}

export function fetchCart(userName, formatCurrency) {
    fetch(`http://localhost:3000/cart?user=${userName}`)
        .then(response => response.json())
        .then(data => {
            if (data.message === 'success') {
                console.log(data);

                if (data.data.length === 0) {
                    cartList.innerHTML = '<p>Your cart is empty</p>';
                } else {
                    let cartHtml = renderCart(data.data, formatCurrency);
                    document.querySelector('.js-order-summary').innerHTML = cartHtml;
                    /*data.data.forEach(item => {
                        const cartItemDiv = document.createElement('div');
                        cartItemDiv.classList.add('cart-item');

                        cartItemDiv.innerHTML = `
                            <h2>${item.name}</h2>
                            <p>Price: $${item.price}</p>
                            <p>Quantity: ${item.qty}</p>
                        `;

                        cartList.appendChild(cartItemDiv);
                    });*/
                }
            } else {
                console.error('Error fetching cart:', data.message);
            }
        })
        .catch(error => console.error('Error fetching cart:', error));
}

// Call the function to fetch the cart when the page loads


