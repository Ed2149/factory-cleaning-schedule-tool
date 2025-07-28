const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const darkToggle = document.getElementById('darkToggle');

showSignup.onclick = () => {
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
};
showLogin.onclick = () => {
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
};

darkToggle.onclick = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('gearDarkMode', document.body.classList.contains('dark-mode'));
};

window.onload = () => {
  if (localStorage.getItem('gearDarkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
};

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value.trim();
  const password = document.getElementById('passwordLogin').value.trim();
  const error = document.getElementById('loginError');

  if (email === 'manager@gearops.com' && password === 'admin123') {
    window.location.href = 'manager-dashboard.html';
  } else if (email === 'employee@gearops.com' && password === 'clean123') {
    window.location.href = 'staff-dashboard.html';
  } else {
    error.textContent = 'Invalid login.';
  }
});


signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('nameSignup').value.trim();
  const email = document.getElementById('emailSignup').value.trim();
  const password = document.getElementById('passwordSignup').value.trim();
  const error = document.getElementById('signupError');

  if (name && email && password) {
    alert('Account created. You can now login.');
    signupForm.reset();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  } else {
    error.textContent = 'Fill in all fields.';
  }
});
