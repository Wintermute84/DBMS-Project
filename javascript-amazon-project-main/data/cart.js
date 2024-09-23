import { deliveryOptions, getDeliveryOption } from "./deliveryOptions.js";
import { calculateDate} from "./utils/date.js";
import { loadCheckoutPage } from "../scripts/checkout.js";

export function addToCart(productId, quantity) {
  const user = 'johndoe'; // need to use getItem
  fetch('http://localhost:3000/addToCart', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          productId: productId,
          user: user,
          qty: quantity
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.message === 'success') {
          console.log('Product added to cart!');
      } else {
          console.log('Failed to add product to cart');
      }
  })
  .catch(error => console.error('Error adding product to cart:', error));
}



export function renderCart(CartItems, formatCurrency) {
    let html = ``;
    CartItems.forEach((item)=>{
      const deliveryOptionId = item.deliveryoptionid;
      const deliveryOption = getDeliveryOption(deliveryOptionId);
      console.log(deliveryOption);
      const dateString = calculateDate(deliveryOption);
      console.log(item);
        html +=`
        <div class="cart-item-container">
            <div class="delivery-date">
              Delivery date: ${dateString}
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
                    Quantity: <span class="quantity-label js-quantity-label-${item.id}">${item.qty}</span>
                  </span>
                  <span class="update-quantity-link link-primary
                  js-update-link" data-product-id="${item.id}">
                    Update
                  </span>
                  <input name="save-quantity-input" class="quantity-input js-save-quantity-input-${item.id}">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${item.id}">Save</span>
                  <span class="delete-quantity-link link-primary
                  js-delete-link" data-product-id="${item.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(item)}
              </div>
            </div>
          </div>    
        `;
    });

    document.querySelector('.js-order-summary').innerHTML = html;

    function deliveryOptionsHTML(cartItem) {
      let html = '';
      deliveryOptions.forEach((deliveryOption)=>{
        const dateString = calculateDate(deliveryOption);
        const priceString = deliveryOption.priceCents === 0 ? 'FREE'
          : `$${formatCurrency(deliveryOption.priceCents)} - `;
        console.log(cartItem.deliveryoptionid);
      const isChecked = deliveryOption.id == cartItem.deliveryoptionid ? 'checked' : '';
      console.log(deliveryOption.id, cartItem.deliveryoptionid);
    
        html += 
        `
          <div class="delivery-option js-delivery-option"
          data-product-id="${cartItem.id}"
          data-delivery-option-id="${deliveryOption.id}">
            <input type="radio" ${isChecked}
              class="delivery-option-input"
              name="delivery-option-${cartItem.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
          `
      });
    return html;
    }


    document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        const productId = parseInt(element.getAttribute('data-product-id'));
        const deliveryOptionId = parseInt(element.getAttribute('data-delivery-option-id'));        
        updateCartDeliveryOption(productId, deliveryOptionId);
      });
    });

    document.querySelectorAll('.js-delete-link')
  .forEach((link)=>{
      link.addEventListener('click',()=>{
        const cartId = link.dataset.productId;
        deleteCartItem(cartId);
        });
    });


    function deleteCartItem(cartId) { //need to add username
      const user = 'johndoe';
      fetch('http://localhost:3000/deleteCartItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: cartId,
          user: user,
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.message === 'success') {
          console.log('Item deleted successfully!');
        } else {
          console.log('Failed to delete item');
        }
      })
      .catch(error => console.error('Error deleting item:', error));
    }

    
    
    function updateCartDeliveryOption(productId, deliveryOptionId) {
      const user = 'johndoe';
      console.log(productId, deliveryOptionId);
      fetch('http://localhost:3000/updateDeliveryOption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productId,
          user: user,
          deliveryoptionid: deliveryOptionId
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.message === 'success') {
          console.log('Delivery option updated successfully!');
        } else {
          console.log('Failed to update delivery option');
        }
      })
      .catch(error => console.error('Error updating delivery option:', error));
    }
    
  
}

export function fetchCart(userName, formatCurrency) {
    const promise = fetch(`http://localhost:3000/cart?user=${userName}`)
        .then(response => response.json())
        .then(data => {
            if (data.message === 'success') {
                console.log(data);

                if (data.data.length === 0) {
                    console.log('Your cart is empty');
                } else {
                    return data.data;
                }
            } else {
                console.error('Error fetching cart:', data.message);
            }
        })
        .catch(error => console.error('Error fetching cart:', error));
    return promise;
}

export function calculateCartQuantity(userName){
    fetch(`http://localhost:3000/cartquantity?user=${userName}`)
      .then(response => response.json())
      .then(data => {
          if (data.message === 'success') {
              console.log(data);

              if (data.data.length === 0) {
                  console.log('Your cart is empty');
              } else {
                  console.log(data.data[0].cartQty);
                  let cartQuantity = data.data[0].cartQty||0;
                  document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity}`;
              }
          } else {
              console.error('Error fetching cart:', data.message);
          }
      })
      .catch(error => console.error('Error fetching cart:', error));
}

export function updateCartQuantityExistingProduct(productId, quantity){
  const user = 'johndoe'; // need to use getItem
  fetch('http://localhost:3000/cartupdatequantity', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          productId: productId,
          user: user,
          qty: quantity
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.message === 'success') {
          console.log('Product quantity updated!');
      } else {
          console.log('Failed to update product quantity');
      }
  })
  .catch(error => console.error('Error updating product quantity', error));
}

