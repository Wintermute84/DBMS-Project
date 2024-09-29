import formatCurrency from "../data/utils/money.js";

async function loadSellerPage(){
  const sellerProducts = await fetchSellerProducts('midhun');
  const productHtml = renderSellerProductsGrid(sellerProducts);
  document.querySelector('.js-products-grid').innerHTML = productHtml;
}

function fetchSellerProducts(sellerName){ 
  const promise = fetch(`http://localhost:3000/getSellerProducts?sellerId=${sellerName}`)
      .then(response => response.json())
      .then(data => {
          if (data.message === 'success') {
              console.log(data);

              if (data.data.length === 0) {
                  console.log('You Have No Products');
                  const productGrid = document.querySelector('.js-products-grid');
                  productGrid.innerHTML='You currently sell no products !';
                  productGrid.classList.add('empty-product-list');
              } else {
                  return data.data;
              }
          } else {
              console.error('Error fetching your products:', data.message);
          }
      })
      .catch(error => console.error('Error fetching your productst:', error));
  return promise;
}

function renderSellerProductsGrid(products){
  let html = ``;
 
  products.forEach((product) =>{
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

              <div class="product-spacer"></div>

            </div>`;
  });
  
  return html;
}

loadSellerPage();


document.querySelector('.add-icon').addEventListener('click', ()=>{
      document.querySelector('.modal').classList.add('open');
      document.querySelector('.close-button').addEventListener('click',()=>{
        document.querySelector('.modal').classList.remove('open');
    });
});


document.getElementById('submit').addEventListener('submit', (event) =>{
  event.preventDefault(); // Prevent page from refreshing
  const productName = document.getElementById('productname').value;
  const price = parseInt(document.getElementById('price').value);
  const image = document.getElementById('image-link').value;
  const sellerName = 'midhun';    //need to load seller name from local storage
  addProduct(sellerName,productName,price,image);
  document.querySelector('.modal').classList.remove('open');
});

function addProduct(sellerName, productName, price ,image){
  fetch('http://localhost:3000/addProduct', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        sellerName: sellerName,
        price: price,
        image: image,
        productName:productName
    })
})
.then(response => response.json())
.then(data => {
    if (data.message === 'Order placed successfully!') {
        console.log(`Product Added!`);
    } else {
        console.log('Failed to add product');
    }
})
.catch(error => console.error('Error adding product:', error));
}
