console.log("cursor js loaded");
// ═══════════════════════════════════════════════════════════════════
// 커스텀 마우스 커서 (재구조화)
// 메인 커서 점 + Trail 파티클
// ═══════════════════════════════════════════════════════════════════

(function() {
  'use strict'

  // ─── 설정 ───────────────────────────────────────────────────────
  const CURSOR_SIZE = 12
  const TRAIL_SIZE = 6
  const TRAIL_LIFETIME = 800 // ms
  const SPAWN_DISTANCE = 8 // px

  // ─── 상태 ───────────────────────────────────────────────────────
  let lastX = 0
  let lastY = 0
  let trails = []
  let mainCursor = null

  // ─── 메인 커서 초기화 ──────────────────────────────────────────
  function initMainCursor() {
    mainCursor = document.createElement('div')
    mainCursor.id = 'cursor-main'
    document.body.appendChild(mainCursor)
    console.log('✓ Main cursor initialized')
  }

  // ─── Trail 생성 ────────────────────────────────────────────────
  function createTrail(x, y) {
    const trail = document.createElement('div')
    trail.className = 'cursor-trail'
    trail.style.left = x + 'px'
    trail.style.top = y + 'px'
    document.body.appendChild(trail)

    const startTime = Date.now()

    // Fade-out 애니메이션
    function animate() {
      const elapsed = Date.now() - startTime
      const progress = elapsed / TRAIL_LIFETIME
      trail.style.opacity = Math.max(0, 1 - progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        trail.remove()
      }
    }

    animate()
  }

  // ─── 마우스 이동 감지 ──────────────────────────────────────────
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX
    const y = e.clientY

    // 메인 커서 위치 업데이트
    if (mainCursor) {
      mainCursor.style.left = x + 'px'
      mainCursor.style.top = y + 'px'
    }

    // Trail 생성 (거리 기반)
    const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2)
    if (distance >= SPAWN_DISTANCE) {
      createTrail(x, y)
      lastX = x
      lastY = y
    }
  }, { passive: true })

  // ─── 초기화 ────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMainCursor)
  } else {
    initMainCursor()
  }
})()


