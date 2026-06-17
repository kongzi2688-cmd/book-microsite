/* ============================================
   NAVIGATION — Smooth Scroll + ScrollSpy
============================================ */

(function () {
  'use strict';

  const sections   = document.querySelectorAll('.section');
  const gnbItems   = document.querySelectorAll('.gnb-item');
  const dots       = document.querySelectorAll('.section-dot');
  const header     = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileItems = document.querySelectorAll('.mobile-menu .gnb-item');

  // ── Smooth Scroll 이동 ──
  function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // 모바일 메뉴 닫기
    closeMobileMenu();
  }

  // GNB 클릭
  gnbItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.section;
      if (targetId) scrollToSection(targetId);
    });
  });

  // 모바일 메뉴 클릭
  mobileItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.section;
      if (targetId) scrollToSection(targetId);
    });
  });

  // 사이드 닷 클릭
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.dataset.section;
      if (targetId) scrollToSection(targetId);
    });
  });

  // 책 제목 클릭 → 홈으로
  const bookTitle = document.querySelector('.site-book-title');
  if (bookTitle) {
    bookTitle.addEventListener('click', () => scrollToSection('home'));
  }

  // ── 햄버거 메뉴 ──
  function openMobileMenu() {
    hamburger?.classList.add('open');
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // ── ScrollSpy + 헤더 효과 ──
  const observerOptions = {
    root: null,
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '72px'} 0px -40% 0px`,
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        updateActive(id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  function updateActive(id) {
    // GNB 활성화
    gnbItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === id);
    });
    mobileItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === id);
    });
    // 사이드 닷 활성화
    dots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.section === id);
    });
  }

  // ── 스크롤 이벤트 ──
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docH    = document.documentElement.scrollHeight - window.innerHeight;

    // 헤더 스크롤 효과
    if (header) {
      header.classList.toggle('scrolled', scrollY > 30);
    }

    // 진행 바
    if (progressBar) {
      const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
  }, { passive: true });

  // ── 스크롤 등장 효과 (IntersectionObserver) ──
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // 한 번만
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Memory 섹션 진입 감지 (커서 별 효과) ──
  const memorySection = document.getElementById('memory');
  if (memorySection) {
    const memoryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        document.body.classList.toggle('in-memory', entry.isIntersecting);
      });
    }, { threshold: 0.3 });
    memoryObserver.observe(memorySection);
  }

})();
