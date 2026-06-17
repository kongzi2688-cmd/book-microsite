/* ============================================
   PARTICLES — 우주 별 파티클 배경
============================================ */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animId;

  // 캔버스 크기 설정
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // 별 생성
  function createStar() {
    return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      radius:  Math.random() * 1.2 + 0.1,
      opacity: Math.random() * 0.8 + 0.1,
      speed:   Math.random() * 0.3 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      color:   pickColor(),
    };
  }

  function pickColor() {
    const palette = [
      'rgba(240,240,245,',   // Star White
      'rgba(74,158,255,',    // Signal Blue (희귀)
      'rgba(57,217,198,',    // Aurora Teal (희귀)
    ];
    const weights = [0.85, 0.09, 0.06];
    const r = Math.random();
    let cum = 0;
    for (let i = 0; i < weights.length; i++) {
      cum += weights[i];
      if (r < cum) return palette[i];
    }
    return palette[0];
  }

  // 별 초기화
  function initStars(count = 260) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(createStar());
    }
  }

  // 그리기
  function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      // 반짝임
      const twinkle = Math.sin(timestamp * s.twinkleSpeed + s.twinklePhase);
      const opacity = s.opacity * (0.6 + 0.4 * twinkle);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color + opacity + ')';
      ctx.fill();

      // 큰 별은 글로우
      if (s.radius > 1.0) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = s.color + (opacity * 0.15) + ')';
        ctx.fill();
      }

      // 매우 천천히 이동
      s.y += s.speed * 0.15;
      if (s.y > canvas.height + 2) {
        s.y = -2;
        s.x = Math.random() * canvas.width;
      }
    });

    animId = requestAnimationFrame(draw);
  }

  // 마우스 커서 별 효과
  let cursorStars = [];
  let cursorActive = false;

  document.addEventListener('mousemove', (e) => {
    // memory 섹션에서만 커서 별 효과
    const memorySection = document.getElementById('memory');
    if (!memorySection) return;

    const rect = memorySection.getBoundingClientRect();
    const inMemory = e.clientY >= rect.top && e.clientY <= rect.bottom;

    if (inMemory) {
      for (let i = 0; i < 2; i++) {
        cursorStars.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          radius: Math.random() * 2 + 0.5,
          opacity: 1,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.5 - 0.5,
          life: 1,
        });
      }
    }
  });

  function drawCursorStars() {
    cursorStars = cursorStars.filter(s => s.life > 0);
    cursorStars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74,158,255,${s.opacity * s.life})`;
      ctx.fill();

      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.04;
      s.vy -= 0.02;
    });
  }

  // 메인 루프 (별 + 커서 별 통합)
  function loop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 별
    stars.forEach(s => {
      const twinkle = Math.sin(timestamp * s.twinkleSpeed + s.twinklePhase);
      const opacity = s.opacity * (0.6 + 0.4 * twinkle);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color + opacity + ')';
      ctx.fill();

      if (s.radius > 1.0) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = s.color + (opacity * 0.12) + ')';
        ctx.fill();
      }

      s.y += s.speed * 0.12;
      if (s.y > canvas.height + 2) {
        s.y = -2;
        s.x = Math.random() * canvas.width;
      }
    });

    // 커서 별
    drawCursorStars();

    requestAnimationFrame(loop);
  }

  // 초기화
  resize();
  initStars();
  requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    resize();
    initStars();
  });

})();
