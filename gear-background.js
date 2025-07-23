const canvas = document.getElementById('gearCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const gears = Array.from({ length: 30 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 20 + 15,
  angle: Math.random() * 360,
  spin: (Math.random() - 0.5) * 0.2,
  opacity: Math.random() * 0.3 + 0.1
}));

function drawGear(gear) {
  ctx.save();
  ctx.translate(gear.x, gear.y);
  ctx.rotate(gear.angle * Math.PI / 180);
  ctx.beginPath();
  ctx.arc(0, 0, gear.r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(79, 209, 197, ${gear.opacity})`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gears.forEach(g => {
    drawGear(g);
    g.angle += g.spin;
  });
  requestAnimationFrame(animate);
}

animate();
