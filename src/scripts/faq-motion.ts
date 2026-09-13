const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

document
  .querySelectorAll<HTMLDetailsElement>('.faq-list details')
  .forEach((details) => {
    const summary = details.querySelector('summary')!;
    const content = details.querySelector('div')!;
    let animation: Animation | null = null;
    let contentAnimation: Animation | null = null;
    let expanded = details.open;

    const settle = () => {
      animation?.cancel();
      animation = null;
      contentAnimation?.cancel();
      contentAnimation = null;
      details.open = expanded;
      details.style.removeProperty('height');
      details.style.removeProperty('overflow');
      summary.setAttribute('aria-expanded', String(expanded));
    };

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      const from = details.getBoundingClientRect().height;
      const wasOpen = details.open;
      const contentOpacity = getComputedStyle(content).opacity;
      const contentTranslate = getComputedStyle(content).translate;
      expanded = !expanded;
      summary.setAttribute('aria-expanded', String(expanded));
      animation?.cancel();
      contentAnimation?.cancel();
      if (preference.matches) {
        settle();
        return;
      }
      details.open = true;
      details.style.overflow = 'hidden';
      const border =
        parseFloat(getComputedStyle(details).borderBottomWidth) || 0;
      const to =
        summary.getBoundingClientRect().height +
        border +
        (expanded ? content.getBoundingClientRect().height : 0);
      animation = details.animate(
        { height: [`${from}px`, `${to}px`] },
        {
          duration: expanded ? 340 : 240,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
      );
      contentAnimation = content.animate(
        [
          {
            opacity: wasOpen ? contentOpacity : 0,
            translate: wasOpen ? contentTranslate : '0 -4px',
          },
          { opacity: expanded ? 1 : 0, translate: expanded ? '0 0' : '0 -4px' },
        ],
        { duration: expanded ? 280 : 180, easing: 'ease-out', fill: 'both' },
      );
      animation.onfinish = settle;
    });
    window.addEventListener('resize', settle, { passive: true });
    preference.addEventListener('change', settle);
  });
