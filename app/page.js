'use client'

import { useEffect } from 'react'

const BASE_PATH = '/book-microsite'

export default function Home() {
  // ─── 커스텀 마우스 커서 스크립트 로드 ────────────────────────────────────
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `${BASE_PATH}/js/cursor-effect.js`
    script.async = true
    document.body.appendChild(script)
    
    console.log('✓ Cursor script loaded')
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

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

  // ─── Memory Letter Form ──────────────────────────────────────────────
  useEffect(() => {
    const fromInput = document.getElementById('memory-from')
    const messageInput = document.getElementById('memory-message')
    const sendBtn = document.getElementById('memory-send-btn')
    const list = document.getElementById('memory-list')
    const successMsg = document.getElementById('memory-success-msg')
    let successTimeout

    function addLetter() {
      const from = fromInput?.value.trim()
      const message = messageInput?.value.trim()
      if (!from || !message) return

      const card = document.createElement('div')
      card.className = 'memory-card'
      card.innerHTML = `
        <div class="memory-card-from">From. ${from}</div>
        <div class="memory-card-message">${message}</div>
      `
      list?.insertBefore(card, list.firstChild)
      fromInput.value = ''
      messageInput.value = ''

      // 성공 메시지 표시
      if (successMsg) {
        successMsg.classList.add('show')
        clearTimeout(successTimeout)
        successTimeout = setTimeout(() => {
          successMsg.classList.remove('show')
        }, 2000)
      }
    }

    sendBtn?.addEventListener('click', addLetter)
    messageInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        addLetter()
      }
    })

    return () => clearTimeout(successTimeout)
  }, [])

  // ─── Work Modal ────────────────────────────────────────────────────────
  useEffect(() => {
    // 첫 번째 모달 (Type Flyer)
    const card1 = document.getElementById('work-card-1')
    const overlay1 = document.querySelector('.work-modal-overlay-1')
    const closeBtn1 = overlay1?.querySelector('.work-modal-close')

    function open1() { overlay1?.classList.add('open'); document.body.style.overflow = 'hidden' }
    function close1() { overlay1?.classList.remove('open'); document.body.style.overflow = '' }

    card1?.addEventListener('click', open1)
    closeBtn1?.addEventListener('click', close1)
    overlay1?.addEventListener('click', e => { if (e.target === overlay1) close1() })

    // 두 번째 모달 (Motion)
    const card2 = document.getElementById('work-card-2')
    const overlay2 = document.querySelector('.work-modal-overlay-2')
    const closeBtn2 = overlay2?.querySelector('.work-modal-close')

    function open2() { overlay2?.classList.add('open'); document.body.style.overflow = 'hidden' }
    function close2() { overlay2?.classList.remove('open'); document.body.style.overflow = '' }

    card2?.addEventListener('click', open2)
    closeBtn2?.addEventListener('click', close2)
    overlay2?.addEventListener('click', e => { if (e.target === overlay2) close2() })

    // ESC 키로 모든 모달 닫기
    function handleEscape(e) {
      if (e.key === 'Escape') {
        close1()
        close2()
      }
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
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
      {/* 커스텀 마우스 커서 컨테이너 */}
      <div id="cursor-container" aria-hidden="true"></div>

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

        {/* ─── 1.5 BOOK INTRO ─── */}
        <section id="book-intro" className="section" aria-label="책과 사이트 소개">
          <div className="section-inner">
            <div className="intro-container">
              <div className="intro-image reveal-left">
                <img src={`${BASE_PATH}/assets/images/책표지.jpeg`} alt="우리가 빛의 속도로 갈 수 없다면 책 표지" className="intro-book-image" />
              </div>
              <div className="intro-divider"></div>

              <div className="intro-column intro-left reveal-left">
                <p className="intro-text">
                  '우리가 빛의 속도로 갈 수 없다면'은 닿을 수 없는 이를 그리워하며 살아가는 지속적인 사랑을 다루는 책이다. 이 책은 "우리가 빛의 속도조차 갈 수 없는데 같은 우주가 무슨 의미가 있을까?"라는 질문에서 출발하여, 그리움과 사랑이 결국 빛의 속도를 뛰어넘는다는 메시지를 전한다. 특히 작품 속 '그리움, 고립감, 사랑'이라는 감정을 중심으로, 독자가 이에 깊이 공감하고 핵심 질문에 대해 생각해보도록 유도한다.
                </p>
                <p className="intro-text">
                  이 마이크로사이트는 사용자가 책의 핵심 메시지인 '지속되는 사랑과 그리움'을 다채로운 인터랙션으로 경험하도록 설계한다. 이를 위해 사이트를 각기 다른 주제를 가진 4개의 공간으로 나누고, 전체적으로 우주의 분위기를 살려 스크롤과 호버 방식을 중심으로 디자인한다. 마지막으로 배치된 버튼 클릭형 요소는 우주 정거장에 방명록을 남기는 행위를 표현한 것으로, 사용자가 이 일련의 과정을 통해 책 속의 그리움을 직접 체험하도록 만드는 것이 목표이다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. AUTHOR ─── */}
        <section id="author" className="section" aria-label="작가 소개">
          <div className="section-inner">
            <p className="section-label reveal">Author</p>
            <hr className="section-divider reveal" />
            <div className="author-grid">
              <div className="author-photo-wrap reveal-left">
                <img src={`${BASE_PATH}/assets/images/author-photo.png`} className="author-photo" alt="김초엽 작가" />
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
              <div className="interview-grid">
                <div className="interview-thumbnail" onClick={() => window.open('https://www.youtube.com/watch?v=wo_I5iMGfak', '_blank')} role="button" tabIndex={0} aria-label="유튜브 인터뷰 영상 재생">
                  <img src="https://img.youtube.com/vi/wo_I5iMGfak/maxresdefault.jpg" alt="김초엽 인터뷰 영상" />
                </div>
                <div className="interview-content">
                  <blockquote className="author-quote">
                    &quot;세계를 바꿔볼 수 있다는 거. 세계의 구조를 바꿔보면서,
                    세계 자체에 대한 새로운 관점을 얻을 수도 있다고 생각하거든요.&quot;
                    <p className="quote-kr">— [인터뷰] 김초엽 작가가 말하는 'SF의 매력' / KBS — </p>
                  </blockquote>
                </div>
              </div>
            </div>
            <div className="author-books-section reveal">
              <p className="author-books-title">Other Works</p>
              <div className="author-books-grid">
                <div className="book-card" role="link" tabIndex={0} aria-label="파견자들">
                  <img src={`${BASE_PATH}/assets/images/파견자들.jpeg`} alt="파견자들 책 표지" className="book-card-cover" />
                  <p className="book-card-title">파견자들</p>
                  <p className="book-card-year">2015</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="관내분실">
                  <img src={`${BASE_PATH}/assets/images/관내분실.jpeg`} alt="관내분실 책 표지" className="book-card-cover" />
                  <p className="book-card-title">관내분실</p>
                  <p className="book-card-year">2018</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="토막난 우주를 안고서">
                  <img src={`${BASE_PATH}/assets/images/토막 난 우주를 안고서.jpeg`} alt="토막난 우주를 안고서 책 표지" className="book-card-cover" />
                  <p className="book-card-title">토막난 우주를 안고서</p>
                  <p className="book-card-year">2019</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="방금 떠나온 세계">
                  <img src={`${BASE_PATH}/assets/images/방금 떠나온 세계.jpeg`} alt="방금 떠나온 세계 책 표지" className="book-card-cover" />
                  <p className="book-card-title">방금 떠나온 세계</p>
                  <p className="book-card-year">2020</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="해파리 만개">
                  <img src={`${BASE_PATH}/assets/images/해파리만개.jpeg`} alt="해파리 만개 책 표지" className="book-card-cover" />
                  <p className="book-card-title">해파리 만개</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="양면의 조개껍데기">
                  <img src={`${BASE_PATH}/assets/images/양면의 조개껍데기.jpeg`} alt="양면의 조개껍데기 책 표지" className="book-card-cover" />
                  <p className="book-card-title">양면의 조개껍데기</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="지구 끝의 온실">
                  <img src={`${BASE_PATH}/assets/images/지구 끝의 온실.jpeg`} alt="지구 끝의 온실 책 표지" className="book-card-cover" />
                  <p className="book-card-title">지구 끝의 온실</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="행성어 서점">
                  <img src={`${BASE_PATH}/assets/images/행성어 서점.jpeg`} alt="행성어 서점 책 표지" className="book-card-cover" />
                  <p className="book-card-title">행성어 서점</p>
                  <p className="book-card-year">2022</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="므레모사">
                  <img src={`${BASE_PATH}/assets/images/므레모사.jpeg`} alt="므레모사 책 표지" className="book-card-cover" />
                  <p className="book-card-title">므레모사</p>
                  <p className="book-card-year">2023</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="아무튼, SF게임">
                  <img src={`${BASE_PATH}/assets/images/아무튼, SF 게임.jpeg`} alt="아무튼, SF게임 책 표지" className="book-card-cover" />
                  <p className="book-card-title">아무튼, SF게임</p>
                  <p className="book-card-year">2024</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="책과 우연들">
                  <img src={`${BASE_PATH}/assets/images/책과 우연들.jpeg`} alt="책과 우연들 책 표지" className="book-card-cover" />
                  <p className="book-card-title">책과 우연들</p>
                  <p className="book-card-year">2025</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="관내분실">
                  <img src={`${BASE_PATH}/assets/images/관내분실.jpeg`} alt="관내분실 책 표지" className="book-card-cover" />
                  <p className="book-card-title">관내분실</p>
                  <p className="book-card-year">2018</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="토막난 우주를 안고서">
                  <img src={`${BASE_PATH}/assets/images/토막 난 우주를 안고서.jpeg`} alt="토막난 우주를 안고서 책 표지" className="book-card-cover" />
                  <p className="book-card-title">토막난 우주를 안고서</p>
                  <p className="book-card-year">2019</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="방금 떠나온 세계">
                  <img src={`${BASE_PATH}/assets/images/방금 떠나온 세계.jpeg`} alt="방금 떠나온 세계 책 표지" className="book-card-cover" />
                  <p className="book-card-title">방금 떠나온 세계</p>
                  <p className="book-card-year">2020</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="해파리 만개">
                  <img src={`${BASE_PATH}/assets/images/해파리만개.jpeg`} alt="해파리 만개 책 표지" className="book-card-cover" />
                  <p className="book-card-title">해파리 만개</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="양면의 조개껍데기">
                  <img src={`${BASE_PATH}/assets/images/양면의 조개껍데기.jpeg`} alt="양면의 조개껍데기 책 표지" className="book-card-cover" />
                  <p className="book-card-title">양면의 조개껍데기</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="지구 끝의 온실">
                  <img src={`${BASE_PATH}/assets/images/지구 끝의 온실.jpeg`} alt="지구 끝의 온실 책 표지" className="book-card-cover" />
                  <p className="book-card-title">지구 끝의 온실</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="행성어 서점">
                  <img src={`${BASE_PATH}/assets/images/행성어 서점.jpeg`} alt="행성어 서점 책 표지" className="book-card-cover" />
                  <p className="book-card-title">행성어 서점</p>
                  <p className="book-card-year">2022</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="므레모사">
                  <img src={`${BASE_PATH}/assets/images/므레모사.jpeg`} alt="므레모사 책 표지" className="book-card-cover" />
                  <p className="book-card-title">므레모사</p>
                  <p className="book-card-year">2023</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="아무튼, SF게임">
                  <img src={`${BASE_PATH}/assets/images/아무튼, SF 게임.jpeg`} alt="아무튼, SF게임 책 표지" className="book-card-cover" />
                  <p className="book-card-title">아무튼, SF게임</p>
                  <p className="book-card-year">2024</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="책과 우연들">
                  <img src={`${BASE_PATH}/assets/images/책과 우연들.jpeg`} alt="책과 우연들 책 표지" className="book-card-cover" />
                  <p className="book-card-title">책과 우연들</p>
                  <p className="book-card-year">2025</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="파견자들">
                  <img src={`${BASE_PATH}/assets/images/파견자들.jpeg`} alt="파견자들 책 표지" className="book-card-cover" />
                  <p className="book-card-title">파견자들</p>
                  <p className="book-card-year">2015</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="관내분실">
                  <img src={`${BASE_PATH}/assets/images/관내분실.jpeg`} alt="관내분실 책 표지" className="book-card-cover" />
                  <p className="book-card-title">관내분실</p>
                  <p className="book-card-year">2018</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="토막난 우주를 안고서">
                  <img src={`${BASE_PATH}/assets/images/토막 난 우주를 안고서.jpeg`} alt="토막난 우주를 안고서 책 표지" className="book-card-cover" />
                  <p className="book-card-title">토막난 우주를 안고서</p>
                  <p className="book-card-year">2019</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="방금 떠나온 세계">
                  <img src={`${BASE_PATH}/assets/images/방금 떠나온 세계.jpeg`} alt="방금 떠나온 세계 책 표지" className="book-card-cover" />
                  <p className="book-card-title">방금 떠나온 세계</p>
                  <p className="book-card-year">2020</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="해파리 만개">
                  <img src={`${BASE_PATH}/assets/images/해파리만개.jpeg`} alt="해파리 만개 책 표지" className="book-card-cover" />
                  <p className="book-card-title">해파리 만개</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="양면의 조개껍데기">
                  <img src={`${BASE_PATH}/assets/images/양면의 조개껍데기.jpeg`} alt="양면의 조개껍데기 책 표지" className="book-card-cover" />
                  <p className="book-card-title">양면의 조개껍데기</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="지구 끝의 온실">
                  <img src={`${BASE_PATH}/assets/images/지구 끝의 온실.jpeg`} alt="지구 끝의 온실 책 표지" className="book-card-cover" />
                  <p className="book-card-title">지구 끝의 온실</p>
                  <p className="book-card-year">2021</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="행성어 서점">
                  <img src={`${BASE_PATH}/assets/images/행성어 서점.jpeg`} alt="행성어 서점 책 표지" className="book-card-cover" />
                  <p className="book-card-title">행성어 서점</p>
                  <p className="book-card-year">2022</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="므레모사">
                  <img src={`${BASE_PATH}/assets/images/므레모사.jpeg`} alt="므레모사 책 표지" className="book-card-cover" />
                  <p className="book-card-title">므레모사</p>
                  <p className="book-card-year">2023</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="아무튼, SF게임">
                  <img src={`${BASE_PATH}/assets/images/아무튼, SF 게임.jpeg`} alt="아무튼, SF게임 책 표지" className="book-card-cover" />
                  <p className="book-card-title">아무튼, SF게임</p>
                  <p className="book-card-year">2024</p>
                </div>
                <div className="book-card" role="link" tabIndex={0} aria-label="책과 우연들">
                  <img src={`${BASE_PATH}/assets/images/책과 우연들.jpeg`} alt="책과 우연들 책 표지" className="book-card-cover" />
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
                  ['story-02','스펙트럼'],
                  ['story-03','공생가설'],
                  ['story-04','우리가 빛의 속도로 갈 수 없다면'],
                  ['story-05','감정의 물성'],
                  ['story-06','관내분실'],
                  ['story-07','나의 우주 영웅에 관하여'],
                ].map(([id, title], i) => (
                  <div className="story-index-item" data-story={id} role="tab" aria-selected="false" key={id}>
                    <span className="story-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="story-index-title">{title}</span>
                  </div>
                ))}
              </nav>
              <div className="story-panel" aria-live="polite">
                {[
                  { id:'story-01', num:'01 / 07', title:'순례자들은 왜 돌아오지 않는가', tags:['탐험','희생','기다림','미지'], synopsis:'우주 개척 시대. 새로운 행성을 찾기 위해 떠난 탐사대는 돌아오지 않는다. 남겨진 사람들은 그들을 기다리며 탐험이란 무엇인지, 인간은 왜 미지의 세계를 향하는지 고민한다.', quote:'"우리는 그곳에서 괴로울거야. 하지만 그보다 많이 행복할거야."' },
                  { id:'story-02', num:'02 / 07', title:'스펙트럼', tags:['소통','이해','다양성','공존'], synopsis:'인간과 외계 생명체가 서로의 언어와 감각을 이해하려 노력하는 이야기. 서로 완전히 이해할 수 없지만, 이해하려는 노력 자체에 의미가 있음을 보여준다.', quote:'"세 번째 루이는 이전의 루이들처럼 그림을 그렸고 희진을 상냥하고 다정하게 대했다."' },
                  { id:'story-03', num:'03 / 07', title:'공생 가설', tags:['공생','관계','생명','의존'], synopsis:'인간과 다른 생명체가 서로에게 영향을 주며 살아가는 관계를 그린다. 독립적으로 존재하는 것이 아니라 함께 살아가는 존재라는 점을 이야기한다.', quote:'"이름이 없는 행성. 그곳의 이름을 말로 표현할 수 없다는 사실은 오히려 그 신비한 세계에 몽환적인 상상을 덧대었다. 사람들은 그곳을 류드밀라의 행성이라고 불렀다."' },
                  { id:'story-04', num:'04 / 07', title:'우리가 빛의 속도로 갈 수 없다면', tags:['기다림','그리움','상실','사랑'], synopsis:'우주정거장에 홀로 남은 한 여성이 가족을 만나기 위해 평생을 기다리는 이야기. 빛보다 빠르게 이동할 수 없는 세계에서 끝내 닿지 못하는 사랑을 담고 있다.', quote:'"우리가 빛의 속도로 갈 수조차 없다면, 같은 우주라는 개념이 대체 무슨 의미가 있나?"' },
                  { id:'story-05', num:'05 / 07', title:'감정의 물성', tags:['감정','기억','선택','치유'], synopsis:'감정을 물질처럼 다룰 수 있는 미래 사회에서, 감정이 과연 제거하거나 통제해야 할 대상인지 질문한다.', quote:'"때로 어떤 사람들에게는 의미가 담긴 눈물이 아니라 단지 눈물 그 자체가 필요한 것 같기도 하다."' },
                  { id:'story-06', num:'06 / 07', title:'관내분실', tags:['기억','상실','존재','흔적'], synopsis:'사라진 존재와 잊힌 기억을 추적하는 이야기. 기억 속에서조차 희미해지는 사람들의 흔적을 통해 존재의 의미를 되묻는다.', quote:'"만약 엄마가 이렇게 허탈하게 사라져버릴 줄 알았더라면 늦기 전에 이곳을 찾았을 텐데."' },
                  { id:'story-07', num:'07 / 07', title:'나의 우주 영웅에 관하여', tags:['성장','동경','현실','용기'], synopsis:'어린 시절 동경했던 영웅을 다시 마주하며, 이상과 현실의 차이를 받아들이는 성장 이야기.', quote:'"가윤은 한때 재경을 보며 우주의 꿈을 꾸던 소녀였고, 이제 재경 다음에 온 사람이었다."' },
                ].map(s => (
                  <article id={s.id} className="story-detail" role="tabpanel" key={s.id}>
                    {s.id === 'story-01' ? (
                      <img src={`${BASE_PATH}/assets/images/챕터1.png`} alt="순례자들은 왜 돌아오지 않는가 배경" className="story-image" style={{ objectFit: 'cover', width: '50%', height: '50%', display: 'block' }} />
                    ) : s.id === 'story-02' ? (
                      <img src={`${BASE_PATH}/assets/images/챕터2.png`} alt="스펙트럼 배경" className="story-image" style={{ objectFit: 'cover', width: '50%', height: '50%', display: 'block' }} />
                      ) : s.id === 'story-03' ? (
                      <img src={`${BASE_PATH}/assets/images/챕터3.png`} alt="공생 가설 배경" className="story-image" style={{ objectFit: 'cover', width: '50%', height: '50%', display: 'block' }} />
                      ) : s.id === 'story-04' ? (
                      <img src={`${BASE_PATH}/assets/images/챕터4.png`} alt="우리가 빛의 속도로 갈 수 없다면 배경" className="story-image" style={{ objectFit: 'cover', width: '50%', height: '50%', display: 'block' }} />
                      ) : s.id === 'story-05' ? (
                      <img src={`${BASE_PATH}/assets/images/챕터5.png`} alt="감정의 물성 배경" className="story-image" style={{ objectFit: 'cover', width: '50%', height: '50%', display: 'block' }} />
                      ) : s.id === 'story-06' ? (
                      <img src={`${BASE_PATH}/assets/images/챕터6.png`} alt="관내분실 배경" className="story-image" style={{ objectFit: 'cover', width: '50%', height: '50%', display: 'block' }} />
                      ) : s.id === 'story-07' ? (
                      <img src={`${BASE_PATH}/assets/images/챕터7.png`} alt="나의 우주 영웅에 관하여 배경" className="story-image" style={{ objectFit: 'cover', width: '50%', height: '50%', display: 'block' }} />
                    ) : (
                      <div className="story-mood-placeholder" aria-label={`단편 배경 이미지 — ${s.title}`}>IMAGE: {s.id}.jpg</div>
                    )}
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
        <section id="memory" className="section" aria-label="편지 작성">
          <div className="section-inner">
            <p className="section-label reveal">Memory</p>
            <hr className="section-divider reveal" />
            <p className="memory-description reveal">당신의 그리움을 편지를 통해 전해보세요.</p>
            
            {/* 편지 작성 폼 */}
            <div className="memory-form reveal">
              <div className="memory-form-group">
                <label className="memory-form-label" htmlFor="memory-from">From</label>
                <input
                  id="memory-from"
                  type="text"
                  className="memory-form-input"
                  placeholder="이름을 입력하시오."
                  aria-label="발신자 이름"
                />
              </div>

              <div className="memory-form-group">
                <label className="memory-form-label" htmlFor="memory-message">Message</label>
                <textarea
                  id="memory-message"
                  className="memory-textarea"
                  placeholder="편지를 작성해주세요..."
                  rows="6"
                  aria-label="편지 내용"
                ></textarea>
              </div>

              <div className="memory-btn-wrapper">
                <button id="memory-send-btn" className="memory-btn" aria-label="편지 등록">
                  SEND
                </button>
                <span id="memory-success-msg" className="memory-success-msg" role="status" aria-live="polite">그리움이 전송되었습니다.</span>
              </div>
            </div>

            {/* 등록 목록 */}
            <div className="memory-list-section reveal">
              <div id="memory-list" className="memory-list" role="region" aria-label="등록된 편지 목록"></div>
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
                <img src={`${BASE_PATH}/assets/images/책표지.jpeg`} alt="우리가 빛의 속도로 갈 수 없다면 책 표지" className="purchase-book-image" style={{ objectFit: 'contain', width: '100%', height: '100%', display: 'block' }} />
              </div>
              <p className="purchase-copy reveal">
                지금, 빛의 속도로<br />당신에게 닿기를.
              </p>
              <div className="purchase-tabs reveal" role="tablist" aria-label="도서 형식 선택">
                <button className="purchase-tab" data-tab="paper" role="tab">종이책</button>
                <button className="purchase-tab" data-tab="ebook" role="tab">전자책</button>
              </div>
              <div className="purchase-stores store-group" data-group="paper">
                <a className="store-btn" href="https://product.kyobobook.co.kr/detail/S000001935245" target="_blank" rel="noopener noreferrer" aria-label="교보문고에서 구매"><span className="store-icon"> 교보문고</span></a>
                <a className="store-btn" href="https://www.yes24.com/Product/Goods/74261416" target="_blank" rel="noopener noreferrer" aria-label="예스24에서 구매"><span className="store-icon"> 예스24</span></a>
                <a className="store-btn" href="https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=193591681&start=pcsearch_auto" target="_blank" rel="noopener noreferrer" aria-label="알라딘에서 구매"><span className="store-icon"> 알라딘</span></a>
              </div>
              <div className="purchase-stores store-group" data-group="ebook" style={{ display:'none' }}>
                <a className="store-btn" href="https://ridibooks.com/books/4097000095?_s=instant&_q=%EC%9A%B0%EB%A6%AC%EA%B0%80+%EB%B9%9B%EC%9D%98&_rdt_sid=search_instant&_rdt_idx=4&_rdt_arg=%EC%9A%B0%EB%A6%AC%EA%B0%80+%EB%B9%9B%EC%9D%98" target="_blank" rel="noopener noreferrer" aria-label="리디북스에서 구매"><span className="store-icon"> 리디북스</span></a>
                <a className="store-btn" href="https://www.yes24.com/product/goods/77220299" target="_blank" rel="noopener noreferrer" aria-label="예스24에서 구매"><span className="store-icon"> 예스24</span></a>
                <a className="store-btn" href="https://series.naver.com/ebook/detail.series?productNo=4375685" target="_blank" rel="noopener noreferrer" aria-label="네이버 시리즈에서 구매"><span className="store-icon"> 네이버 시리즈</span></a>
              </div>
              <div className="purchase-info reveal">
                <span>초판 2019.06.24</span>
                <span>허블 출판사</span>
                <span>김초엽 작가의 단편 소설집</span>
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
              {/* 좌측 칼럼 - Type Flyer */}
              <div className="work-card reveal" id="work-card-1" role="button" tabIndex={0} aria-label="작업물 상세 보기" onClick={() => {
                document.querySelector('.work-modal-overlay-1').classList.add('open');
              }}>
                <div className="work-card-image-wrap">
                  <img src={`${BASE_PATH}/assets/images/최종플라이어1.png`} alt="Type Flyer 이미지" className="work-card-image" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div className="work-card-overlay"><span>View Work</span></div>
                </div>
                <div className="work-card-info">
                  <h3 className="work-card-title">Type Flyer</h3>
                  <p className="work-card-desc">
                     타입 플라이어입니다. 그리움과 쓸쓸함을 나타내고자 하였으며 도달하지 못한 사랑을 표현하고자 했습니다.
                  </p>
                  <button className="work-card-btn" aria-label="작업물 자세히 보기">
                    View Detail
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 가운데 칼럼 - 모션 이미지 */}
              <div className="work-card reveal" id="work-card-2" role="button" tabIndex={0} aria-label="작업물 상세 보기" onClick={() => {
                document.querySelector('.work-modal-overlay-2').classList.add('open');
              }}>
                <div className="work-card-image-wrap">
                  <img src={`${BASE_PATH}/assets/images/1_최현지_우리가 빛의 속도로 갈 수 없다면.gif`} alt="Motion 이미지" className="work-card-image" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '1 / 1' }} />
                  <div className="work-card-overlay"><span>View Work</span></div>
                </div>
                <div className="work-card-info">
                  <h3 className="work-card-title">Motion</h3>
                  <p className="work-card-desc">
                    Type Flyer를 활용한 모션입니다. 그리움과 기다림을 표현하고자 했으며, 도달하지 못한 사랑을 담고자 했습니다.
                  </p>
                  <button className="work-card-btn" aria-label="작업물 자세히 보기" onClick={(e) => {
                    e.stopPropagation();
                    document.querySelector('.work-modal-overlay-2').classList.add('open');
                  }}>
                    View Detail
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 우측 칼럼 - 유튜브 영상 */}
              <div className="work-card reveal" id="work-card-3" role="button" tabIndex={0} aria-label="유튜브 영상">
                <div className="work-card-image-wrap" onClick={() => window.open('https://www.youtube.com/watch?v=ko_QgC5NlZY&feature=youtu.be', '_blank')}>
                  <img src="https://img.youtube.com/vi/ko_QgC5NlZY/maxresdefault.jpg" alt="유튜브 영상 썸네일" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div className="work-card-overlay"><span>Watch Video</span></div>
                </div>
                <div className="work-card-info">
                  <h3 className="work-card-title">Book Trailer</h3>
                  <p className="work-card-desc">
                    본 책 챕터 중 4편의 '우리가 빛의 속도로 갈 수 없다면'의 북 트레일러 영상입니다. 주인공의 그리움과 기다림을 보여주고자 했습니다.
                  </p>
                  <button className="work-card-btn" aria-label="유튜브에서 보기" onClick={(e) => { e.preventDefault(); window.open('https://www.youtube.com/watch?v=ko_QgC5NlZY&feature=youtu.be', '_blank'); }}>
                    Watch Video
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
          © 2026· 『우리가 빛의 속도로 갈 수 없다면』 · 김초엽 · 책 홍보 사이트
        </p>
      </footer>

      {/* WORK 모달 - 좌측 카드 (Type Flyer) */}
      <div className="work-modal-overlay work-modal-overlay-1" role="dialog" aria-modal="true" aria-label="작업물 상세">
        <div className="work-modal">
          <button className="work-modal-close" aria-label="모달 닫기" onClick={(e) => {
            e.target.closest('.work-modal-overlay-1').classList.remove('open');
          }}>✕ Close</button>
          <img src={`${BASE_PATH}/assets/images/최종플라이어1.png`} alt="Type Flyer 상세 이미지" style={{ width:'100%', height:'auto', display:'block' }} />
          <div className="work-modal-body">
            <h2 className="work-modal-title">Type Flyer</h2>
            <p className="work-modal-desc">
              '우리가 빛의 속도로 갈 수 없다면'을 활용한 타입 플라이어입니다. 그리움과 쓸쓀함을 나타내고자 하였으며 도달하지 못한 사랑을 표현하고자 했습니다.
            </p>
          </div>
        </div>
      </div>

      {/* WORK 모달 - 가운데 카드 (Motion) */}
      <div className="work-modal-overlay work-modal-overlay-2" role="dialog" aria-modal="true" aria-label="작업물 상세">
        <div className="work-modal">
          <button className="work-modal-close" aria-label="모달 닫기" onClick={(e) => {
            e.target.closest('.work-modal-overlay-2').classList.remove('open');
          }}>✕ Close</button>
          <img src={`${BASE_PATH}/assets/images/1_최현지_우리가 빛의 속도로 갈 수 없다면.gif`} alt="Motion 상세 이미지" style={{ width:'100%', height:'auto', display:'block' }} />
          <div className="work-modal-body">
            <h2 className="work-modal-title">Motion</h2>
            <p className="work-modal-desc">
              Type Flyer를 활용한 모션입니다. 그리움과 기다림을 표현하고자 했으며, 도달하지 못한 사랑을 담고자 했습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 커스텀 마우스 커서 스크립트 */}
      
    </>
  )
}
