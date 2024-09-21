import { fetchCart, renderCart } from "../data/cart.js";
import {formatCurrency} from "../data/utils/money.js";

fetchCart('johndoe', formatCurrency);