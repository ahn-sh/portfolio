/* ============================================================
   PORTFOLIO DETAIL / INTERACTIONS
   01. Missing images
   02. Lenis smooth scroll
   03. IntersectionObserver scroll reveal
   04. Anchor navigation
   ============================================================ */
(() => {
  'use strict';

  // 01. 이미지가 없으면 파일명 표시. 기존 이미지 레이아웃은 유지.
  document.querySelectorAll('.image-slot img').forEach((img) => {
    const slot = img.closest('.image-slot');
    if (!slot) return;
    slot.dataset.placeholder = img.getAttribute('src')?.split('/').pop() || 'IMAGE';
    const missing = () => slot.classList.add('is-missing');
    img.addEventListener('error', missing);
    if (img.complete && img.naturalWidth === 0) missing();
  });

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lenis = null;

  // 02. Lenis 로딩 실패 시 기본 스크롤 유지.
  const startSmoothScroll = () => {
    if (motionQuery.matches || lenis || typeof window.Lenis !== 'function') return;
    lenis = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      autoRaf: true
    });
  };
  startSmoothScroll();

  // 03. 화면 진입 시 콘텐츠가 아래에서 위로 부드럽게 등장.
  // 이미지 영역은 이미지 파일이 없더라도 빈 박스 자체가 등장.
  const revealTargets = [
    '.hero__image',
    '.project-info__header',
    '.project-info__row',
    '.overview-visual__image',
    '.brand-intro__image',
    '.section-heading__title',
    '.section-heading__description',
    '.concept__grid .image-slot',
    '.concept__wide',
    '.service__desktop',
    '.service__mobile',
    '.service__detail',
    '.contents__wide',
    '.contents__grid .image-slot',
    '.contents__bottom',
    '.impact__grid .image-slot'
  ];
  const items = [...document.querySelectorAll(revealTargets.join(','))];

  if (!motionQuery.matches && 'IntersectionObserver' in window && items.length) {
    // Observer 설정 후 클래스를 추가해 첫 프레임의 깜빡임 방지.
    items.forEach((item) => {
      item.classList.add('reveal-item');
      const parent = item.parentElement;
      if (parent?.classList.contains('concept__grid') ||
          parent?.classList.contains('contents__grid') ||
          parent?.classList.contains('impact__grid')) {
        const index = [...parent.children].indexOf(item);
        item.style.setProperty('--reveal-delay', `${Math.min(index % 2, 1) * 110}ms`);
      }
    });
    document.documentElement.classList.add('has-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { root: null, rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
    // 이미 화면 안에 들어와 있는 요소도 첫 페인트 이후 즉시 노출.
    requestAnimationFrame(() => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
          item.classList.add('is-visible');
          observer.unobserve(item);
        }
      });
    });

    motionQuery.addEventListener('change', (event) => {
      if (!event.matches) return;
      observer.disconnect();
      document.documentElement.classList.remove('has-reveal');
      if (lenis) { lenis.destroy(); lenis = null; }
    });
  } else {
    motionQuery.addEventListener('change', (event) => {
      if (event.matches && lenis) { lenis.destroy(); lenis = null; }
      else if (!event.matches) startSmoothScroll();
    });
  }

  // 04. 내부 링크 이동
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: motionQuery.matches ? 'instant' : 'smooth' });
    });
  });
})();
