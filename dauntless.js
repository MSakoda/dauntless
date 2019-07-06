console.log(`running dauntless.js`);

/* ELEMENTS */
let username = document.querySelector(`#username`);
let logoutLink = document.querySelector(`#logout`);
let loginForm = document.querySelector(`#loginForm`);
var users;
var isLoggedIn = false;

/* Variabltes */
const orbTypes = ['blaze','frost','terra','shock','neutral','dull','shining','peerless'];

initialize = function() {

  if (localStorage.users == undefined) {
    localStorage.users = JSON.stringify([]);
  }

  login();

  if (isLoggedIn) {
    updateDomOrbs();
    loggedInContainer.classList.remove('d-none');
  }
}

login = function(showMessage) {

  let loggedInUser = JSON.parse(localStorage.users).find(u => u.isLoggedIn);

  if (!loggedInUser) {
    logoutLink.classList.add('d-none');
    loginCard.classList.remove('d-none');
    return;
  }

  isLoggedIn = true;

  username.innerText = `${loggedInUser.username}`;
  logoutLink.classList.remove('d-none');
  document.querySelector(`input[name='username']`).value = '';
  loginCard.classList.add('d-none');
  if (showMessage) {
      onMessage(`Successfully logged in as ${loggedInUser.username}`,'success');
  }

  // Show logged in stuff
  loggedInContainer.classList.remove('d-none');
  updateDomOrbs();
}

logout = function() {
  username.innerText = '';
  let loggedInUser = getLoggedInUser();
  loggedInUser.isLoggedIn = false;
  isLoggedIn = false;
  console.log(`loggedInUser:`,loggedInUser);
  updateUsers(loggedInUser);
  logoutLink.classList.add('d-none');
  loginCard.classList.remove('d-none');
  onMessage(`Successfully logged out ${loggedInUser.username}`,'success');

  // Hide logged in stuff
  loggedInContainer.classList.add('d-none');
}

getLoggedInUser = function() {
  return JSON.parse(localStorage.users).find(u => u.isLoggedIn);
}

updateUsers = function(user) {
  let users = JSON.parse(localStorage.users);
  let userIdx = users.findIndex(u => u.username == user.username);
  users[userIdx] = user;
  localStorage.users = JSON.stringify(users);
}


onLogin = function(){

  // get username input
  let usernameInput = document.querySelector(`input[name='username']`);

  // get value
  let val = usernameInput.value;

  // check if empty
  if (val.trim() == "") {
    console.log(`username is empty`);
    return;
  }

  // parse users from localStorage
  let users = JSON.parse(localStorage.users);
  console.log(`users:`,users);

  // look for existing user
  let user = users.find(u => u.username.toLowerCase() == val.toLowerCase());

  console.log(`user:`,user);

  // create if it doesn't exist
  if (!user) {
    user = createUser(val);
    users.forEach(u => u.isLoggedIn = false);
    users.push(user);
  }

  console.log("user:",user)

  // log the user in
  user.isLoggedIn = true;

  // save the users in localStorage
  localStorage.users = JSON.stringify(users);

  login(true);
}

onLogout = function() {
    logout();
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

updateOrbAmt = function(type, val) {
    console.log(`running updateOrbAmt with type: ${type} and val: ${val}`);
    // get user
    let user = getLoggedInUser();

    // get orb type
    let orb = user.orbs.find(o => o.name == type);
    console.log(`orb:`,orb);

    // set orb amt to orb.amt + val
    orb.amt += val;
    if (orb.amt < 0) orb.amt = 0;
    console.log(`user after updating orb?:`,user);
    updateUsers(user);
    updateDomOrb(type);
}

updateDomOrb = function(type){
    console.log(`running updateDomOrb with type:`,type);
    let user = getLoggedInUser();
    document.querySelector(`#${type}_orb_amt`).innerText = user.orbs.find(orb => orb.name == type).amt;
}

updateDomOrbs = function(){
    let user = getLoggedInUser();
    user.orbs.forEach(orb => {
        document.querySelector(`#${orb.name}_orb_amt`).innerText = orb.amt;
    });
}

/* EVENTS */

loginForm.addEventListener('submit',function(e) {
  console.log(`submit event:`,e);
  e.preventDefault();
  onLogin();
});

document.querySelectorAll(`.orb .fa-plus`).forEach(function(plus) {
  plus.parentElement.addEventListener('click',function() {
    console.log(`clicked a plus:`,this);
    let id = this.previousElementSibling.getAttribute('id')
    let type = id.split("_")[0];
    updateOrbAmt(type,1)
    });
});

document.querySelectorAll(`.orb .fa-minus`).forEach(function(minus) {
  minus.parentElement.addEventListener('click',function() {
    console.log(`clicked a minus:`,this);
    let id = this.previousElementSibling.previousElementSibling.getAttribute('id')
    let type = id.split("_")[0];
    console.log(`type: ${type}`);
    updateOrbAmt(type,-1);
    });
});


// create a new user
createUser = function(username) {
  let user = {
    username: username,
    orbs: orbTypes.map(ot => {
      return {
        name:ot,
        amt: 0
      }
    }),
    isLoggedIn: false
  };
  console.log(`created user ${username}:`,user);
  return user;
}


initialize();
