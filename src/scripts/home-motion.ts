const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

if (window.location.hash) {
  try {
    const hashTarget = document.querySelector<HTMLElement>(
      window.location.hash,
    );
    window.requestAnimationFrame(() =>
      hashTarget?.scrollIntoView({ block: 'start' }),
    );
  } catch {
    // Ignore malformed external hashes.
  }
}

const header = document.querySelector<HTMLElement>('[data-header]');
const menuButton =
  document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');
let lastFocusedElement: HTMLElement | null = null;
let menuAnimation: Animation | null = null;

const animateMenu = (opening: boolean) => {
  if (!mobileMenu) return;
  const opacity = getComputedStyle(mobileMenu).opacity;
  const transform = getComputedStyle(mobileMenu).transform;
  menuAnimation?.cancel();
  if (reducedMotion.matches) {
    mobileMenu.hidden = !opening;
    return;
  }
  menuAnimation = mobileMenu.animate(
    [
      {
        opacity: opening && mobileMenu.hidden ? 0 : opacity,
        transform:
          opening && mobileMenu.hidden ? 'translateY(-6px)' : transform,
      },
      {
        opacity: opening ? 1 : 0,
        transform: opening ? 'translateY(0)' : 'translateY(-6px)',
      },
    ],
    { duration: opening ? 220 : 160, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
  );
  mobileMenu.hidden = false;
  menuAnimation.onfinish = () => {
    mobileMenu.hidden = !opening;
    menuAnimation = null;
  };
};

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

const menuFocusable = () =>
  mobileMenu
    ? Array.from(
        mobileMenu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
    : [];

const closeMenu = (restoreFocus = true) => {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  mobileMenu.inert = true;
  animateMenu(false);
  document.body.classList.remove('menu-open');
  if (restoreFocus) (lastFocusedElement ?? menuButton).focus();
};

const openMenu = () => {
  if (!menuButton || !mobileMenu) return;
  lastFocusedElement = document.activeElement as HTMLElement | null;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close navigation menu');
  mobileMenu.inert = false;
  animateMenu(true);
  document.body.classList.add('menu-open');
  menuFocusable()[0]?.focus();
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuButton?.addEventListener('click', () => {
  if (menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
  else openMenu();
});

reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches || !mobileMenu) return;
  menuAnimation?.cancel();
  menuAnimation = null;
  mobileMenu.hidden = menuButton?.getAttribute('aria-expanded') !== 'true';
});

mobileMenu?.addEventListener('click', (event) => {
  if ((event.target as HTMLElement).closest('a')) closeMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (!mobileMenu || menuButton?.getAttribute('aria-expanded') !== 'true')
    return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (event.key !== 'Tab') return;
  const focusable = menuFocusable();
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const continuousItems = Array.from(
  document.querySelectorAll<HTMLElement>('[data-continuous-motion]'),
);
const visibleItems = new Set<HTMLElement>();

const applyMotionState = () => {
  for (const item of continuousItems) {
    const shouldRun =
      visibleItems.has(item) &&
      document.visibilityState === 'visible' &&
      !reducedMotion.matches;
    item.style.setProperty('--motion-state', shouldRun ? 'running' : 'paused');
  }
};

if ('IntersectionObserver' in window) {
  const continuousObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) visibleItems.add(target);
        else visibleItems.delete(target);
      }
      applyMotionState();
    },
    { rootMargin: '80px 0px' },
  );
  continuousItems.forEach((item) => continuousObserver.observe(item));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px -24px' },
  );

  document
    .querySelectorAll<HTMLElement>(
      '[data-observe-reveal], [data-case-timeline]',
    )
    .forEach((item) => revealObserver.observe(item));
} else {
  continuousItems.forEach((item) => visibleItems.add(item));
  document
    .querySelectorAll<HTMLElement>(
      '[data-observe-reveal], [data-case-timeline]',
    )
    .forEach((item) => item.classList.add('is-visible'));
}

document.addEventListener('visibilitychange', applyMotionState);
reducedMotion.addEventListener('change', applyMotionState);
applyMotionState();

const hero = document.querySelector<HTMLElement>('[data-hero]');
const parallaxField = document.querySelector<HTMLElement>(
  '[data-parallax-field]',
);
let parallaxFrame: number | null = null;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let parallaxTime: number | null = null;

const renderParallax = (time: number) => {
  parallaxFrame = null;
  const delta =
    parallaxTime === null ? 1000 / 60 : Math.min(time - parallaxTime, 64);
  parallaxTime = time;
  const blend = 1 - Math.exp(-delta / 140);
  currentX += (targetX - currentX) * blend;
  currentY += (targetY - currentY) * blend;
  parallaxField?.style.setProperty('--pointer-x', `${currentX.toFixed(2)}px`);
  parallaxField?.style.setProperty('--pointer-y', `${currentY.toFixed(2)}px`);

  if (
    Math.abs(targetX - currentX) > 0.05 ||
    Math.abs(targetY - currentY) > 0.05
  ) {
    parallaxFrame = window.requestAnimationFrame(renderParallax);
  } else parallaxTime = null;
};

const queueParallax = () => {
  if (parallaxFrame === null)
    parallaxFrame = window.requestAnimationFrame(renderParallax);
};

const canUseParallax = () =>
  Boolean(
    hero &&
    parallaxField &&
    finePointer.matches &&
    visibleItems.has(parallaxField) &&
    document.visibilityState === 'visible' &&
    !reducedMotion.matches,
  );

hero?.addEventListener('pointermove', (event) => {
  if (!hero || !canUseParallax()) return;
  const rect = hero.getBoundingClientRect();
  targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
  targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 9;
  queueParallax();
});

const resetParallax = () => {
  targetX = 0;
  targetY = 0;
  if (reducedMotion.matches || document.hidden || !finePointer.matches) {
    if (parallaxFrame !== null) window.cancelAnimationFrame(parallaxFrame);
    parallaxFrame = parallaxTime = null;
    currentX = currentY = 0;
    parallaxField?.style.setProperty('--pointer-x', '0px');
    parallaxField?.style.setProperty('--pointer-y', '0px');
    return;
  }
  queueParallax();
};

hero?.addEventListener('pointerleave', resetParallax);
reducedMotion.addEventListener('change', resetParallax);
finePointer.addEventListener('change', resetParallax);
document.addEventListener('visibilitychange', resetParallax);

window.matchMedia('(min-width: 821px)').addEventListener('change', (event) => {
  if (event.matches && mobileMenu && !mobileMenu.hidden) closeMenu(false);
});
