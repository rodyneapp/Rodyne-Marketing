const LINK_TIME = 2400;
const TRANSFER_TIME = 5400;
const CYCLE_TIME = LINK_TIME + TRANSFER_TIME * 3 + 2400;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const branches = ['heer', 'luftwaffe', 'feldjager', 'training'];

export function initCommunityMesh() {
  document
    .querySelectorAll<HTMLElement>('[data-community-mesh]')
    .forEach((root) => {
      if (root.dataset.initialized) return;
      root.dataset.initialized = 'true';
      const diagram = root.querySelector<HTMLElement>('[data-mesh-diagram]')!;
      const svg = diagram.querySelector<SVGSVGElement>('svg.mesh-wires')!;
      const nodes = Object.fromEntries(
        [...root.querySelectorAll<HTMLElement>('[data-mesh-node]')].map(
          (node) => [node.dataset.meshNode!, node],
        ),
      );
      const edges = Object.fromEntries(
        [...svg.querySelectorAll<SVGGElement>('[data-mesh-edge]')].map(
          (group) => [
            group.dataset.meshEdge!,
            {
              base: group.querySelector<SVGPathElement>('.wire-base')!,
              lit: group.querySelector<SVGPathElement>('.wire-lit')!,
              dot: group.querySelector<SVGCircleElement>('.packet')!,
              halo: group.querySelector<SVGCircleElement>('.packet-halo')!,
              length: 0,
            },
          ],
        ),
      );
      const buttons = [
        ...root.querySelectorAll<HTMLButtonElement>('[data-mesh-transfer]'),
      ];
      const pause = root.querySelector<HTMLButtonElement>('[data-mesh-pause]')!;
      const caption = root.querySelector<HTMLElement>('[data-mesh-caption]')!;
      const detail = root.querySelector<HTMLElement>('[data-mesh-detail]')!;
      const step = root.querySelector<HTMLElement>('[data-mesh-step]')!;
      const announcement = root.querySelector<HTMLElement>(
        '[data-mesh-announcement]',
      )!;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );
      const narrow = window.matchMedia('(max-width: 1000px)');
      let elapsed = 0;
      let last: number | null = null;
      let frame: number | null = null;
      let visible = false;
      let paused = false;
      let selected = -1;
      let lastState = '';

      const packet = (edgeName: string, progress: number, reverse = false) => {
        const edge = edges[edgeName];
        if (progress < 0 || progress > 1 || !edge.length) return;
        const point = edge.base.getPointAtLength(
          (reverse ? 1 - progress : progress) * edge.length,
        );
        const opacity = Math.min(
          clamp(progress * 12),
          clamp((1 - progress) * 12),
        );
        for (const element of [edge.dot, edge.halo]) {
          element.setAttribute('cx', String(point.x));
          element.setAttribute('cy', String(point.y));
        }
        edge.dot.setAttribute('opacity', String(opacity));
        edge.halo.setAttribute('opacity', String(opacity * 0.16));
      };

      const render = () => {
        const staticView = reducedMotion.matches;
        const phase = staticView
          ? selected
          : elapsed < LINK_TIME
            ? -1
            : Math.min(3, Math.floor((elapsed - LINK_TIME) / TRANSFER_TIME));
        const age = staticView
          ? 5000
          : elapsed - LINK_TIME - Math.max(0, phase) * TRANSFER_TIME;
        const transfer = ['reports', 'records', 'roles'][phase];
        const colors = ['#9cbef7', '#b9aadf', '#92cbaa'];
        const active: string[] = [];
        let title = 'Communities linked. Ready to share.';
        let description =
          'Five Discord servers. Five Roblox groups. One network.';
        let label = 'CONNECTED';
        for (const edge of Object.values(edges)) {
          edge.dot.setAttribute('opacity', '0');
          edge.halo.setAttribute('opacity', '0');
        }

        if (phase === -1 && !staticView) {
          title = 'Connecting your community network';
          description =
            'Four secondary communities link to the German Army hub.';
          label = 'LINKING';
        } else if (phase === 0) {
          title =
            age < 1600
              ? 'Heer submits an incident report'
              : age < 3800
                ? 'German Army shares the report with Feldjäger'
                : 'Feldjäger receives the incident report';
          description =
            'Heer → German Army → Feldjäger · Incident report #1042';
          label = '01 / REPORTS';
          active.push(age < 1600 ? 'heer' : age < 3800 ? 'main' : 'feldjager');
          if (!staticView) {
            packet('heer', age / 1600, true);
            packet('feldjager', (age - 2200) / 1600);
          }
        } else if (phase === 1) {
          title =
            age < 4000
              ? 'Army Training Command shares a training record'
              : 'The same record, available to linked staff';
          description =
            'Training Command → linked communities · Training result recorded';
          label = '02 / RECORDS';
          active.push(
            ...(age < 1600
              ? ['training']
              : age < 2800
                ? ['main', 'feldjager']
                : age < 4000
                  ? ['luftwaffe']
                  : ['heer']),
          );
          if (!staticView) {
            packet('training', (age - 400) / 1200, true);
            packet('peer-2', (age - 400) / 1200, true);
            packet('peer-1', (age - 1800) / 1000, true);
            packet('peer-0', (age - 3000) / 1000, true);
          }
        } else if (phase === 2) {
          title =
            age < 2200
              ? 'German Army distributes a shared role'
              : 'Staff roles aligned across the network';
          description = 'German Army → all four branches · Training staff role';
          label = '03 / ROLES';
          active.push(...(age < 2200 ? ['main'] : branches));
          if (!staticView) {
            branches.forEach((id) => packet(id, (age - 400) / 1800));
          }
        }

        // The wires stay connected throughout subsequent loops; only the first
        // entrance draws the links. Packets have a short receipt hold at the hub.
        for (const [name, edge] of Object.entries(edges)) {
          const linking = phase === -1 && !staticView;
          const lit =
            (phase === 1 &&
              (name.startsWith('peer-') || name === 'training')) ||
            (phase === 0 && ['heer', 'feldjager'].includes(name)) ||
            (phase === 2 && branches.includes(name));
          edge.lit.style.opacity = linking ? '0.6' : lit ? '0.55' : '0.15';
          edge.lit.style.strokeDasharray = String(edge.length);
          edge.lit.style.strokeDashoffset = String(
            linking
              ? edge.length *
                  (1 -
                    clamp(
                      (elapsed - (name.startsWith('peer-') ? 700 : 0)) / 1400,
                    ))
              : 0,
          );
        }
        const state = `${phase}:${title}:${active.join(',')}`;
        if (lastState !== state) {
          lastState = state;
          root.style.setProperty('--mesh-color', colors[phase] ?? '#86adf3');
          caption.textContent = title;
          detail.textContent = description;
          step.textContent = label;
          for (const [id, node] of Object.entries(nodes))
            node.toggleAttribute('data-active', active.includes(id));
          for (const button of buttons)
            button.setAttribute(
              'aria-pressed',
              String(button.dataset.meshTransfer === transfer),
            );
        }
      };

      const measure = () => {
        const bounds = diagram.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
        const box = (id: string) => {
          const rect = nodes[id].getBoundingClientRect();
          return {
            x: rect.left - bounds.left,
            y: rect.top - bounds.top,
            w: rect.width,
            h: rect.height,
          };
        };
        const main = box('main');
        const paths: Record<string, string> = {};
        for (const [index, id] of branches.entries()) {
          const target = box(id);
          if (narrow.matches) {
            const lane = 47 - index * 11;
            const start = main.y + main.h / 2;
            const end = target.y + target.h / 2;
            paths[id] =
              `M ${main.x} ${start} H ${lane + 10} Q ${lane} ${start} ${lane} ${start + 10} V ${end - 10} Q ${lane} ${end} ${lane + 10} ${end} H ${target.x}`;
          } else {
            const startX = main.x + (main.w * (index + 1)) / 5;
            const startY = main.y + main.h;
            const endX = target.x + target.w / 2;
            const middleY = (startY + target.y) / 2;
            paths[id] =
              `M ${startX} ${startY} C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${target.y}`;
          }
        }
        branches.slice(0, -1).forEach((id, index) => {
          const from = box(id);
          const to = box(branches[index + 1]);
          paths[`peer-${index}`] = narrow.matches
            ? `M ${from.x + from.w / 2} ${from.y + from.h} L ${to.x + to.w / 2} ${to.y}`
            : `M ${from.x + from.w} ${from.y + from.h / 2} L ${to.x} ${to.y + to.h / 2}`;
        });
        for (const [name, path] of Object.entries(paths)) {
          edges[name].base.setAttribute('d', path);
          edges[name].lit.setAttribute('d', path);
          edges[name].length = edges[name].base.getTotalLength();
        }
        render();
      };

      const tick = (now: number) => {
        if (last !== null) elapsed += Math.min(now - last, 80);
        // Preserve the completed links when the transfer sequence loops.
        if (elapsed >= CYCLE_TIME) elapsed = LINK_TIME;
        last = now;
        render();
        frame = window.requestAnimationFrame(tick);
      };
      const sync = () => {
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
        last = null;
        pause.disabled = reducedMotion.matches;
        pause.textContent = reducedMotion.matches
          ? 'Reduced motion'
          : paused
            ? 'Resume animation'
            : 'Pause animation';
        render();
        if (visible && !paused && !reducedMotion.matches && !document.hidden)
          frame = window.requestAnimationFrame(tick);
      };
      buttons.forEach((button, index) => {
        button.disabled = false;
        button.addEventListener('click', () => {
          selected = index;
          elapsed = LINK_TIME + index * TRANSFER_TIME;
          if (!reducedMotion.matches) paused = false;
          sync();
          announcement.textContent = `${button.textContent?.trim()}: ${detail.textContent}`;
        });
      });
      pause.addEventListener('click', () => {
        paused = !paused;
        sync();
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            sync();
          },
          { threshold: 0.15 },
        ).observe(diagram);
      } else visible = true;
      new ResizeObserver(measure).observe(diagram);
      document.addEventListener('visibilitychange', sync);
      reducedMotion.addEventListener('change', sync);
      document.fonts.ready.then(measure);
      measure();
      sync();
    });
}
