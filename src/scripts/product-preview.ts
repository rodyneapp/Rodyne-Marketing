export const previewDurations = [
  1400, 1000, 1700, 1100, 1500, 2300, 900, 2800,
] as const;
export const previewDuration = previewDurations.reduce(
  (sum, duration) => sum + duration,
  0,
);

export const getPreviewFrame = (elapsed: number) => {
  let time = ((elapsed % previewDuration) + previewDuration) % previewDuration;
  let phase = 0;
  for (; phase < previewDurations.length - 1; phase += 1) {
    if (time < previewDurations[phase]) break;
    time -= previewDurations[phase];
  }
  const progress = time / previewDurations[phase];
  return {
    phase,
    progress,
    visualPhase:
      phase <= 1
        ? 0
        : phase === 2
          ? 1
          : phase === 3
            ? 2
            : phase === 4
              ? progress < 0.65
                ? 3
                : 4
              : 5,
    screen: phase === 0 && progress < 0.88 ? 'overview' : 'members',
    toast:
      phase < 5
        ? 'hidden'
        : phase === 5 || (phase === 6 && progress < 0.35)
          ? 'pending'
          : phase === 6
            ? 'approving'
            : 'success',
    search:
      phase < 2
        ? ''
        : phase === 2
          ? 'chrxs_dev'.slice(0, Math.floor(progress * 11))
          : 'chrxs_dev',
    role: phase === 7 ? 'Senior Host' : 'Host',
  };
};

type Point = { x: number; y: number };
const root =
  typeof document === 'undefined'
    ? null
    : document.querySelector<HTMLElement>('[data-animated-preview]');

if (root) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const windowElement = root.querySelector<HTMLElement>('.preview-window')!;
  const cursor = root.querySelector<HTMLElement>('[data-demo-cursor]')!;
  const pauseButton = root.querySelector<HTMLButtonElement>(
    '[data-animation-pause]',
  )!;
  const replayButton = root.querySelector<HTMLButtonElement>(
    '[data-animation-replay]',
  )!;
  let elapsed = 0;
  let lastTime: number | null = null;
  let frameId: number | null = null;
  let visible = false;
  let paused = false;
  let previousPhase = -1;
  let points: Record<string, Point> = {};

  const setText = (selector: string, value: string) => {
    const element = root.querySelector<HTMLElement>(selector);
    if (element && element.textContent !== value) element.textContent = value;
  };
  const point = (selector: string, previous?: Point): Point => {
    const candidates = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const target = candidates.find(
      (element) => element.getBoundingClientRect().width > 0,
    );
    const bounds = windowElement.getBoundingClientRect();
    const rect = target?.getBoundingClientRect();
    return rect
      ? {
          x: rect.left - bounds.left + rect.width / 2,
          y: rect.top - bounds.top + rect.height / 2,
        }
      : (previous ?? { x: bounds.width / 2, y: bounds.height / 2 });
  };
  const measure = () => {
    points = {
      members: point('[data-demo-members-target]', points.members),
      search: point('[data-demo-search-target]', points.search),
      role: point('[data-demo-role-target]', points.role),
      option: point('[data-demo-role-option]', points.option),
      approve: point('[data-demo-approve-target]', points.approve),
    };
  };
  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  const mix = (from: Point, to: Point, t: number): Point => {
    const v = clamp(t);
    const eased = v * v * (3 - 2 * v);
    return {
      x: from.x + (to.x - from.x) * eased,
      y: from.y + (to.y - from.y) * eased,
    };
  };

  const render = () => {
    const state = getPreviewFrame(elapsed);
    const { phase, progress } = state;
    root.dataset.demoPhase = String(state.visualPhase);
    root.dataset.demoScreen = state.screen;
    root.dataset.demoToast = state.toast;
    setText(
      '[data-demo-page-title]',
      state.screen === 'overview' ? 'Overview' : 'Members',
    );
    setText(
      '[data-demo-search-value]',
      state.search || 'Search by username or Roblox ID…',
    );
    setText('[data-demo-role-value]', state.role);
    setText('[data-demo-result-count]', phase >= 3 ? '1 result' : '5 results');
    setText(
      '[data-toast-title]',
      state.toast === 'success'
        ? 'Promotion approved'
        : state.toast === 'approving'
          ? 'Updating connected roles…'
          : 'Approve role change?',
    );
    setText(
      '[data-toast-description]',
      state.toast === 'success'
        ? 'chrxs_dev is now a Senior Host.'
        : 'chrxs_dev · Host → Senior Host',
    );
    setText(
      '[data-toast-note]',
      state.toast === 'success'
        ? 'Roblox and Discord confirmed. Saved to member history.'
        : 'Updates Roblox rank and the mapped Discord role.',
    );
    const step =
      phase === 0 ? 0 : phase <= 2 ? 1 : phase <= 4 ? 2 : phase <= 6 ? 3 : 4;
    setText('[data-animation-step]', `0${step + 1} / 05`);
    setText(
      '[data-animation-caption]',
      [
        'Open the member directory',
        'Search for chrxs_dev',
        'Choose Senior Host from the role dropdown',
        'Review the toast and click Approve',
        'Promotion confirmed on Roblox and Discord',
      ][step],
    );
    if (previousPhase !== phase) {
      measure();
      previousPhase = phase;
    }
    // Transitions can move the dropdown and toast; measure their settled positions.
    if (phase === 1 || phase === 4 || phase === 5) measure();
    let position: Point;
    if (phase === 0)
      position = mix(
        { x: points.members.x + 90, y: points.members.y + 50 },
        points.members,
        progress / 0.7,
      );
    else if (phase === 1)
      position = mix(points.members, points.search, progress / 0.75);
    else if (phase === 2) position = points.search;
    else if (phase === 3)
      position = mix(points.search, points.role, progress / 0.75);
    else if (phase === 4)
      position = mix(points.role, points.option, progress / 0.65);
    else if (phase === 5)
      position = mix(points.option, points.approve, (progress - 0.3) / 0.6);
    else if (phase === 6) position = points.approve;
    else
      position = mix(
        points.approve,
        { x: points.approve.x + 36, y: points.approve.y + 22 },
        progress / 0.5,
      );
    const clickAt =
      phase === 0 || phase === 1 || phase === 3
        ? 0.8
        : phase === 4
          ? 0.84
          : phase === 6
            ? 0.2
            : -1;
    const pulse =
      clickAt < 0 ? 0 : clamp(1 - Math.abs(progress - clickAt) / 0.09);
    cursor.style.setProperty('--cursor-x', `${position.x}px`);
    cursor.style.setProperty('--cursor-y', `${position.y}px`);
    cursor.style.setProperty('--cursor-scale', String(1 - pulse * 0.12));
    cursor.style.setProperty('--cursor-click-opacity', String(pulse * 0.8));
    cursor.style.setProperty('--cursor-click-scale', String(0.5 + pulse * 1.1));
    cursor.style.opacity = String(
      motion.matches
        ? 0
        : phase === 0
          ? clamp(progress * 5)
          : phase === 7
            ? clamp((0.75 - progress) * 4)
            : 1,
    );
    root.style.setProperty(
      '--demo-progress',
      String(elapsed / previewDuration),
    );
  };

  const canRun = () =>
    visible &&
    !paused &&
    !motion.matches &&
    document.visibilityState === 'visible';
  const tick = (time: number) => {
    frameId = null;
    if (!canRun()) {
      lastTime = null;
      return;
    }
    if (lastTime !== null)
      elapsed = (elapsed + Math.min(time - lastTime, 80)) % previewDuration;
    lastTime = time;
    render();
    frameId = window.requestAnimationFrame(tick);
  };
  const sync = () => {
    const stopped = !canRun();
    root.dataset.paused = String(stopped);
    if (stopped) {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      lastTime = null;
    } else if (frameId === null) {
      lastTime = null;
      frameId = window.requestAnimationFrame(tick);
    }
    pauseButton.textContent = paused ? 'Resume animation' : 'Pause animation';
    pauseButton.setAttribute('aria-pressed', String(paused));
  };
  const applyMotionPreference = () => {
    pauseButton.hidden = motion.matches;
    replayButton.hidden = motion.matches;
    previousPhase = -1;
    elapsed = motion.matches ? previewDuration - 1 : 0;
    render();
    sync();
  };
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    sync();
  });
  replayButton.addEventListener('click', () => {
    elapsed = 0;
    previousPhase = -1;
    paused = false;
    render();
    sync();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0.08 },
    ).observe(windowElement);
  } else visible = true;
  if ('ResizeObserver' in window)
    new ResizeObserver(() => {
      measure();
      render();
    }).observe(windowElement);
  window.addEventListener(
    'resize',
    () => {
      measure();
      render();
    },
    { passive: true },
  );
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', applyMotionPreference);
  applyMotionPreference();
}
