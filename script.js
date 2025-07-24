// === GearOps Backend Base URL ===
const BASE_URL = "https://factory-cleaning-schedule-tool.onrender.com";

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const darkToggle = document.getElementById('darkToggle');

// === UI Section Switch ===
showSignup.onclick = () => {
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
};
showLogin.onclick = () => {
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
};

// === Dark Mode Toggle ===
darkToggle.onclick = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('gearDarkMode', document.body.classList.contains('dark-mode'));
};

window.onload = () => {
  if (localStorage.getItem('gearDarkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
};

// === LOGIN Handler ===
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value.trim();
  const password = document.getElementById('passwordLogin').value.trim();
  const error = document.getElementById('loginError');

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      error.textContent = err.detail || "Login failed.";
      return;
    }

    const data = await res.json();
    localStorage.setItem("userEmail", email); // save session
    window.location.href = data.redirect; // e.g. manager or employee dashboard
  } catch (errorObj) {
    console.error("Login failed:", errorObj);
    error.textContent = "Server error. Try again later.";
  }
});

// === SIGNUP Handler ===
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('nameSignup').value.trim();
  const email = document.getElementById('emailSignup').value.trim();
  const password = document.getElementById('passwordSignup').value.trim();
  const role = document.getElementById('roleSignup').value;
  const error = document.getElementById('signupError');

  if (!name || !email || !password || !role) {
    error.textContent = "Fill in all fields.";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, email, password, role }),
    });

    if (!res.ok) {
      const err = await res.json();
      error.textContent = err.detail || "Signup failed.";
      return;
    }

    alert("Account created! You can now log in.");
    signupForm.reset();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  } catch (errorObj) {
    console.error("Signup failed:", errorObj);
    error.textContent = "Server error. Try again later.";
  }
});
