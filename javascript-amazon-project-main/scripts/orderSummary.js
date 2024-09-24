import { getDeliveryOption } from "../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function renderPaymentSummary(cart, formatCurrency){
  let productPriceCents = 0;
  let shippingCosts = 0;
  let quantity = 0;
  cart.forEach((cartItem) => {    
      productPriceCents += cartItem.price * cartItem.qty;
      const deliveryOption = getDeliveryOption(cartItem.deliveryoptionid);
      shippingCosts += deliveryOption.priceCents;
      quantity += cartItem.qty;
  });
      const totalBeforeTaxCents = productPriceCents + shippingCosts ;
      const taxCents = totalBeforeTaxCents*0.1;
      const totalCents = totalBeforeTaxCents + taxCents;
      const paymentSummaryHtml = `
              <div class="payment-summary-title">
                Order Summary
              </div>

              <div class="payment-summary-row">
                <div>Items (${quantity}):</div>
                <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
              </div>

              <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">$${formatCurrency(shippingCosts)}
                </div>
              </div>

              <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
              </div>

              <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${formatCurrency(taxCents)}
                </div>
              </div>

              <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
              </div>

              <button class="place-order-button button-primary
                js-place-order">
                Place your order
              </button>
      `;

  document.querySelector('.js-payment-summary')
  .innerHTML = paymentSummaryHtml;

  document.querySelector('.js-place-order').addEventListener('click',()=>{
    placeOrder('johndoe',totalCents,cart);
    console.log(new Date());
  });
}

function placeOrder(user,totalAmount,cart){
  fetch('http://localhost:3000/placeOrder', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user: user,
        totalAmount: totalAmount,
        cartItems: cart,
    })
})
.then(response => response.json())
.then(data => {
    if (data.message === 'Order placed successfully!') {
        console.log(`Order placed! Order ID: ${data.orderId}`);
        deleteCart(user);
    } else {
        console.log('Failed to place order');
    }
})
.catch(error => console.error('Error placing order:', error));
}

function deleteCart(user){
  fetch('http://localhost:3000/deleteCart', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user: user,
    })
})
.then(response => response.json())
.then(data => {
    if (data.message === 'Cart deleted successfully!') {
        console.log(`Cart deleted! Cart User: ${data.user}`);
    } else {
        console.log('Failed to delete cart');
    }
})
.catch(error => console.error('Error deleting cart:', error));
}

/*const dateString = '24-09-2024';

// Split the string to get day, month, and year
const [day, month] = dateString.split('-');

// Create a Date object (month is 0-indexed, so subtract 1)
const date = new Date( month - 1, day);

// Check if the date is valid
if (!isNaN(date.getTime())) {
    // Get options for formatting
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    
    // Format the date to "DayName daydate Month" (e.g., "Tuesday 24 September")
    const formattedDate = date.toLocaleDateString('en-US', options);
    console.log(formattedDate); // Output: "Tuesday, September 24, 2024"
} else {
    console.log('Invalid date format');
}*/