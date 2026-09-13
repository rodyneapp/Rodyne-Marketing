export function initWalkthroughs() {
  document
    .querySelectorAll<HTMLElement>('[data-walkthrough]')
    .forEach((root) => {
      if (root.dataset.enhanced) return;
      const buttons = Array.from(
        root.querySelectorAll<HTMLButtonElement>('[data-walkthrough-step]'),
      );
      const scenes = Array.from(
        root.querySelectorAll<HTMLElement>('[data-walkthrough-scene]'),
      );
      const pause = root.querySelector<HTMLButtonElement>(
        '[data-walkthrough-pause]',
      )!;
      const replay = root.querySelector<HTMLButtonElement>(
        '[data-walkthrough-replay]',
      )!;
      const position = root.querySelector<HTMLElement>(
        '[data-walkthrough-position]',
      )!;
      const progress = root.querySelector<HTMLElement>(
        '[data-walkthrough-progress]',
      )!;
      const announcement = root.querySelector<HTMLElement>(
        '[data-walkthrough-announcement]',
      )!;
      const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
      const duration = 6500;
      let current = 0;
      let elapsed = 0;
      let lastTime: number | null = null;
      let frame: number | null = null;
      let visible = !('IntersectionObserver' in window);
      let paused = false;
      const canRun = () =>
        visible && !paused && !preference.matches && !document.hidden;
      const render = (announce = false) => {
        scenes.forEach((scene, index) => {
          scene.hidden = index !== current;
        });
        buttons.forEach((button, index) =>
          button.setAttribute('aria-pressed', String(index === current)),
        );
        position.textContent = `${current + 1} / ${scenes.length}`;
        progress.style.transform = `scaleX(${(current + elapsed / duration) / scenes.length})`;
        if (announce)
          announcement.textContent =
            scenes[current].querySelector('h3')?.textContent ?? '';
      };
      const tick = (time: number) => {
        frame = null;
        if (!canRun()) {
          lastTime = null;
          return;
        }
        if (lastTime !== null) elapsed += Math.min(time - lastTime, 100);
        lastTime = time;
        if (elapsed >= duration) {
          elapsed = 0;
          current = (current + 1) % scenes.length;
          render();
        }
        progress.style.transform = `scaleX(${(current + elapsed / duration) / scenes.length})`;
        frame = requestAnimationFrame(tick);
      };
      const sync = () => {
        root.dataset.paused = String(paused || preference.matches);
        root.style.setProperty(
          '--demo-play-state',
          canRun() ? 'running' : 'paused',
        );
        pause.textContent = paused ? 'Play demo' : 'Pause demo';
        pause.hidden = preference.matches;
        if (!canRun()) {
          if (frame !== null) cancelAnimationFrame(frame);
          frame = null;
          lastTime = null;
        } else if (frame === null) frame = requestAnimationFrame(tick);
      };
      buttons.forEach((button, index) => {
        button.disabled = false;
        button.addEventListener('click', () => {
          current = index;
          elapsed = 0;
          paused = true;
          render(true);
          sync();
        });
      });
      pause.disabled = false;
      replay.disabled = false;
      pause.addEventListener('click', () => {
        paused = !paused;
        sync();
      });
      replay.addEventListener('click', () => {
        // Hide the old scene first so its CSS sequence restarts on replay.
        scenes[current].hidden = true;
        void root.offsetHeight;
        current = 0;
        elapsed = 0;
        lastTime = null;
        paused = false;
        render(true);
        sync();
      });
      // Reading or interacting with the demo should stop automatic stage changes.
      root.addEventListener('focusin', (event) => {
        if ((event.target as HTMLElement).closest('.walkthrough-scene')) {
          paused = true;
          sync();
        }
      });
      if ('IntersectionObserver' in window)
        new IntersectionObserver(
          (entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
            sync();
          },
          { threshold: 0.15 },
        ).observe(root);
      document.addEventListener('visibilitychange', sync);
      preference.addEventListener('change', sync);
      root.dataset.enhanced = 'true';
      render();
      sync();
    });
}
