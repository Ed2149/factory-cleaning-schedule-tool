const BASE_URL = "https://factory-cleaning-schedule-tool.onrender.com";

// Toggle UI Sections
document.getElementById("showSignup").onclick = () => {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
};

document.getElementById("showLogin").onclick = () => {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
};

// LOGIN Handler
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
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
    console.error("Login error:", err);
    error.textContent = "Server error. Try again later.";
  }
});

// SIGNUP Handler
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const role = document.getElementById("signupRole").value;
  const error = document.getElementById("signupError");

  if (!name || !email || !password || !role) {
    error.textContent = "Please fill out all fields.";
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

    alert("Account created successfully!");
    document.getElementById("signupForm").reset();
    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
  } catch (err) {
    console.error("Signup error:", err);
    error.textContent = "Server error. Try again later.";
  }
});
