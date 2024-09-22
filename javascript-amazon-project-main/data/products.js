import { calculateCartQuantity } from "./cart.js";

export function renderProductsGrid(products, formatCurrency, addToCart){
  console.log(products);
  let html = '';
  products.forEach((product)=>{
    html += `<div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>


            <div class="product-price">
              $${formatCurrency(product.price)}
            </div>

            <div class="seller-name">
              <p>Sold by : ${product.seller}</p>
            </div>

            <div class="product-quantity-container">
              <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            


            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${product.id}">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button  button-primary js-add-to-cart"
            data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>`;
  });
  document.querySelector('.js-products-grid').innerHTML = html;
  document.querySelectorAll('.js-add-to-cart')
    .forEach((button)=>{
      let addedMessageTimeoutId;
      button.addEventListener('click', () => {
        new Promise((resolve) => {
          const productId = parseInt(button.dataset.productId);
          const quantity = parseInt(document.querySelector(`.js-quantity-selector-${productId}`).value);
          console.log(quantity);
          console.log(typeof(productId));
          const addedBtn = document.querySelector(`.js-added-to-cart-${productId}`);
          addedBtn.classList.add('added-to-cart-visible');
          if(addedMessageTimeoutId){
          clearTimeout(addedMessageTimeoutId);
        }

        const messageTimeoutId = setTimeout(()=>{
          addedBtn.classList.remove('added-to-cart-visible');
        },800);

        addedMessageTimeoutId = messageTimeoutId; 
        const details = {
          productId : productId,
          quantity : quantity
        }
        setTimeout(()=>{
          resolve(details);
        },800);; 
        }).then((details)=>{
          let productId = details.productId;
          let quantity = details.quantity;
          console.log(productId,quantity);
          addToCart(productId,quantity);
        });
          
    });
  });

}


export class Product {
  id;
  image;
  name;
  price;
  seller;

  constructor(productDetails){
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.price = productDetails.price
    this.seller = productDetails.seller;
  }

}

export let products = [];
