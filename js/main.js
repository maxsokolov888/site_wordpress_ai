(() => {
  const menu = document.querySelector('.menu');
  if (menu) {
    let button = document.querySelector('.menu-button');
    if (!button) {
      button = document.createElement('button');
      button.className = 'menu-button';
      button.type = 'button';
      button.textContent = 'Меню';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', menu.id || 'site-menu');
      if (!menu.id) menu.id = 'site-menu';
      menu.before(button);
    }
    button.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      menu.querySelectorAll('.menu-group').forEach((group) => { group.open = false; });
    }));
  }

  const desktopMenuPointer = window.matchMedia('(min-width: 641px) and (hover: hover)');
  document.querySelectorAll('.menu-group').forEach((group) => {
    group.querySelector('summary')?.addEventListener('click', (event) => {
      if (event.detail > 0 && desktopMenuPointer.matches && group.open) event.preventDefault();
    });
    group.addEventListener('pointerenter', () => {
      if (desktopMenuPointer.matches) group.open = true;
    });
    group.addEventListener('pointerleave', () => {
      if (desktopMenuPointer.matches) group.open = false;
    });
    group.addEventListener('focusout', (event) => {
      if (!group.contains(event.relatedTarget)) group.open = false;
    });
    group.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !group.open) return;
      group.open = false;
      group.querySelector('summary')?.focus();
    });
  });

  document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll('[data-tab]')];
    const panels = [...document.querySelectorAll('[data-panel]')];
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
        panel.classList.toggle('active', !panel.hidden);
      });
    }));
    tablist.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || !tabs.length) return;
      event.preventDefault();
      const selectedIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true'));
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextTab = tabs[(selectedIndex + direction + tabs.length) % tabs.length];
      nextTab.focus();
      nextTab.click();
    });
  });

  document.querySelectorAll('.filters').forEach((filterBar) => {
    const buttons = [...filterBar.querySelectorAll('button.filter')];
    const cards = [...(filterBar.nextElementSibling?.querySelectorAll('.card') || [])];
    if (!buttons.length || !cards.length) return;
    buttons.forEach((button) => button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      const selected = button.textContent.trim().toLocaleLowerCase('ru');
      cards.forEach((card) => {
        const content = card.textContent.toLocaleLowerCase('ru');
        const category = selected === 'гид по районам' ? 'гид' : selected;
        card.hidden = selected !== 'все' && !content.includes(category);
      });
    }));
  });

  const gallery = document.querySelector('.gallery');
  const galleryMain = gallery?.querySelector('.gallery-main');
  if (galleryMain) {
    const galleryTabs = [...gallery.querySelectorAll('.gallery-tab[data-view]')];
    const labels = { exterior: 'Фасад резиденции', terrace: 'Терраса и бассейн', living: 'Гостиная резиденции', spa: 'Домашний спа-комплекс' };
    galleryTabs.forEach((tab) => tab.addEventListener('click', () => {
      galleryMain.dataset.view = tab.dataset.view;
      galleryMain.setAttribute('aria-label', labels[tab.dataset.view] || 'Фотография объекта');
      galleryMain.src = tab.dataset.image || galleryMain.src;
      galleryMain.alt = labels[tab.dataset.view] || 'Фотография объекта';
      galleryTabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
    }));
    gallery.querySelector('[role="tablist"]')?.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || !galleryTabs.length) return;
      event.preventDefault();
      const selectedIndex = Math.max(0, galleryTabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true'));
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextTab = galleryTabs[(selectedIndex + direction + galleryTabs.length) % galleryTabs.length];
      nextTab.focus();
      nextTab.click();
    });
  }

  const catalogFilters = document.querySelector('.catalog-filters');
  if (catalogFilters) {
    catalogFilters.addEventListener('submit', (event) => {
      event.preventDefault();
      const [type, area, rooms] = catalogFilters.querySelectorAll('select');
      const [minPrice, maxPrice] = catalogFilters.querySelectorAll('input[type="number"]');
      document.querySelectorAll('.catalog-grid .card').forEach((card) => {
        const text = card.textContent.toLocaleLowerCase('ru');
        const price = Number(text.match(/(\d+)\s*млн/)?.[1] || 0);
        const bedroomCount = Number(text.match(/(\d+)\s*спален/)?.[1] || 0);
        const roomCount = Number(rooms?.value.match(/\d+/)?.[0] || 0);
        const matches = (!type?.value || text.includes(type.value.toLocaleLowerCase('ru')))
          && (!area?.value || text.includes(area.value.toLocaleLowerCase('ru')))
          && (!minPrice?.value || price >= Number(minPrice.value))
          && (!maxPrice?.value || price <= Number(maxPrice.value))
          && (!roomCount || bedroomCount >= roomCount);
        card.hidden = !matches;
      });
    });
  }
})();
