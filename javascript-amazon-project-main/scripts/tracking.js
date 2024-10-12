import { calculateCartQuantity } from "../data/cart.js";
const userName = localStorage.getItem('userName');
async function renderTrackingPage(){
  calculateCartQuantity(userName);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const productId = urlParams.get('productId');
  const status = urlParams.get('status');
  const width = urlParams.get('width');
  const qty = urlParams.get('qty');

  const orderDetails = {
    id:productId,
    status:status,
    width:width,
    qty:qty
  };

  console.log(width,status,productId);
  let item = await fetchProduct(productId);
  console.log(item);
  const html = renderTrackingHtml(item, orderDetails);
  document.querySelector('.js-tracking-details-container').innerHTML = html;
  setTimeout(() => {
    document.querySelector('.progress-bar').style.width = `${width}%`;
    document.querySelector(`.${getStatus(width)}`).classList.add("current-status");
  }, 300);
  
}

renderTrackingPage();

export async function fetchProduct(pid) {
  const promise = await fetch(`http://localhost:3000/getproduct?id=${pid}`)
      .then(response => response.json())
      .then(data => {
          if (data.message === 'success') {
              console.log(data);
              return data.data;
        } else {
              console.error('Error fetching cart:', data.message);
          }
      })
      .catch(error => console.error('Error fetching cart:', error));
  return promise;
}


function renderTrackingHtml(orderItem, orderDetails){
  const trackingHtml = `
      <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          ${orderDetails.status}
        </div>

        <div class="product-info">
          ${orderItem.name}
        </div>

        <div class="product-info">
          Quantity: ${orderDetails.qty}
        </div>

        <img class="product-image" src="${orderItem.image}">

        <div class="progress-labels-container">
          <div class="progress-label Preparing">
            Preparing
          </div>
          <div class="progress-label Shipped">
            Shipped
          </div>
          <div class="progress-label Delivered">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
      </div>  
  `;
  return trackingHtml;
}


function getStatus(width){
  if(width<=49){
    return 'Preparing';
  }
  else if (width <=99){
    return 'Shipped';
  }
  else{
    return 'Delivered';
  }
}