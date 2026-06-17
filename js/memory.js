/* ============================================
   MEMORY — 명장면 슬라이드 제어
============================================ */

(function () {
  'use strict';

  const slides    = document.querySelectorAll('.memory-slide');
  const dots      = document.querySelectorAll('.memory-dot');
  const prevBtn   = document.querySelector('.memory-nav.prev');
  const nextBtn   = document.querySelector('.memory-nav.next');

  if (!slides.length) return;

  let current  = 0;
  let autoTimer = null;
  const AUTO_INTERVAL = 6000;

  function goTo(index) {
    // 경계 처리
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');

    current = index;

    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // 버튼
  nextBtn?.addEventListener('click', () => { stopAuto(); next(); });
  prevBtn?.addEventListener('click', () => { stopAuto(); prev(); });

  // 닷
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); });
  });

  // 키보드
  document.addEventListener('keydown', (e) => {
    const memSection = document.getElementById('memory');
    if (!memSection) return;

    const rect = memSection.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible) return;

    if (e.key === 'ArrowRight') { stopAuto(); next(); }
    if (e.key === 'ArrowLeft')  { stopAuto(); prev(); }
  });

  // 터치 스와이프
  let touchStartX = 0;
  const slider = document.querySelector('.memory-slider');
  slider?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slider?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      diff > 0 ? next() : prev();
    }
  }, { passive: true });

  // 자동 재생
  function startAuto() {
    autoTimer = setInterval(next, AUTO_INTERVAL);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  // 초기화
  goTo(0);
  startAuto();

})();
