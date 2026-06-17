/* ============================================
   STORY — 단편 목록 탭 인터랙션
============================================ */

(function () {
  'use strict';

  const indexItems = document.querySelectorAll('.story-index-item');
  const details    = document.querySelectorAll('.story-detail');

  function showDetail(targetId) {
    // 모든 상세 숨김
    details.forEach(d => d.classList.remove('active'));
    indexItems.forEach(i => i.classList.remove('active'));

    // 선택된 항목 활성화
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add('active');
    }

    // 인덱스 활성화
    const activeIndex = document.querySelector(`.story-index-item[data-story="${targetId}"]`);
    if (activeIndex) {
      activeIndex.classList.add('active');
    }
  }

  // 클릭 이벤트
  indexItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.story;
      if (targetId) showDetail(targetId);
    });

    // 키보드 접근성
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // 첫 번째 항목 자동 활성화
  if (indexItems.length > 0) {
    indexItems[0].click();
  }

})();
