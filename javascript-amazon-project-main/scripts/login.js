const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



document.querySelector('.js-user-login-button').addEventListener('click', async (event)=>{
    event.preventDefault();
    const userName = document.querySelector('.js-user-name').value;
    const password = document.querySelector('.js-user-password').value;
    console.log(userName);
    let promise = await fetch(`https://dbms-project-gilt-zeta.vercel.app/api/userlogin?userName=${userName}&password=${password}`)
      .then(response => response.json())
      .then(data => {
          if (data.message === 'success') {
              console.log(data);
              localStorage.setItem('userName',userName);
              window.location.href = 'amazon.html'; 
          } else {
            alert('Invalid Username/Password');
          }
        return data;
      })
      .catch(error => console.error('Error fetching cart:', error));
    console.log(promise);
    });

    document.querySelector('.js-seller-login-button').addEventListener('click', async (event)=>{
        event.preventDefault();
        const sellerName = document.querySelector('.js-seller-name').value;
        const password = document.querySelector('.js-seller-password').value;
        console.log(sellerName);
        let promise = await fetch(`https://dbms-project-gilt-zeta.vercel.app/api/sellerLogin?sellerName=${sellerName}&password=${password}`)
          .then(response => response.json())
          .then(data => {
              if (data.message === 'success') {
                  console.log(data);
                  localStorage.setItem('sellerName',sellerName);
                  window.location.href = 'sellerpage.html'; 
              } else {
                alert('Invalid Username/Password');
              }
            return data;
          })
          .catch(error => console.error('Error fetching cart:', error));
        console.log(promise);    
        });
    


