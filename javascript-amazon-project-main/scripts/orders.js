import { calculateDate, OrderFormattedDate, calculateFormattedDate, FormattedDate, calculateStatus, calculateDaysBetween} from "../data/utils/date.js";
import formatCurrency from "../data/utils/money.js";
import { addToCart, calculateCartQuantity } from "../data/cart.js";

let orders = [];
async function FetchOrders(){
  const promise = await fetch('http://localhost:3000/fetchOrder?user=johndoe')
    .then(response => response.json())
    .then(data => {
        if (data.message === 'success') {
            //console.log('Order Details:', data.data);
            return  data.data;
        } else {
            console.log('Failed to fetch order');
        }
    })
    .catch(error => console.error('Error fetching order:', error));
  return promise;
}
async function loadOrdersPage() {
  orders = await FetchOrders();
  let orderHtml = ``;
  let firstOrder = orders[0];
  let orderId = orders[0].id;
  orderHtml += renderOrderHtml(firstOrder);
  orders.forEach((order)=>{
    const status = calculateStatus(order.arrival_date);
    const orderStatus = `${status} ${OrderFormattedDate(order.arrival_date)}`;
    console.log(order);
    if(order.id === orderId){
      orderHtml += `
        <div class="product-image-container">
              <img src="${order.product_image}">
            </div>
            <div class="product-details">
              <div class="product-name">
                ${order.product_name}
              </div>
              <div class="product-delivery-date">
               ${orderStatus}
              </div>
              <div class="product-quantity">
                Quantity: ${order.qty}
              </div>
              <button class="buy-again-button button-primary js-buy-again-button-${order.order_item_id}" data-product-id="${order.pid}" data-order-item-id="${order.order_item_id}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
                <button class="track-package-button button-secondary js-track-package-button" 
                data-arrival-date="${order.arrival_date}" data-order-placed-date="${order.order_date}" data-product-id="${order.pid}" data-order-status="${orderStatus}" data-qty="${order.qty}">
                  Track package
                </button>
              </a>
            </div>

            
      
      `;
    }
    else{
      orderId = order.id;
      orderHtml +=  `
      </div>
      </div>
      ${renderOrderHtml(order)}
      <div class="product-image-container">
              <img src="${order.product_image}">
            </div>
            <div class="product-details">
              <div class="product-name">
                ${order.product_name}
              </div>
              <div class="product-delivery-date">
               ${orderStatus}
              </div>
              <div class="product-quantity">
                Quantity: ${order.qty}
              </div>
              <button class="buy-again-button button-primary js-buy-again-button-${order.order_item_id}" data-product-id="${order.pid}" data-order-item-id="${order.order_item_id}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
                <button class="track-package-button button-secondary js-track-package-button" data-arrival-date="${order.arrival_date}" 
                data-product-id="${order.pid}" data-order-placed-date="${order.order_date}" data-order-status="${orderStatus}" data-qty="${order.qty}">
                  Track package
                </button>
              </a>
            </div>

      `;
    }
  }); 
  orderHtml += `
    </div>  
    </div>
  `;
  document.querySelector('.js-orders-grid').innerHTML = orderHtml;
  calculateCartQuantity('johndoe');//need to add username
  document.querySelectorAll('.buy-again-button').forEach((button) => {
    button.addEventListener('click',() => {
      const productId = parseInt(button.dataset.productId);
      addToCart(productId,1,calculateFormattedDate(1));
    });
    
  });

  document.querySelectorAll('.js-track-package-button').forEach((button) => {
    button.addEventListener('click',() => {
      const deliveryDate = button.dataset.arrivalDate;
      const productId = parseInt(button.dataset.productId);
      const qty = parseInt(button.dataset.qty);
      const status = button.dataset.orderStatus;
      const orderDate = button.dataset.orderPlacedDate;
      const width = calculateDaysBetween(deliveryDate,orderDate);
      console.log(width,productId,status,qty);
      window.location.href = `tracking.html?width=${width}&productId=${productId}&status=${status}&qty=${qty}`;
    });
    
  });
}

loadOrdersPage();


function renderOrderHtml(order){
  const orderHtml = `
      <div class="order-container"> 
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${OrderFormattedDate(order.order_date)}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.total_amount)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>
      <div class="order-details-grid">    
    `;
  return orderHtml;
}