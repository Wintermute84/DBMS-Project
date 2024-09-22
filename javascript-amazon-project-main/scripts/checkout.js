import { fetchCart, renderCart, calculateCartQuantity, updateCartQuantityExistingProduct } from "../data/cart.js";
import {formatCurrency} from "../data/utils/money.js";
import { renderPaymentSummary } from "./orderSummary.js";
//window.onload = updateCartQuantityExistingProduct(3,10);

export async function loadCheckoutPage() {
  try{
      const cart = await fetchCart('johndoe', formatCurrency);
      renderCart(cart, formatCurrency);
      renderPaymentSummary(cart,formatCurrency);
  } catch(error){
      console.log(error);
  }
}

loadCheckoutPage();

