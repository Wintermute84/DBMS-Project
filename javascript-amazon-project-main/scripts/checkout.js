import { fetchCart, renderCart, calculateCartQuantity, updateCartQuantityExistingProduct } from "../data/cart.js";
import {formatCurrency} from "../data/utils/money.js";
fetchCart('johndoe', formatCurrency);
//window.onload = updateCartQuantityExistingProduct(3,10);

