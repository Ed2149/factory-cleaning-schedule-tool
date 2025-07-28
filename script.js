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
      credentials: 'include' // Optional: for future cookie/session use
    });

    const data = await response.json();

    if (response.ok && data.redirect) {
      // ✅ Redirect to backend-specified dashboard
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
