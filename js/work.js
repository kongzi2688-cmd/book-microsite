/* ============================================
   WORK — 갤러리 모달 제어
============================================ */

(function () {
  'use strict';

  const workCard    = document.querySelector('.work-card');
  const modalOverlay = document.querySelector('.work-modal-overlay');
  const modalClose  = document.querySelector('.work-modal-close');

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // 카드 클릭
  workCard?.addEventListener('click', openModal);

  // 닫기 버튼
  modalClose?.addEventListener('click', closeModal);

  // 오버레이 바깥 클릭
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC 키
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Purchase 탭 전환
  const purchaseTabs = document.querySelectorAll('.purchase-tab');
  const storeGroups  = document.querySelectorAll('.store-group');

  purchaseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      purchaseTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      storeGroups.forEach(g => {
        g.style.display = g.dataset.group === target ? 'flex' : 'none';
      });
    });
  });

  // 첫 번째 탭 활성화
  if (purchaseTabs.length > 0) purchaseTabs[0].click();

})();
