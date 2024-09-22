import { fetchCart, renderCart, calculateCartQuantity, updateCartQuantityExistingProduct } from "../data/cart.js";
import {formatCurrency} from "../data/utils/money.js";
import { renderPaymentSummary } from "./orderSummary.js";
//window.onload = updateCartQuantityExistingProduct(3,10);

async function loadPage() {
  try{
      const cart = await fetchCart('johndoe', formatCurrency);
      let cartHtml = renderCart(cart, formatCurrency);
      document.querySelector('.js-order-summary').innerHTML = cartHtml;
      renderPaymentSummary(cart,formatCurrency);
  } catch(error){
      console.log(error);
  }
}

loadPage();