const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

document
  .querySelectorAll<HTMLDetailsElement>('.faq-list details')
  .forEach((details) => {
    const summary = details.querySelector('summary')!;
    const content = details.querySelector('div')!;
    let animation: Animation | null = null;
    let expanded = details.open;

    const settle = () => {
      animation?.cancel();
      animation = null;
      details.open = expanded;
      details.style.removeProperty('height');
      details.style.removeProperty('overflow');
      summary.setAttribute('aria-expanded', String(expanded));
    };

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      const from = details.getBoundingClientRect().height;
      expanded = !expanded;
      summary.setAttribute('aria-expanded', String(expanded));
      animation?.cancel();
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
          duration: expanded ? 260 : 200,
          easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
        },
      );
      animation.onfinish = settle;
    });
    window.addEventListener('resize', settle, { passive: true });
    preference.addEventListener('change', settle);
  });
