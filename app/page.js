'use client'

import { useEffect } from 'react'

export default function Home() {
  // ─── Particles (별 배경) ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = document.getElementById('particles-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []
    let mouseX = -9999, mouseY = -9999

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function createStars(count = 200) {
      stars = []
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          alpha: Math.random(),
          delta: (Math.random() * 0.01 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
          speed: Math.random() * 0.08 + 0.01,
        })
      }
    }
    createStars()

    const trail = []
    function onMove(e) {
      const x = e.clientX ?? (e.touches && e.touches[0].clientX)
      const y = e.clientY ?? (e.touches && e.touches[0].clientY)
      mouseX = x; mouseY = y
      if (Math.random() < 0.35) trail.push({ x, y, r: Math.random() * 2 + 1, alpha: 0.8, decay: Math.random() * 0.04 + 0.02 })
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.alpha += s.delta
        if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1
        s.y -= s.speed
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, Math.max(0, s.alpha))})`
        ctx.fill()
      })
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i]
        t.alpha -= t.decay
        if (t.alpha <= 0) { trail.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,220,255,${t.alpha})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  }, [])

  // ─── Home Particles (Home 섹션 전용 별 배경 & 마우스 트랙) ───────────────
  useEffect(() => {
    const canvas = document.getElementById('home-particles-canvas')
    const homeSection = document.getElementById('home')
    if (!canvas || !homeSection) return
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []
    let cursorStars = []

    function resize() {
      canvas.width = homeSection.clientWidth
      canvas.height = homeSection.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function initStars(count = 60) {
      stars = []
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 0.8 + 0.2,
          opacity: Math.random() * 0.7 + 0.1,
          speed: Math.random() * 0.05 + 0.01,
          twinkleSpeed: Math.random() * 0.015 + 0.003,
          twinklePhase: Math.random() * Math.PI * 2,
        })
      }
    }
    initStars()

    function getOpacityMultiplier(clientX, clientY) {
      const textElements = homeSection.querySelectorAll('.home-chapter, .home-title, .home-subtitle, .home-desc, .home-info, .home-copy')
      let minDistance = Infinity

      for (let i = 0; i < textElements.length; i++) {
        const el = textElements[i]
        const rect = el.getBoundingClientRect()
        const dx = Math.max(rect.left - clientX, 0, clientX - rect.right)
        const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < minDistance) {
          minDistance = dist
        }
      }

      const threshold = 60 // 60px 범위 내에서 서서히 투명도 및 크기 감소
      if (minDistance < threshold) {
        return 0.2 + 0.8 * (minDistance / threshold)
      }
      return 1.0
    }

    function onMouseMove(e) {
      const rect = homeSection.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        if (Math.random() < 0.18) {
          const multiplier = getOpacityMultiplier(e.clientX, e.clientY)
          cursorStars.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            radius: (Math.random() * 1.5 + 0.5) * (0.6 + 0.4 * multiplier),
            opacity: 0.95 * multiplier,
            life: 1.0,
            decay: (Math.random() * 0.008 + 0.007) / (0.5 + 0.5 * multiplier),
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2 - 0.05,
          })
        }
      }
    }

    homeSection.addEventListener('mousemove', onMouseMove)

    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        const rect = homeSection.getBoundingClientRect()
        const clientX = e.touches[0].clientX
        const clientY = e.touches[0].clientY
        const x = clientX - rect.left
        const y = clientY - rect.top
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          if (Math.random() < 0.18) {
            const multiplier = getOpacityMultiplier(clientX, clientY)
            cursorStars.push({
              x,
              y,
              radius: (Math.random() * 1.5 + 0.5) * (0.6 + 0.4 * multiplier),
              opacity: 0.95 * multiplier,
              life: 1.0,
              decay: (Math.random() * 0.008 + 0.007) / (0.5 + 0.5 * multiplier),
              vx: (Math.random() - 0.5) * 0.2,
              vy: (Math.random() - 0.5) * 0.2 - 0.05,
            })
          }
        }
      }
    }
    homeSection.addEventListener('touchmove', onTouchMove, { passive: true })

    function loop(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(s => {
        const twinkle = Math.sin(timestamp * s.twinkleSpeed + s.twinklePhase)
        const opacity = s.opacity * (0.6 + 0.4 * twinkle)

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, Math.max(0, opacity))})`
        ctx.fill()

        s.y -= s.speed
        if (s.y < -5) {
          s.y = canvas.height + 5
          s.x = Math.random() * canvas.width
        }
      })

      cursorStars.forEach((s, idx) => {
        s.life -= s.decay
        if (s.life <= 0) {
          cursorStars.splice(idx, 1)
          return
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * s.life})`
        ctx.fill()

        s.x += s.vx
        s.y += s.vy
      })

      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      homeSection.removeEventListener('mousemove', onMouseMove)
      homeSection.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  // ─── Navigation & ScrollSpy ────────────────────────────────────────────
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const gnbItems = document.querySelectorAll('.gnb-item')
    const dots = document.querySelectorAll('.section-dot')
    const progressBar = document.getElementById('scroll-progress')
    const header = document.getElementById('site-header')
    const hamburger = document.querySelector('.hamburger')
    const mobileMenu = document.querySelector('.mobile-menu')

    function scrollToSection(id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    gnbItems.forEach(btn => {
      btn.addEventListener('click', () => {
        scrollToSection(btn.dataset.section)
        if (mobileMenu) { mobileMenu.classList.remove('open'); hamburger.setAttribute('aria-expanded','false') }
      })
    })
    dots.forEach(dot => dot.addEventListener('click', () => scrollToSection(dot.dataset.section)))

    const bookTitle = document.querySelector('.site-book-title')
    if (bookTitle) bookTitle.addEventListener('click', () => scrollToSection('home'))

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open')
        hamburger.setAttribute('aria-expanded', String(open))
      })
    }

    function setActive(id) {
      gnbItems.forEach(b => b.classList.toggle('active', b.dataset.section === id))
      dots.forEach(d => d.classList.toggle('active', d.dataset.section === id))
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
    }, { threshold: 0.35 })
    sections.forEach(s => observer.observe(s))

    function onScroll() {
      const scrolled = window.scrollY
      const total = document.body.scrollHeight - window.innerHeight
      if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%'
      if (header) header.classList.toggle('scrolled', scrolled > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  // ─── Reveal on scroll ─────────────────────────────────────────────────
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.15 })
    revealEls.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // ─── Story tabs ────────────────────────────────────────────────────────
  useEffect(() => {
    const items = document.querySelectorAll('.story-index-item')
    const details = document.querySelectorAll('.story-detail')

    function showStory(id) {
      items.forEach(i => i.classList.toggle('active', i.dataset.story === id))
      details.forEach(d => d.classList.toggle('active', d.id === id))
    }
    if (items.length) showStory(items[0].dataset.story)
    items.forEach(item => item.addEventListener('click', () => showStory(item.dataset.story)))
  }, [])

  // ─── Memory Slider ─────────────────────────────────────────────────────
  useEffect(() => {
    const slides = document.querySelectorAll('.memory-slide')
    const dotsEl = document.querySelectorAll('.memory-dot')
    const prevBtn = document.querySelector('.memory-nav.prev')
    const nextBtn = document.querySelector('.memory-nav.next')
    if (!slides.length) return

    let current = 0
    let autoTimer

    function goTo(n) {
      slides[current].classList.remove('active')
      dotsEl[current]?.classList.remove('active')
      current = (n + slides.length) % slides.length
      slides[current].classList.add('active')
      dotsEl[current]?.classList.add('active')
    }
    goTo(0)

    function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000) }
    function stopAuto() { clearInterval(autoTimer) }
    startAuto()

    prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto() })
    nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto() })
    dotsEl.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto() }))

    // Keyboard
    function onKey(e) {
      if (e.key === 'ArrowLeft') { stopAuto(); goTo(current - 1); startAuto() }
      if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto() }
    }
    window.addEventListener('keydown', onKey)

    // Touch swipe
    let startX = 0
    const slider = document.querySelector('.memory-slider')
    slider?.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
    slider?.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 40) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto() }
    })

    return () => {
      stopAuto()
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  // ─── Work Modal ────────────────────────────────────────────────────────
  useEffect(() => {
    const card = document.getElementById('work-card-1')
    const cardBtn = document.querySelector('.work-card-btn')
    const overlay = document.querySelector('.work-modal-overlay')
    const closeBtn = document.querySelector('.work-modal-close')

    function open() { overlay?.classList.add('open'); document.body.style.overflow = 'hidden' }
    function close() { overlay?.classList.remove('open'); document.body.style.overflow = '' }

    card?.addEventListener('click', open)
    cardBtn?.addEventListener('click', e => { e.stopPropagation(); open() })
    closeBtn?.addEventListener('click', close)
    overlay?.addEventListener('click', e => { if (e.target === overlay) close() })
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close() })
  }, [])

  // ─── Purchase tabs ─────────────────────────────────────────────────────
  useEffect(() => {
    const tabs = document.querySelectorAll('.purchase-tab')
    const groups = document.querySelectorAll('.store-group')

    function switchTab(tab) {
      tabs.forEach(t => t.classList.toggle('active', t === tab))
      groups.forEach(g => { g.style.display = g.dataset.group === tab.dataset.tab ? 'flex' : 'none' })
    }
    if (tabs.length) switchTab(tabs[0])
    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab)))
  }, [])

  return (
    <>
      {/* 파티클 캔버스 */}
      <canvas id="particles-canvas" aria-hidden="true"></canvas>

      {/* 스크롤 진행 바 */}
      <div id="scroll-progress" aria-hidden="true"></div>

      {/* HEADER */}
      <header id="site-header" role="banner">
        <span className="site-book-title" role="link" tabIndex={0} aria-label="홈으로 이동">
          우리가 빛의 속도로 갈 수 없다면
        </span>
        <nav className="gnb" role="navigation" aria-label="주 메뉴">
          <button className="gnb-item" data-section="home" aria-label="홈">Home</button>
          <button className="gnb-item" data-section="author" aria-label="작가 소개">Author</button>
          <button className="gnb-item" data-section="story" aria-label="단편 소개">Story</button>
          <button className="gnb-item" data-section="memory" aria-label="명장면 체험">Memory</button>
          <button className="gnb-item" data-section="purchase" aria-label="구매">Purchase</button>
          <button className="gnb-item" data-section="work" aria-label="나의 작업물">Work</button>
        </nav>
        <button className="hamburger" aria-label="메뉴 열기" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </header>

      {/* 모바일 메뉴 */}
      <nav className="mobile-menu" role="navigation" aria-label="모바일 메뉴">
        <button className="gnb-item" data-section="home">Home</button>
        <button className="gnb-item" data-section="author">Author</button>
        <button className="gnb-item" data-section="story">Story</button>
        <button className="gnb-item" data-section="memory">Memory</button>
        <button className="gnb-item" data-section="purchase">Purchase</button>
        <button className="gnb-item" data-section="work">Work</button>
      </nav>

      {/* 섹션 도트 */}
      <div className="section-dots" role="navigation" aria-label="섹션 이동">
        <button className="section-dot" data-section="home" title="Home"></button>
        <button className="section-dot" data-section="author" title="Author"></button>
        <button className="section-dot" data-section="story" title="Story"></button>
        <button className="section-dot" data-section="memory" title="Memory"></button>
        <button className="section-dot" data-section="purchase" title="Purchase"></button>
        <button className="section-dot" data-section="work" title="Work"></button>
      </div>

      <main>
        {/* ─── 1. HOME ─── */}
        <section id="home" className="section" aria-label="메인 홈">
          <canvas id="home-particles-canvas" className="home-particles" aria-hidden="true"></canvas>
          <div className="home-content">
            <p className="home-chapter">Kim Cho-yeop · 2019 · SF Short Fiction</p>
            <h1 className="home-title">우리가 빛의 속도로 갈 수 없다면</h1>
            <p className="home-desc">세계적 찬사를 받는 작가, 김초엽의 대표작</p>
            <p className="home-info">작가 - 김초엽 &nbsp;&nbsp;&nbsp;&nbsp; 출판사 - 허블</p>
            <p className="home-copy">
              그리움은 빛보다 느리고, 기다림은 우주보다 넓다.
            </p>
          </div>
          <div className="home-scroll-hint" aria-hidden="true">
            <span>Scroll</span>
            <div className="scroll-arrow"></div>
          </div>
        </section>

        {/* ─── 2. AUTHOR ─── */}
        <section id="author" className="section" aria-label="작가 소개">
          <div className="section-inner">
            <p className="section-label reveal">Author</p>
            <hr className="section-divider reveal" />
            <div className="author-grid">
              <div className="author-photo-wrap reveal-left">
                <img src="/assets/images/author-photo.png" className="author-photo" alt="김초엽 작가" />
              </div>
              <div className="author-info reveal-right">
                <div>
                  <h2 className="author-name-kr">김초엽</h2>
                  <p className="author-name-en">Kim Cho-yeop</p>
                </div>
                <div className="author-meta">
                  <div className="author-meta-item">
                    <span className="meta-label">데뷔</span>
                    <span className="meta-value">2017년</span>
                  </div>
                  <div className="author-meta-item">
                    <span className="meta-label">장르</span>
                    <span className="meta-value">SF · 과학소설</span>
                  </div>
                  <div className="author-meta-item">
                    <span className="meta-label">전공</span>
                    <span className="meta-value">생화학 · 화학공학</span>
                  </div>
                </div>
                <ul className="author-bio-list">
                  <li>1993년 울산 출생</li>
                  <li>포항공과대학교(POSTECH)에서 화학을 전공하고 생화학 석사 학위를 취득</li>
                  <li>2017년 「관내분실」과 「우리가 빛의 속도로 갈 수 없다면」으로<br />
                    제2회 한국과학문학상 대상·가작을 동시에 수상하며 등단
                  </li>
                  <li>한국 SF 문학의 대중화를 이끈 작가로 평가받음</li>
                </ul>
              </div>
            </div>
            <div className="author-introduction-section reveal">
              <p className="author-introduction-title">Introduction</p>
              <div className="author-introduction-text">
                <p>김초엽은 과학적 상상력과 인간에 대한 깊은 통찰을 바탕으로 작품을 집필하는 한국의 SF 소설가이다. 포항공과대학교(POSTECH)에서 화학을 전공하고 생화학 석사 과정을 마쳤으며, 연구자의 경험을 바탕으로 과학적 사실과 문학적 상상력을 자연스럽게 결합한 작품 세계를 구축해 왔다. 2017년 「관내분실」과 「우리가 빛의 속도로 갈 수 없다면」으로 제2회 한국과학문학상에서 각각 가작과 대상을 수상하며 등단했고, 이후 한국 SF 문학을 대표하는 작가 중 한 명으로 자리매김했다.</p>
                <p>김초엽의 작품은 우주, 인공지능, 생명공학, 외계 생명체 등 미래 과학기술을 배경으로 하지만, 기술의 발전 자체보다 그 속에서 살아가는 인간의 감정과 관계에 주목한다. 그는 과학기술이 인간의 삶을 어떻게 변화시키는지 탐구하는 동시에, 상실과 그리움, 공감과 연대, 차이를 이해하려는 태도와 같이 시대를 초월하는 인간의 감정을 섬세하게 그려낸다. 특히 사회적 약자나 소외된 존재의 시선에서 세상을 바라보며, 서로 다른 존재가 함께 살아갈 수 있는 가능성을 작품 전반에 담아낸다.</p>
                <p>김초엽은 SF를 미래를 예측하는 장르라기보다 현재의 인간과 사회를 비추는 문학으로 바라본다. 그의 소설 속 미래는 화려한 기술보다 사람과 사람 사이의 거리, 이해와 오해, 기억과 상실 같은 감정이 중심이 된다. 이러한 작품 세계는 독자들에게 기술이 아무리 발전하더라도 인간을 인간답게 만드는 것은 결국 타인을 이해하고 공감하려는 마음이라는 메시지를 전한다.</p>
                <p>대표작으로는 『우리가 빛의 속도로 갈 수 없다면』, 『지구 끝의 온실』, 『방금 떠나온 세계』, 『므레모사』 등이 있으며, 과학적 상상력과 따뜻한 인간애를 결합한 독창적인 서사로 한국 SF 문학의 새로운 흐름을 이끌고 있다는 평가를 받고 있다.</p>
              </div>
            </div>
            <div className="author-quote-section reveal">
              <p className="author-quote-title">Interview</p>
              <blockquote className="author-quote">
                &quot;광활한 우주에서 나라는 존재를 깨닫게 될 때 인식이 깨어난다. 찰나의 시간에 자신이 있다는 걸 느낀다.&quot;
                <p className="quote-kr">— 김초엽 인터뷰 발췌</p>
              </blockquote>
            </div>
            <div className="author-books-section reveal">
              <p className="author-books-title">Other Works</p>
              <div className="author-books-grid">
                <div className="book-card" role="link" tabIndex={0} aria-label="파견자들">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">파견자들</p>
                  <p className="book-card-year">2015</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="관내분실">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">관내분실</p>
                  <p className="book-card-year">2018</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="토막난 우주를 안고서">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">토막난 우주를 안고서</p>
                  <p className="book-card-year">2019</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="방금 떠나온 세계">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">방금 떠나온 세계</p>
                  <p className="book-card-year">2020</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="해파리 만개">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">해파리 만개</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="양면의 조개껍데기">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">양면의 조개껍데기</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="지구 끝의 온실">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">지구 끝의 온실</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="행성어 서점">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">행성어 서점</p>
                  <p className="book-card-year">2022</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="므레모사">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">므레모사</p>
                  <p className="book-card-year">2023</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="아무튼, SF게임">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">아무튼, SF게임</p>
                  <p className="book-card-year">2024</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="책과 우연들">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">책과 우연들</p>
                  <p className="book-card-year">2025</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="파견자들">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">파견자들</p>
                  <p className="book-card-year">2015</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="관내분실">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">관내분실</p>
                  <p className="book-card-year">2018</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="토막난 우주를 안고서">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">토막난 우주를 안고서</p>
                  <p className="book-card-year">2019</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="방금 떠나온 세계">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">방금 떠나온 세계</p>
                  <p className="book-card-year">2020</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="해파리 만개">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">해파리 만개</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="양면의 조개껍데기">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">양면의 조개껍데기</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="지구 끝의 온실">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">지구 끝의 온실</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="행성어 서점">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">행성어 서점</p>
                  <p className="book-card-year">2022</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="므레모사">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">므레모사</p>
                  <p className="book-card-year">2023</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="아무튼, SF게임">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">아무튼, SF게임</p>
                  <p className="book-card-year">2024</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="책과 우연들">
                  <div className="author-photo-placeholder book-card-cover" style={{ aspectRatio:'3/4', height:'auto', fontSize:'0.6rem' }}>표지</div>
                  <p className="book-card-title">책과 우연들</p>
                  <p className="book-card-year">2025</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. STORY ─── */}
        <section id="story" className="section" aria-label="단편 소개">
          <div className="section-inner">
            <p className="section-label reveal">Story</p>
            <h2 className="story-title reveal">일곱 편의 이야기</h2>
            <hr className="section-divider reveal" />
            <div className="story-layout">
              <nav className="story-index" aria-label="단편 목록" role="tablist">
                {[
                  ['story-01','순례자들은 왜 돌아오지 않는가'],
                  ['story-02','우리가 빛의 속도로 갈 수 없다면'],
                  ['story-03','관내분실'],
                  ['story-04','스펙트럼'],
                  ['story-05','공생가설'],
                  ['story-06','감정의 물성'],
                  ['story-07','원통 안에서'],
                ].map(([id, title], i) => (
                  <div className="story-index-item" data-story={id} role="tab" aria-selected="false" key={id}>
                    <span className="story-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="story-index-title">{title}</span>
                  </div>
                ))}
              </nav>
              <div className="story-panel" aria-live="polite">
                {[
                  { id:'story-01', num:'01 / 07', title:'순례자들은 왜 돌아오지 않는가', tags:['종교','이주','믿음','외계 행성'], synopsis:'외계 행성으로 순례를 떠난 사람들이 돌아오지 않는 이유를 추적하는 이야기. 종교적 신앙과 인간의 욕망, 그리고 다른 세계에 대한 갈망이 교차합니다.', quote:'"그들은 더 나은 세계를 찾아 떠났다. 하지만 더 나은 세계란 결국 자신이 만들어가는 것인지도 몰랐다."' },
                  { id:'story-02', num:'02 / 07', title:'우리가 빛의 속도로 갈 수 없다면', tags:['그리움','기다림','우주 이주','시간의 흐름'], synopsis:'슬라우지 항성계로의 이주를 기다리는 노인 이야기. 빛의 속도보다 느린 세상에서, 수십 년을 기다려도 닿을 수 없는 그리움. 우주의 물리 법칙 앞에 선 인간의 감정이 가장 선명하게 드러나는 표제작입니다.', quote:'"우리가 빛의 속도로 갈 수 없다면, 우리는 영원히 만날 수 없는 걸까."' },
                  { id:'story-03', num:'03 / 07', title:'관내분실', tags:['도서관','기억','죽음','존재'], synopsis:'죽은 사람들의 기억이 보관된 도서관. 사서는 그 기억들 사이에서 분실된 한 사람을 찾습니다. 존재의 흔적과 망각의 경계를 탐구합니다.', quote:'"사라진다는 것은 기억되지 않는다는 뜻이 아니다. 기억조차 분실될 수 있다는 것이다."' },
                  { id:'story-04', num:'04 / 07', title:'스펙트럼', tags:['색채 감각','소통','외계인','차이'], synopsis:'색을 다르게 보는 외계 존재와의 첫 접촉. 같은 빛을 다르게 인식하는 존재들이 어떻게 서로를 이해할 수 있을지를 다루는 소통의 이야기입니다.', quote:'"같은 하늘을 보아도 우리는 서로 다른 색을 본다. 그래도 우리는 같은 하늘 아래 있다."' },
                  { id:'story-05', num:'05 / 07', title:'공생가설', tags:['공생','진화','연결','과학'], synopsis:'인간과 미지의 생명체가 공생 관계를 형성하는 세계. 함께 살아간다는 것의 의미와, 다름을 받아들이는 것의 아름다움을 탐구합니다.', quote:'"우리는 혼자서 완전하지 않기 때문에 서로를 필요로 한다."' },
                  { id:'story-06', num:'06 / 07', title:'감정의 물성', tags:['감정','물질','과학기술','슬픔'], synopsis:'감정이 물리적 물질로 존재하는 세계. 슬픔을 담은 병, 기쁨의 결정체. 감정의 본질과 우리가 감정을 어떻게 다루는지를 독특한 방식으로 이야기합니다.', quote:'"슬픔은 무겁다. 진짜로, 손으로 들 수 있을 만큼."' },
                  { id:'story-07', num:'07 / 07', title:'원통 안에서', tags:['밀폐','고독','탐험','내면'], synopsis:'원통형 우주선 안에 갇힌 탐험가. 외부 세계와 단절된 공간에서 자신의 내면과 마주하는 고요하고 깊은 이야기입니다.', quote:'"이 원통 안에서 나는 드디어 나 자신을 만났다."' },
                ].map(s => (
                  <article id={s.id} className="story-detail" role="tabpanel" key={s.id}>
                    <div className="story-mood-placeholder" aria-label={`단편 배경 이미지 — ${s.title}`}>IMAGE: {s.id}.jpg</div>
                    <p className="story-detail-num">{s.num}</p>
                    <h3 className="story-detail-title">{s.title}</h3>
                    <div className="story-tags">
                      {s.tags.map(t => <span className="story-tag" key={t}>{t}</span>)}
                    </div>
                    <p className="story-synopsis">{s.synopsis}</p>
                    <blockquote className="story-highlight">{s.quote}</blockquote>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. MEMORY ─── */}
        <section id="memory" className="section" aria-label="명장면 체험">
          <div className="memory-header">
            <p className="memory-section-label">Memory — 명장면</p>
          </div>
          <div className="memory-slider" role="region" aria-label="명장면 슬라이드">
            {[
              { bg:'memory/memory-01.jpg', bgColor:'#1a0a2a', label:'「우리가 빛의 속도로 갈 수 없다면」', quote:'"그녀는 삼십 년을 기다렸다.\n우주 정거장의 창밖으로 별들이 지나갔고,\n시간은 빛보다 느리게 흘렀다."', src:'— 우리가 빛의 속도로 갈 수 없다면 중에서' },
              { bg:'memory/memory-02.jpg', bgColor:'#0a1a2a', label:'「관내분실」', quote:'"도서관 어딘가에 그의 기억이 있다.\n분실된 채로, 누군가가 찾아주기를 기다리며."', src:'— 관내분실 중에서' },
              { bg:'memory/memory-03.jpg', bgColor:'#0a2a1a', label:'「스펙트럼」', quote:'"우리는 서로 다른 빛을 보았지만,\n같은 것을 사랑한다는 걸 알았을 때,\n비로소 우리는 연결되었다."', src:'— 스펙트럼 중에서' },
              { bg:'memory/memory-04.jpg', bgColor:'#1a1a0a', label:'「감정의 물성」', quote:'"슬픔은 언제나 이렇게 무겁고,\n기쁨은 언제나 이렇게 쉽게 흩어지는 것인가."', src:'— 감정의 물성 중에서' },
            ].map((slide, i) => (
              <div className="memory-slide" role="group" aria-label={`명장면 ${i + 1}`} key={i}>
                <div className="memory-slide-bg" style={{ backgroundImage:`url('/assets/images/${slide.bg}')`, backgroundColor:slide.bgColor }} aria-hidden="true"></div>
                <div className="memory-slide-content">
                  <p className="memory-story-label">{slide.label}</p>
                  <blockquote className="memory-quote">
                    {slide.quote.split('\n').map((line, j) => (
                      <span key={j}>{line}{j < slide.quote.split('\n').length - 1 && <br />}</span>
                    ))}
                  </blockquote>
                  <p className="memory-quote-source">{slide.src}</p>
                </div>
              </div>
            ))}
            <button className="memory-nav prev" aria-label="이전 명장면">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="memory-nav next" aria-label="다음 명장면">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="memory-dots" role="tablist" aria-label="슬라이드 선택">
              {[1,2,3,4].map(n => (
                <button className="memory-dot" role="tab" aria-label={`명장면 ${n}`} key={n}></button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5. PURCHASE ─── */}
        <section id="purchase" className="section" aria-label="책 구매">
          <div className="section-inner">
            <p className="section-label reveal">Purchase</p>
            <hr className="section-divider reveal" />
            <div className="purchase-inner">
              <div className="purchase-book-wrap reveal">
                <div className="purchase-book-placeholder" aria-label="책 표지 이미지 영역">
                  📖<br /><span style={{ fontSize:'0.7rem', color:'var(--color-text-dim)', marginTop:'0.5rem', display:'block' }}>book-cover.jpg</span>
                </div>
              </div>
              <p className="purchase-copy reveal">
                지금, 빛의 속도로<br />당신에게 닿기를.
              </p>
              <div className="purchase-tabs reveal" role="tablist" aria-label="도서 형식 선택">
                <button className="purchase-tab" data-tab="paper" role="tab">종이책</button>
                <button className="purchase-tab" data-tab="ebook" role="tab">전자책</button>
              </div>
              <div className="purchase-stores store-group" data-group="paper">
                <a className="store-btn" href="https://www.kyobobook.co.kr" target="_blank" rel="noopener noreferrer" aria-label="교보문고에서 구매"><span className="store-icon">📚</span> 교보문고</a>
                <a className="store-btn" href="https://www.yes24.com" target="_blank" rel="noopener noreferrer" aria-label="예스24에서 구매"><span className="store-icon">📚</span> 예스24</a>
                <a className="store-btn" href="https://www.aladin.co.kr" target="_blank" rel="noopener noreferrer" aria-label="알라딘에서 구매"><span className="store-icon">📚</span> 알라딘</a>
              </div>
              <div className="purchase-stores store-group" data-group="ebook" style={{ display:'none' }}>
                <a className="store-btn" href="https://ridibooks.com" target="_blank" rel="noopener noreferrer" aria-label="리디북스에서 구매"><span className="store-icon">📱</span> 리디북스</a>
                <a className="store-btn" href="https://www.millie.co.kr" target="_blank" rel="noopener noreferrer" aria-label="밀리의 서재에서 구매"><span className="store-icon">📱</span> 밀리의 서재</a>
                <a className="store-btn" href="https://series.naver.com" target="_blank" rel="noopener noreferrer" aria-label="네이버 시리즈에서 구매"><span className="store-icon">📱</span> 네이버 시리즈</a>
              </div>
              <div className="purchase-info reveal">
                <span>초판 2019.06.24</span>
                <span>허블 출판사</span>
                <span>ISBN 979-11-965817-2-3</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. WORK ─── */}
        <section id="work" className="section" aria-label="나의 작업물">
          <div className="section-inner">
            <p className="section-label reveal">Work</p>
            <hr className="section-divider reveal" />
            <div className="work-inner">
              <p className="work-tagline reveal">이 작품에 영감을 받아 만든 것들</p>
              <div className="work-card reveal" id="work-card-1" role="button" tabIndex={0} aria-label="작업물 상세 보기">
                <div className="work-card-image-wrap">
                  <div className="work-card-placeholder" aria-label="작업물 이미지 영역">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
                    </svg>
                    <span>work-01.jpg</span>
                  </div>
                  <div className="work-card-overlay"><span>View Work</span></div>
                </div>
                <div className="work-card-info">
                  <h3 className="work-card-title">작업물 제목을 입력하세요</h3>
                  <p className="work-card-desc">
                    작업물에 대한 간단한 설명을 이곳에 입력합니다.
                    어떤 작업이었는지, 무엇을 담고 싶었는지 자유롭게 써주세요.
                  </p>
                  <button className="work-card-btn" aria-label="작업물 자세히 보기">
                    View Detail
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="site-footer">
        <p className="footer-text">
          © 2024 · 『우리가 빛의 속도로 갈 수 없다면』 · 김초엽 · 팬 제작 비공식 사이트
        </p>
      </footer>

      {/* WORK 모달 */}
      <div className="work-modal-overlay" role="dialog" aria-modal="true" aria-label="작업물 상세">
        <div className="work-modal">
          <button className="work-modal-close" aria-label="모달 닫기">✕ Close</button>
          <div style={{ width:'100%', height:'300px', background:'var(--color-bg-card)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--color-text-dim)', fontFamily:'var(--font-mono)', fontSize:'0.7rem', letterSpacing:'0.1em' }}>
            work-01.jpg (상세 이미지)
          </div>
          <div className="work-modal-body">
            <h2 className="work-modal-title">작업물 제목</h2>
            <p className="work-modal-desc">
              작업물에 대한 상세 설명을 이곳에 입력합니다.
              사용한 도구, 작업 과정, 담고 싶었던 이야기 등을 자유롭게 서술해 주세요.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
