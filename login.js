document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (email === 'manager@gearops.com' && password === 'admin123') {
    window.location.href = 'manager-dashboard.html';
  } else if (email === 'employee@gearops.com' && password === 'clean123') {
    window.location.href = 'employee-dashboard.html';
  } else {
    document.getElementById('loginError').textContent = 'Invalid credentials.';
  }
});

