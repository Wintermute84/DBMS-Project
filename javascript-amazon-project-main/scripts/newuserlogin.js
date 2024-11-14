

document.querySelector('.js-create-new-user-button').addEventListener('click',async(event)=>{
  event.preventDefault();
  const userName = document.querySelector('.js-new-user-name').value
  const pass1 = document.querySelector('.js-new-user-password').value;
  const pass2 = document.querySelector('.js-confirm-user-password').value;
  if(pass1 != pass2){
    alert('Passwords do not match');
  }
  else{
    addUser(userName,pass1);
  }
});




function addUser(userName,password){
  fetch('https://dbms-project-gilt-zeta.vercel.app/addUser', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userName: userName,
        password: password,
    })
})
.then(response => response.json())
.then(data => {
    if (data.message === 'User added successfully!') {
        console.log(`User Added!`);
        localStorage.setItem('userName',userName)
        window.location.href = 'amazon.html'; 
    } else {
        alert('Failed to add user');
    }
})
.catch(error => console.error('Error creating account:', error));
}