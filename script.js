// 🌙 Dark Mode Setup
const toggle = document.getElementById('dark-mode-toggle');
const body = document.body;

if (localStorage.getItem('darkMode') === 'enabled') {
  body.classList.add('dark-mode');
}

toggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
});

// 🧾 Form Switching
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const goToSignup = document.getElementById('go-to-signup');
const goToLogin = document.getElementById('go-to-login');

goToSignup.addEventListener('click', () => {
  loginContainer.classList.add('hidden');
  signupContainer.classList.remove('hidden');
});

goToLogin.addEventListener('click', () => {
  signupContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
});

// 🚪 Login Logic
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('#loginEmail').value;
  const password = loginForm.querySelector('#loginPassword').value;

  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  try {
    const response = await fetch('https://factory-cleaning-schedule-tool.onrender.com/login', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok && data.redirect) {
      window.location.href = data.redirect;
    } else {
      loginError.textContent = data.detail || 'Login failed.';
      loginError.style.display = 'block';
    }
  } catch (error) {
    console.error('Login Error:', error);
    loginError.textContent = 'Something went wrong.';
    loginError.style.display = 'block';
  }
});

// 📝 Signup Logic
const signupForm = document.getElementById('signup-form');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = signupForm.querySelector('#signupName').value;
  const email = signupForm.querySelector('#signupEmail').value;
  const password = signupForm.querySelector('#signupPassword').value;
  const role = signupForm.querySelector('#signupRole').value;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('role', role);

  try {
    const response = await fetch('https://factory-cleaning-schedule-tool.onrender.com/signup', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      signupSuccess.textContent = 'Account created! You can now login.';
      signupSuccess.style.display = 'block';
      signupError.style.display = 'none';
      signupForm.reset();
    } else {
      signupError.textContent = data.detail || 'Signup failed.';
      signupError.style.display = 'block';
      signupSuccess.style.display = 'none';
    }
  } catch (error) {
    console.error('Signup Error:', error);
    signupError.textContent = 'Something went wrong.';
    signupError.style.display = 'block';
    signupSuccess.style.display = 'none';
  }
});
