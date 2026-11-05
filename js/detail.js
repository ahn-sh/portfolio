// Detail page: native scrolling + subtle visual responses
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealItems = document.querySelectorAll('.reveal');

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  // Lenis enhances mouse-wheel scrolling while retaining native touch scrolling.
  // If the CDN is unavailable, browser-native scrolling remains functional.
  if (!reducedMotion.matches && typeof window.Lenis === 'function') {
    const lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelector('.scroll-cue')?.addEventListener('click', (event) => {
      event.preventDefault();
      lenis.scrollTo('#project-intro', { offset: 0 });
    });
    document.querySelector('#backToTop')?.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      lenis.scrollTo(0);
    });
  }

  const hero = document.querySelector('.hero');
  const cue = document.querySelector('.scroll-cue');
  let ticking = false;

  function updateHeroScroll() {
    ticking = false;
    if (!hero || !cue) return;
    // The controls only appear after the hero's bottom edge leaves the viewport.
    const passedHero = document.querySelector('#project-intro')?.getBoundingClientRect().top <= 0;
    document.body.classList.toggle('has-left-hero', passedHero);
    if (reducedMotion.matches) return;
    const scrollY = Math.max(0, window.scrollY);
    const progress = Math.min(scrollY / Math.max(hero.offsetHeight, 1), 1);
    hero.style.setProperty('--hero-shift', `${Math.round(progress * 42)}px`);
    cue.style.setProperty('--cue-opacity', String(Math.max(0, 1 - progress * 2.6)));
    cue.style.setProperty('--cue-shift', `${Math.round(progress * 18)}px`);
    cue.style.pointerEvents = progress > 0.4 ? 'none' : '';
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeroScroll);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateHeroScroll();

  document.querySelector('#backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });
})();
