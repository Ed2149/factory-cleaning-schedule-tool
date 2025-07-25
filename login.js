const BASE_URL = "https://factory-cleaning-schedule-tool.onrender.com";

document.getElementById("showSignup").onclick = () => {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.remove("hidden");
};

document.getElementById("showLogin").onclick = () => {
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
};

// LOGIN
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("emailLogin").value.trim();
  const password = document.getElementById("passwordLogin").value.trim();
  const error = document.getElementById("loginError");

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      error.textContent = data.detail || "Login failed.";
      return;
    }

    localStorage.setItem("userEmail", email);
    window.location.href = data.redirect;
  } catch (err) {
    error.textContent = "Server error. Try again.";
    console.error(err);
  }
});

// SIGNUP (Fix: matched form IDs and field names)
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("nameSignup").value.trim();
  const email = document.getElementById("emailSignup").value.trim();
  const password = document.getElementById("passwordSignup").value.trim();
  const role = document.getElementById("roleSignup").value;
  const error = document.getElementById("signupError");

  if (!name || !email || !password || !role) {
    error.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      error.textContent = data.detail || "Signup failed.";
      return;
    }

    alert("Account created. You can log in.");
    document.getElementById("signup-form").reset();
    document.getElementById("signup-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
  } catch (err) {
    error.textContent = "Server error. Try again.";
    console.error(err);
  }
});
