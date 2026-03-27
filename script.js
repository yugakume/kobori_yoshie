/**
 * こぼり良江 公式サイト - JavaScript
 */

'use strict';

/* ============================================================
   DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
    フッター著作権年を自動更新
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
    ハンバーガーメニュー
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const headerNav = document.getElementById('header-nav');

  if (hamburger && headerNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      headerNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });

    // ナビリンクをクリックしたら閉じる
    headerNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        headerNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      });
    });

    // メニュー外クリックで閉じる
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !headerNav.contains(e.target)) {
        hamburger.classList.remove('open');
        headerNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      }
    });
  }

  /* ----------------------------------------------------------
    スクロール時のヘッダー変化 + ページトップボタン表示
  ---------------------------------------------------------- */
  const header     = document.getElementById('site-header');
  const backToTop  = document.getElementById('back-to-top');
  const SCROLL_THRESHOLD = 80;

  function handleScroll() {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;

    if (header) {
      header.classList.toggle('scrolled', scrolled);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', scrolled);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // 初期状態確認

  /* ----------------------------------------------------------
    スムーズスクロール（ページ内リンク）
    ※ CSS の scroll-behavior: smooth; のフォールバック
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
    フェードインアニメーション（Intersection Observer）
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // 同じ親コンテナ内の要素は少しずつ遅らせる
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll('.fade-in')]
            : [];
          const index = siblings.indexOf(entry.target);
          const delay = index >= 0 ? Math.min(index * 80, 300) : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // IntersectionObserver 非対応ブラウザは即表示
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
    主な役職「もっと見る」トグル
  ---------------------------------------------------------- */
  const positionsToggle = document.getElementById('positions-toggle');
  const positionsList   = document.getElementById('positions-list');

  if (positionsToggle && positionsList) {
    positionsToggle.addEventListener('click', () => {
      const isExpanded = positionsToggle.getAttribute('aria-expanded') === 'true';

      positionsList.querySelectorAll('.hidden-item').forEach(item => {
        item.style.display = isExpanded ? '' : 'list-item';
      });

      positionsToggle.setAttribute('aria-expanded', !isExpanded);
      positionsToggle.textContent = isExpanded ? 'もっと見る ▼' : '閉じる ▲';
    });
  }

});
