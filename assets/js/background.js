// Background animation module
const BackgroundAnimation = {
  canvas: null,
  ctx: null,
  particles: [],
  particleCount: 25,
  colors: [
      '#8C003D', // deep magenta
      '#A37A98', // muted pink
      '#6495ED', // cornflower blue
      '#9932CC', // dark orchid
      '#E3A8D7', // soft pink
      '#FF69B4', // hot pink
      '#7B68EE', // medium slate blue
      '#DA70D6', // orchid
      '#BA55D3', // medium orchid
      '#9370DB', // purple
      '#FFB6C1', // light pink
      '#6A5ACD', // slate blue
      '#C71585'  // medium violet red
  ],

  init() {
    this.canvas = document.getElementById('background-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
  },

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createParticles() {
    this.particles = []; // fresh array
    let attempts = 0; // safeguard against infinite loops

    while (this.particles.length < this.particleCount && attempts < this.particleCount * 10) {
      const radius = Math.random() * 50 + 20;
      const x = Math.random() * (this.canvas.width - radius * 2) + radius;
      const y = Math.random() * (this.canvas.height - radius * 2) + radius;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];

      const newParticle = new Particle(x, y, radius, color);

      // Check overlap with existing particles of the same color
      const overlapping = this.particles.some(p => p.color === color && getDistance(p, newParticle) < p.radius + newParticle.radius);

      if (!overlapping) {
        this.particles.push(newParticle);
      }

      attempts++;
    }
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => p.update(this.ctx, this.canvas));
    requestAnimationFrame(() => this.animate());
  }
};

// Particle class
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vx = (Math.random() - 0.3) *0.3;
    this.vy = (Math.random() - 0.3) * 0.3;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(ctx, canvas) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.vx *= -1;
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.vy *= -1;

    this.draw(ctx);
  }
}

// Helper function to calculate distance between two particles
function getDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Initialize animation
window.addEventListener('DOMContentLoaded', () => BackgroundAnimation.init());
