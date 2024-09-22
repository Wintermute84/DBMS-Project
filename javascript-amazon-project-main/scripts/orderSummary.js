import { getDeliveryOption } from "../data/deliveryOptions.js";


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
  }