export const SCOUT_DURATION = 15200;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

// A single clock makes the flag, pointer, explanation and review queue agree.
export function getScoutFrame(time: number) {
  const fade = 1 - smooth((time - 14500) / 700);
  const flagArrival = clamp((time - 4000) / 380);
  const move = smooth((time - 4800) / 1000);
  const press =
    time >= 6100 && time < 6340 ? Math.sin(((time - 6100) / 240) * Math.PI) : 0;
  return {
    phase:
      time < 1200
        ? 'profile'
        : time < 4000
          ? 'checking'
          : time < 6200
            ? 'flagged'
            : time < 10400
              ? 'details'
              : 'queued',
    profile: 0.55 + 0.45 * smooth(time / 700),
    flagOpacity: smooth((time - 4000) / 220) * fade,
    flagScale:
      1 -
      Math.pow(1 - flagArrival, 3) * 0.3 +
      Math.sin(flagArrival * Math.PI) * 0.08,
    noticeOpacity: smooth((time - 6200) / 320) * fade,
    noticeY: (1 - smooth((time - 6200) / 320)) * 7,
    queueOpacity: smooth((time - 10400) / 350) * fade,
    cursorOpacity:
      smooth((time - 4650) / 180) * (1 - smooth((time - 7000) / 350)),
    cursorMove: move,
    cursorScale: 1 - press * 0.12,
    progress: clamp(time / SCOUT_DURATION),
  };
}

export function initScoutDemo() {
  document
    .querySelectorAll<HTMLElement>('[data-scout-demo]')
    .forEach((demo) => {
      if (demo.dataset.initialized) return;
      demo.dataset.initialized = 'true';
      const scene = demo.querySelector<HTMLElement>('.profile-scene')!;
      const flag = demo.querySelector<HTMLElement>('.profile-flag')!;
      const avatar = demo.querySelector<HTMLElement>('.profile-avatar-wrap')!;
      const caption = demo.querySelector<HTMLElement>('[data-scout-caption]')!;
      const detail = demo.querySelector<HTMLElement>('[data-scout-detail]')!;
      const progress = demo.querySelector<HTMLElement>(
        '[data-scout-progress]',
      )!;
      const pause =
        demo.querySelector<HTMLButtonElement>('[data-scout-pause]')!;
      const replay = demo.querySelector<HTMLButtonElement>(
        '[data-scout-replay]',
      )!;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );
      let elapsed = 0;
      let previous: number | null = null;
      let frame: number | null = null;
      let visible = false;
      let paused = false;
      let targetX = 77;
      let targetY = 66;
      let lastPhase = '';
      const captions: Record<string, [string, string]> = {
        profile: [
          'Open a Roblox profile',
          'Scout checks alongside the profile.',
        ],
        checking: [
          'Checking reference sources',
          'Comparing the account with the dataset and reports.',
        ],
        flagged: [
          'A red flag marks a list match',
          'The indicator sits beside the profile picture.',
        ],
        details: [
          'See why the account is listed',
          'Discord ID found with connections to 3 flagged servers.',
        ],
        queued: [
          'Ready for staff review',
          'One account in the removal review list.',
        ],
      };
      const render = () => {
        const state = getScoutFrame(reducedMotion.matches ? 12000 : elapsed);
        scene.style.setProperty('--profile-opacity', String(state.profile));
        scene.style.setProperty('--flag-opacity', String(state.flagOpacity));
        scene.style.setProperty('--flag-scale', String(state.flagScale));
        scene.style.setProperty(
          '--notice-opacity',
          String(state.noticeOpacity),
        );
        scene.style.setProperty('--notice-y', `${state.noticeY}px`);
        scene.style.setProperty('--queue-opacity', String(state.queueOpacity));
        scene.style.setProperty(
          '--cursor-opacity',
          String(reducedMotion.matches ? 0 : state.cursorOpacity),
        );
        scene.style.setProperty('--cursor-scale', String(state.cursorScale));
        scene.style.setProperty(
          '--cursor-x',
          `${targetX + 115 * (1 - state.cursorMove)}px`,
        );
        scene.style.setProperty(
          '--cursor-y',
          `${targetY + 65 * (1 - state.cursorMove)}px`,
        );
        progress.style.transform = `scaleX(${reducedMotion.matches ? 1 : state.progress})`;
        if (state.phase !== lastPhase) {
          lastPhase = state.phase;
          [caption.textContent, detail.textContent] = captions[state.phase];
        }
      };
      const tick = (now: number) => {
        if (previous !== null)
          elapsed = (elapsed + Math.min(now - previous, 80)) % SCOUT_DURATION;
        previous = now;
        render();
        frame = window.requestAnimationFrame(tick);
      };
      const sync = () => {
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
        previous = null;
        pause.disabled = reducedMotion.matches;
        pause.textContent = reducedMotion.matches
          ? 'Reduced motion'
          : paused
            ? 'Resume'
            : 'Pause';
        pause.setAttribute(
          'aria-label',
          paused ? 'Resume Scout animation' : 'Pause Scout animation',
        );
        render();
        if (visible && !paused && !reducedMotion.matches && !document.hidden)
          frame = window.requestAnimationFrame(tick);
      };
      pause.addEventListener('click', () => {
        paused = !paused;
        sync();
      });
      replay.disabled = false;
      replay.setAttribute('aria-label', 'Replay Scout animation');
      replay.addEventListener('click', () => {
        elapsed = 0;
        paused = false;
        sync();
      });
      new ResizeObserver(() => {
        // Measure the badge in avatar coordinates so the pointer lands at all sizes.
        targetX = flag.offsetLeft + flag.offsetWidth / 2 - 3;
        targetY = flag.offsetTop + flag.offsetHeight / 2 - 2;
        render();
      }).observe(avatar);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            sync();
          },
          { threshold: 0.15 },
        ).observe(demo);
      } else visible = true;
      document.addEventListener('visibilitychange', sync);
      reducedMotion.addEventListener('change', sync);
      sync();
    });
}
