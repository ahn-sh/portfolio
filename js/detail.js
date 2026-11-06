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
  let lenis = null;
  if (!reducedMotion.matches && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({
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

  }

  const hero = document.querySelector('.hero');
  const cue = document.querySelector('.scroll-cue');
  const intro = document.querySelector('#project-intro');
  const footer = document.querySelector('footer.end');
  let ticking = false;

  function updateHeroScroll() {
    ticking = false;
    if (!hero || !cue) return;
    // The controls only appear after the hero's bottom edge leaves the viewport.
    const passedHero = !!intro && intro.getBoundingClientRect().top <= 0;
    const footerReached = !!footer && footer.getBoundingClientRect().top <= window.innerHeight;
    document.body.classList.toggle('has-left-hero', passedHero && !footerReached);
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

  function scrollToTop(event) {
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  }

  // Floating TOP and footer BACK TO TOP share one handler.
  document.querySelector('#backToTop')?.addEventListener('click', scrollToTop);
  // Event delegation works on project01, project02, and later detail pages,
  // even when the footer markup uses different classes.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#top"], a[data-scroll-top]');
    if (!link || !link.closest('footer')) return;
    scrollToTop(event);
  });
})();


// Project Challenge now uses static image assets; no dedicated JS required.

// Project Goal: hover/focus activates the corresponding card and heading keyword.
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.project-goal');
  if (!section) return;
  const cards = [...section.querySelectorAll('[data-goal-card]')];
  const labels = [...section.querySelectorAll('[data-goal-label]')];
  const activate = (index) => {
    cards.forEach((card, i) => card.classList.toggle('is-active', i === index));
    labels.forEach((label, i) => label.classList.toggle('is-active', i === index));
  };
  const reset = () => activate(-1);
  cards.forEach((card, index) => {
    card.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') activate(index); });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('focusin', () => activate(index));
    card.addEventListener('focusout', (event) => { if (!card.contains(event.relatedTarget)) reset(); });
    card.addEventListener('click', () => activate(index));
  });
  if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio);
      if (visible.length) activate(Number(visible[0].target.dataset.goalCard));
    }, { threshold:[0.35,0.6,0.85] });
    cards.forEach(card => observer.observe(card));
  }
});
