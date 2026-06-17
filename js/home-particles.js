(function () {
  const canvas = document.getElementById('home-particles-canvas');
  const homeSection = document.getElementById('home');
  if (!canvas || !homeSection) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let cursorStars = [];
  let animId;

  function resize() {
    canvas.width = homeSection.clientWidth;
    canvas.height = homeSection.clientHeight;
  }

  function initStars(count = 60) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.8 + 0.2, // Small and delicate
        opacity: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.05 + 0.01, // Very slow drift
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function getOpacityMultiplier(clientX, clientY) {
    const textElements = homeSection.querySelectorAll('.home-chapter, .home-title, .home-subtitle, .home-desc, .home-info, .home-copy');
    let minDistance = Infinity;

    for (let i = 0; i < textElements.length; i++) {
      const el = textElements[i];
      const rect = el.getBoundingClientRect();
      const dx = Math.max(rect.left - clientX, 0, clientX - rect.right);
      const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }

    const threshold = 60; // 60px 범위 내에서 서서히 투명도 및 크기 감소
    if (minDistance < threshold) {
      return 0.2 + 0.8 * (minDistance / threshold);
    }
    return 1.0;
  }

  function onMouseMove(e) {
    const rect = homeSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      if (Math.random() < 0.18) { // Sparse tracking trail points
        const multiplier = getOpacityMultiplier(e.clientX, e.clientY);
        cursorStars.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          radius: (Math.random() * 1.5 + 0.5) * (0.6 + 0.4 * multiplier),
          opacity: 0.95 * multiplier,
          life: 1.0,
          decay: (Math.random() * 0.008 + 0.007) / (0.5 + 0.5 * multiplier),
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2 - 0.05,
        });
      }
    }
  }

  homeSection.addEventListener('mousemove', onMouseMove);

  function onTouchMove(e) {
    if (e.touches && e.touches[0]) {
      const rect = homeSection.getBoundingClientRect();
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        if (Math.random() < 0.18) {
          const multiplier = getOpacityMultiplier(clientX, clientY);
          cursorStars.push({
            x,
            y,
            radius: (Math.random() * 1.5 + 0.5) * (0.6 + 0.4 * multiplier),
            opacity: 0.95 * multiplier,
            life: 1.0,
            decay: (Math.random() * 0.008 + 0.007) / (0.5 + 0.5 * multiplier),
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2 - 0.05,
          });
        }
      }
    }
  }
  homeSection.addEventListener('touchmove', onTouchMove, { passive: true });

  function loop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw background stars
    stars.forEach(s => {
      const twinkle = Math.sin(timestamp * s.twinkleSpeed + s.twinklePhase);
      const opacity = s.opacity * (0.6 + 0.4 * twinkle);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, Math.max(0, opacity))})`;
      ctx.fill();

      s.y -= s.speed;
      if (s.y < -5) {
        s.y = canvas.height + 5;
        s.x = Math.random() * canvas.width;
      }
    });

    // 2. Draw mouse tracking trail points
    cursorStars.forEach((s, idx) => {
      s.life -= s.decay;
      if (s.life <= 0) {
        cursorStars.splice(idx, 1);
        return;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * s.life})`;
      ctx.fill();

      s.x += s.vx;
      s.y += s.vy;
    });

    animId = requestAnimationFrame(loop);
  }

  resize();
  initStars();
  animId = requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    resize();
    initStars();
  });
})();
