// === GearOps Backend URL ===
const BASE_URL = "https://factory-cleaning-schedule-tool.onrender.com";

// === LOGIN LOGIC ===
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Login failed: ${err.detail}`);
      return;
    }

    const data = await res.json();
    localStorage.setItem("userEmail", email); // Store session
    window.location.href = data.redirect;
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed due to a server issue.");
  }
});

// === SIGNUP LOGIC ===
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const role = document.getElementById("signupRole").value;

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, email, password, role }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Signup failed: ${err.detail}`);
      return;
    }

    alert("Account created successfully!");
    document.getElementById("signupForm").reset();
    document.getElementById("signupSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed due to a server issue.");
  }
});
