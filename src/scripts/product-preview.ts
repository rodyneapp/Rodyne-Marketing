const preview = document.querySelector<HTMLElement>('[data-product-preview]');

if (preview) {
  const tabs = Array.from(
    preview.querySelectorAll<HTMLButtonElement>('[data-preview-step]'),
  );
  const panels = Array.from(
    preview.querySelectorAll<HTMLElement>('[data-preview-panel]'),
  );
  const members = Array.from(
    preview.querySelectorAll<HTMLButtonElement>('[data-preview-member]'),
  );
  const search = preview.querySelector<HTMLInputElement>(
    '[data-preview-search]',
  );
  const announcement = preview.querySelector<HTMLElement>(
    '[data-preview-announcement]',
  );
  let selected = members[0];

  const setStep = (step: number, focus = false) => {
    preview.dataset.step = String(step);
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === step));
      tab.tabIndex = index === step ? 0 : -1;
    });
    panels.forEach((panel, index) => {
      panel.hidden = index !== step;
    });
    members.forEach((member) => {
      const role = member.querySelector<HTMLElement>('[data-member-role]');
      if (role)
        role.textContent =
          step === 2 && member === selected
            ? (member.dataset.next ?? '')
            : (member.dataset.role ?? '');
    });
    if (focus) tabs[step]?.focus();
  };

  const openPanel = (step: number) => {
    setStep(step);
    panels[step]?.focus({ preventScroll: true });
    panels[step]?.scrollIntoView({ block: 'nearest' });
  };

  const selectMember = (member: HTMLButtonElement) => {
    selected = member;
    members.forEach((row) =>
      row.setAttribute('aria-pressed', String(row === member)),
    );
    const fields = {
      name: member.dataset.name,
      role: member.dataset.role,
      next: member.dataset.next,
      id: member.dataset.robloxId,
    };
    for (const [key, value] of Object.entries(fields)) {
      preview
        .querySelectorAll<HTMLElement>(`[data-selected-${key}]`)
        .forEach((node) => {
          node.textContent = value ?? '';
        });
    }
    const avatar = member.querySelector('img');
    if (avatar) {
      preview
        .querySelectorAll<HTMLImageElement>('[data-selected-avatar]')
        .forEach((img) => {
          img.src = avatar.currentSrc || avatar.src;
          img.removeAttribute('srcset');
        });
    }
    setStep(0);
    if (announcement)
      announcement.textContent = `${member.dataset.name} selected. Review their sample promotion when ready.`;
  };

  const filterMembers = () => {
    const query = search?.value.trim().toLowerCase() ?? '';
    let count = 0;
    members.forEach((member) => {
      const matches = `${member.dataset.name} ${member.dataset.robloxId}`
        .toLowerCase()
        .includes(query);
      member.hidden = !matches;
      if (matches) count += 1;
    });
    const empty = preview.querySelector<HTMLElement>('[data-preview-empty]');
    if (empty) empty.hidden = count > 0;
    const counter = preview.querySelector<HTMLElement>('[data-preview-count]');
    if (counter)
      counter.textContent = `${count} ${count === 1 ? 'member' : 'members'}`;
  };

  members.forEach((member) =>
    member.addEventListener('click', () => selectMember(member)),
  );
  search?.addEventListener('input', filterMembers);
  search?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const first = members.find((member) => !member.hidden);
    if (first) {
      selectMember(first);
      first.focus();
    }
  });
  preview
    .querySelector('[data-preview-clear]')
    ?.addEventListener('click', () => {
      if (search) {
        search.value = '';
        filterMembers();
        search.focus();
      }
    });

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setStep(index));
    tab.addEventListener('keydown', (event) => {
      const next =
        event.key === 'ArrowRight'
          ? (index + 1) % tabs.length
          : event.key === 'ArrowLeft'
            ? (index + tabs.length - 1) % tabs.length
            : event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? tabs.length - 1
                : null;
      if (next !== null) {
        event.preventDefault();
        setStep(next, true);
      }
    });
  });

  preview
    .querySelector('[data-preview-review]')
    ?.addEventListener('click', () => openPanel(1));
  preview
    .querySelector('[data-preview-approve]')
    ?.addEventListener('click', () => {
      openPanel(2);
      if (announcement)
        announcement.textContent = `Sample promotion complete for ${selected.dataset.name}. Roblox rank and Discord role confirmed. No real accounts were changed.`;
    });
  preview
    .querySelector('[data-preview-reset]')
    ?.addEventListener('click', () => {
      if (search) {
        search.value = '';
        filterMembers();
      }
      selectMember(members[0]);
      search?.focus();
    });
  preview.dataset.ready = 'true';
}
