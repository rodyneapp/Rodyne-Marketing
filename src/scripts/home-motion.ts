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
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
  if (restoreFocus) (lastFocusedElement ?? menuButton).focus();
};

const openMenu = () => {
  if (!menuButton || !mobileMenu) return;
  lastFocusedElement = document.activeElement as HTMLElement | null;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close navigation menu');
  mobileMenu.hidden = false;
  document.body.classList.add('menu-open');
  menuFocusable()[0]?.focus();
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuButton?.addEventListener('click', () => {
  if (menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
  else openMenu();
});

mobileMenu?.addEventListener('click', (event) => {
  if ((event.target as HTMLElement).closest('a')) closeMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (!mobileMenu || mobileMenu.hidden) return;

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

type Point = { x: number; y: number };

type DemoController = {
  root: HTMLElement;
  phase: number;
  elapsed: number;
  lastTime: number | null;
  frame: number | null;
  points: {
    search: Point;
    role: Point;
    option: Point;
  };
};

const demoPhases = [900, 1700, 900, 1400, 1000, 2600] as const;
const totalDemoDuration = demoPhases.reduce(
  (total, duration) => total + duration,
  0,
);
const searchQuery = 'chrxs_dev';

const continuousItems = Array.from(
  document.querySelectorAll<HTMLElement>('[data-continuous-motion]'),
);
const visibleItems = new Set<HTMLElement>();

const liveDemos: DemoController[] = Array.from(
  document.querySelectorAll<HTMLElement>('[data-live-demo]'),
).map((root) => ({
  root,
  phase: -1,
  elapsed: 0,
  lastTime: null,
  frame: null,
  points: {
    search: { x: 0, y: 0 },
    role: { x: 0, y: 0 },
    option: { x: 0, y: 0 },
  },
}));

const pointInside = (root: HTMLElement, target: Element | null): Point => {
  if (!target) return { x: root.clientWidth / 2, y: root.clientHeight / 2 };
  const rootRect = root.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  return {
    x: targetRect.left - rootRect.left + targetRect.width / 2,
    y: targetRect.top - rootRect.top + targetRect.height / 2,
  };
};

const refreshDemoPoints = (controller: DemoController) => {
  controller.points.search = pointInside(
    controller.root,
    controller.root.querySelector('[data-demo-search-target]'),
  );
  controller.points.role = pointInside(
    controller.root,
    controller.root.querySelector('[data-demo-role-target]'),
  );
  controller.points.option = pointInside(
    controller.root,
    controller.root.querySelector('[data-demo-role-option]'),
  );
};

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const ease = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};

const mixPoint = (from: Point, to: Point, progress: number): Point => ({
  x: from.x + (to.x - from.x) * ease(progress),
  y: from.y + (to.y - from.y) * ease(progress),
});

const pulseAt = (progress: number, centre: number, width = 0.1) =>
  clamp(1 - Math.abs(progress - centre) / width);

const phaseAtTime = (elapsed: number) => {
  let remaining = elapsed % totalDemoDuration;
  for (let index = 0; index < demoPhases.length; index += 1) {
    const duration = demoPhases[index];
    if (remaining < duration) return { index, progress: remaining / duration };
    remaining -= duration;
  }
  return { index: demoPhases.length - 1, progress: 1 };
};

const renderDemoPhase = (controller: DemoController, phaseIndex: number) => {
  controller.phase = phaseIndex;
  controller.root.dataset.demoPhase = String(phaseIndex);

  const searchValue = controller.root.querySelector<HTMLElement>(
    '[data-demo-search-value]',
  );
  if (searchValue && phaseIndex !== 1) {
    searchValue.textContent =
      phaseIndex === 0 ? 'Search by username or Roblox ID…' : searchQuery;
  }

  const roleValue = controller.root.querySelector<HTMLElement>(
    '[data-demo-role-value]',
  );
  if (roleValue)
    roleValue.textContent = phaseIndex === 5 ? 'Senior Host' : 'Host';

  const resultCount = controller.root.querySelector<HTMLElement>(
    '[data-demo-result-count]',
  );
  if (resultCount)
    resultCount.textContent = phaseIndex < 2 ? '5 results' : '1 result';
};

const renderDemoFrame = (
  controller: DemoController,
  phaseIndex: number,
  phaseProgress: number,
) => {
  const { root, points } = controller;
  const cursor = root.querySelector<HTMLElement>('[data-demo-cursor]');
  if (!cursor) return;

  if (phaseIndex === 1) {
    const searchValue = root.querySelector<HTMLElement>(
      '[data-demo-search-value]',
    );
    if (searchValue) {
      const typedLength = Math.min(
        searchQuery.length,
        Math.floor(phaseProgress * (searchQuery.length + 2)),
      );
      searchValue.textContent = searchQuery.slice(0, typedLength);
    }
  }

  const entrance = { x: points.search.x + 84, y: points.search.y - 50 };
  let cursorPoint: Point;

  if (phaseIndex === 0)
    cursorPoint = mixPoint(entrance, points.search, phaseProgress);
  else if (phaseIndex === 1) cursorPoint = points.search;
  else if (phaseIndex === 2)
    cursorPoint = mixPoint(points.search, points.role, phaseProgress);
  else if (phaseIndex === 3)
    cursorPoint = mixPoint(points.role, points.option, phaseProgress);
  else if (phaseIndex === 4) cursorPoint = points.option;
  else {
    cursorPoint = mixPoint(
      points.option,
      { x: points.option.x + 52, y: points.option.y + 18 },
      phaseProgress,
    );
  }

  const clickStrength = Math.max(
    phaseIndex === 1 ? pulseAt(phaseProgress, 0.08, 0.075) : 0,
    phaseIndex === 3 ? pulseAt(phaseProgress, 0.08, 0.08) : 0,
    phaseIndex === 4 ? pulseAt(phaseProgress, 0.22, 0.1) : 0,
  );
  const opacity =
    phaseIndex === 0
      ? clamp(phaseProgress * 3)
      : phaseIndex === 5
        ? clamp((1 - phaseProgress) * 3)
        : 1;

  cursor.style.opacity = String(opacity);
  cursor.style.setProperty('--cursor-x', `${cursorPoint.x}px`);
  cursor.style.setProperty('--cursor-y', `${cursorPoint.y}px`);
  cursor.style.setProperty('--cursor-scale', String(1 - clickStrength * 0.1));
  cursor.style.setProperty(
    '--cursor-click-opacity',
    String(clickStrength * 0.75),
  );
  cursor.style.setProperty(
    '--cursor-click-scale',
    String(0.45 + clickStrength * 1.25),
  );
  root.style.setProperty(
    '--demo-progress',
    String(controller.elapsed / totalDemoDuration),
  );
};

const shouldRunLiveDemo = (controller: DemoController) =>
  visibleItems.has(controller.root) &&
  document.visibilityState === 'visible' &&
  !reducedMotion.matches;

const runLiveDemoFrame = (controller: DemoController, time: number) => {
  controller.frame = null;
  if (!shouldRunLiveDemo(controller)) return;

  if (controller.lastTime !== null) {
    controller.elapsed =
      (controller.elapsed + Math.min(time - controller.lastTime, 80)) %
      totalDemoDuration;
  }
  controller.lastTime = time;

  const state = phaseAtTime(controller.elapsed);
  if (state.index !== controller.phase)
    renderDemoPhase(controller, state.index);
  renderDemoFrame(controller, state.index, state.progress);
  controller.frame = window.requestAnimationFrame((nextTime) =>
    runLiveDemoFrame(controller, nextTime),
  );
};

const startLiveDemo = (controller: DemoController) => {
  if (controller.frame !== null) return;
  refreshDemoPoints(controller);
  controller.lastTime = null;
  controller.frame = window.requestAnimationFrame((time) =>
    runLiveDemoFrame(controller, time),
  );
};

const stopLiveDemo = (controller: DemoController) => {
  if (controller.frame !== null) window.cancelAnimationFrame(controller.frame);
  controller.frame = null;
  controller.lastTime = null;
};

const syncLiveDemos = () => {
  for (const controller of liveDemos) {
    if (reducedMotion.matches) {
      stopLiveDemo(controller);
      renderDemoPhase(controller, 0);
      const cursor =
        controller.root.querySelector<HTMLElement>('[data-demo-cursor]');
      if (cursor) cursor.style.opacity = '0';
    } else if (shouldRunLiveDemo(controller)) {
      startLiveDemo(controller);
    } else {
      stopLiveDemo(controller);
    }
  }
};

const applyMotionState = () => {
  for (const item of continuousItems) {
    const shouldRun =
      visibleItems.has(item) &&
      document.visibilityState === 'visible' &&
      !reducedMotion.matches;
    item.style.setProperty('--motion-state', shouldRun ? 'running' : 'paused');
  }
  syncLiveDemos();
};

if (typeof ResizeObserver !== 'undefined') {
  const demoResizeObserver = new ResizeObserver(() =>
    liveDemos.forEach(refreshDemoPoints),
  );
  liveDemos.forEach((controller) =>
    demoResizeObserver.observe(controller.root),
  );
} else {
  window.addEventListener(
    'resize',
    () => liveDemos.forEach(refreshDemoPoints),
    {
      passive: true,
    },
  );
}

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
    { threshold: 0.16, rootMargin: '0px 0px -7%' },
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

const renderParallax = () => {
  parallaxFrame = null;
  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;
  parallaxField?.style.setProperty('--pointer-x', `${currentX.toFixed(2)}px`);
  parallaxField?.style.setProperty('--pointer-y', `${currentY.toFixed(2)}px`);

  if (
    Math.abs(targetX - currentX) > 0.05 ||
    Math.abs(targetY - currentY) > 0.05
  ) {
    parallaxFrame = window.requestAnimationFrame(renderParallax);
  }
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
  queueParallax();
};

hero?.addEventListener('pointerleave', resetParallax);
reducedMotion.addEventListener('change', resetParallax);
document.addEventListener('visibilitychange', resetParallax);

window.matchMedia('(min-width: 821px)').addEventListener('change', (event) => {
  if (event.matches && mobileMenu && !mobileMenu.hidden) closeMenu(false);
});
