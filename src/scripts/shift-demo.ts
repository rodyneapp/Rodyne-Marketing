// One timeline keeps the cursor clicks, timer, and screen changes in sync.
const START = 2400;
const RUN_TIME = 6000;
const STOP = START + RUN_TIME;
const END = STOP + 2600;
const SUMMARY = END + 500;
const DURATION = SUMMARY + 10000;

document.querySelectorAll<HTMLElement>('[data-shift-demo]').forEach((demo) => {
  const scene = demo.querySelector<HTMLElement>('.shift-animation')!;
  const cursor = demo.querySelector<HTMLElement>('.demo-cursor')!;
  const status = demo.querySelector<HTMLElement>('[data-clock-status]')!;
  const seconds = demo.querySelector<HTMLElement>('[data-clock-seconds]')!;
  const action = demo.querySelector<HTMLElement>('[data-clock-action]')!;
  const hint = demo.querySelector<HTMLElement>('[data-clock-hint]')!;
  const button = demo.querySelector<HTMLButtonElement>('[data-shift-pause]')!;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed = 0;
  let previous: number | null = null;
  let frame: number | null = null;
  let visible = false;
  let paused = false;

  const render = (time: number) => {
    const phase =
      time < START
        ? 'ready'
        : time < STOP
          ? 'running'
          : time < SUMMARY
            ? 'stopped'
            : 'weekly';
    scene.dataset.phase = phase;
    status.textContent =
      phase === 'ready'
        ? 'Ready when you are'
        : phase === 'running'
          ? 'On shift'
          : 'Timer stopped';
    action.textContent =
      phase === 'ready'
        ? 'Click to start'
        : phase === 'running'
          ? 'Click to stop'
          : 'Stopped';
    hint.textContent =
      phase === 'ready'
        ? 'Your time starts with a click.'
        : phase === 'running'
          ? 'Every second, accounted for.'
          : 'All done? End your shift.';
    seconds.textContent = `:${String(Math.floor(Math.max(0, Math.min(RUN_TIME, time - START)) / 1000)).padStart(2, '0')}`;
    scene.style.setProperty(
      '--ring-offset',
      String(100 - Math.max(0, Math.min(1, (time - START) / RUN_TIME)) * 100),
    );

    // Cursor tip lands inside the round control, then on End shift.
    const arrival = Math.max(0, Math.min(1, (time - 400) / 1700));
    const move = Math.max(0, Math.min(1, (time - STOP - 700) / 1500));
    const ease = (value: number) => value * value * (3 - 2 * value);
    const x = 94 + (28 - 94) * ease(arrival) - 6 * ease(move);
    const y = 306 + (153 - 306) * ease(arrival) + 124 * ease(move);
    const clickAge = [START, STOP, END]
      .map((click) => time - click)
      .find((age) => age >= 0 && age < 500);
    const press =
      clickAge !== undefined
        ? Math.sin(Math.min(1, clickAge / 280) * Math.PI)
        : 0;
    cursor.style.transform = `translate(${x}px, ${y}px) scale(${1 - press * 0.12})`;
    cursor.style.opacity = String(
      Math.min(1, time / 600) *
        Math.max(0, Math.min(1, (SUMMARY - time) / 400)),
    );
    cursor.style.setProperty(
      '--click-opacity',
      clickAge === undefined ? '0' : String(1 - clickAge / 500),
    );
    cursor.style.setProperty(
      '--click-scale',
      clickAge === undefined ? '0.2' : String(0.2 + clickAge / 330),
    );
    scene.style.setProperty(
      '--clock-scale',
      String(1 - (time < END ? press : 0) * 0.025),
    );
    scene.style.setProperty(
      '--end-scale',
      String(1 - (time >= END ? press : 0) * 0.035),
    );
  };

  const tick = (now: number) => {
    if (previous !== null) elapsed = (elapsed + now - previous) % DURATION;
    previous = now;
    render(elapsed);
    frame = window.requestAnimationFrame(tick);
  };

  const sync = () => {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    previous = null;
    if (reducedMotion.matches) {
      render(SUMMARY);
    } else {
      render(elapsed);
      if (visible && !paused && document.visibilityState === 'visible') {
        frame = window.requestAnimationFrame(tick);
      }
    }
  };

  button.addEventListener('click', () => {
    paused = !paused;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute(
      'aria-label',
      paused ? 'Play shift animation' : 'Pause shift animation',
    );
    button.textContent = paused ? 'Play' : 'Pause';
    sync();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    ).observe(demo);
  } else {
    visible = true;
  }
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
});
