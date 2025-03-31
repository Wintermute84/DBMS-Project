document.querySelector('.js-create-new-seller-button').addEventListener('click',async(event)=>{
  event.preventDefault();
  const sellerName = document.querySelector('.js-new-seller-name').value
  const pass1 = document.querySelector('.js-new-seller-password').value;
  const pass2 = document.querySelector('.js-confirm-seller-password').value;
  if(pass1 != pass2){
    alert('Passwords do not match');
  }
  else{
    addSeller(sellerName,pass1);
  }
});

function addSeller(sellerName,password){
  fetch('http://localhost:3000/addSeller', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        sellerName: sellerName,
        password: password,
    })
})
.then(response => response.json())
.then(data => {
    if (data.message === 'Seller added successfully!') {
        console.log(`Seller Added!`);
        localStorage.setItem('sellerName',sellerName)
        window.location.href = '../sellerpage.html'; 
    } else {
        alert('Failed to add seller');
    }
})
.catch(error => console.error('Error creating account:', error));
}