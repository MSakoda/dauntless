console.log(`running dauntless.js`);

/* ELEMENTS */
let username = document.querySelector(`#username`);
let logoutLink = document.querySelector(`#logout`);
let loginForm = document.querySelector(`#loginForm`);

initialize = function() {

  // Check for logged in user
  if (localStorage.username) {
    login();
  } else {
    loginCard.classList.remove('d-none');
  }

}

login = function() {
  username.innerText = `${localStorage.username}`;
  logoutLink.classList.remove('d-none');
  document.querySelector(`input[name='username']`).value = '';
  loginCard.classList.add('d-none');
  onMessage(`Successfully logged in as ${localStorage.username}`,'success');
}

logout = function() {
  username.innerText = '';
  let un = localStorage.username;
  delete localStorage.username;
  logoutLink.classList.add('d-none');
  loginCard.classList.remove('d-none');
  onMessage(`Successfully logged out ${un}`,'success');
}


onLogin = function(){
  console.log(`clicked login`);
  let usernameInput = document.querySelector(`input[name='username']`);
  let val = usernameInput.value;
  if (val.trim() == "") {
    console.log(`username is empty`);
  }
  // log the user in
  else {
    localStorage.username = val;
    login();
  }
  return false;
}

onLogout = function() {
  if (localStorage.username) {
    logout();
  }
}

onMessage = function(message,type) {

  let msgContainer = type == "success" ? successMessage : errorMessage;

  console.log(`running onMessage with message: ${message} and type: ${type} and container:`, msgContainer);
  msgContainer.innerText = message;
  msgContainer.style.visibility = 'visible';
  msgContainer.style.opacity = 100;
  msgContainer.style.display = 'block';

  setTimeout(function() {
    msgContainer.innerText = '';
    msgContainer.style.visibility = 'hidden';
    msgContainer.style.opacity = 0;
    setTimeout(function() {
      msgContainer.style.display = 'none';
    },300)
  },5000)
}

/* EVENTS */

loginForm.addEventListener('submit',function(e) {
  console.log(`submit event:`,e);
  e.preventDefault();
  onLogin();
});


initialize();
