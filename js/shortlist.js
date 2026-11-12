/* Shortlist: saved residences side by side. Remove one (with Undo), clear all (confirmed). */
(() => {
  'use strict';
  const L = window.Lava;
  const { $, $$ } = L;
  const box = $('#compare');
  if (!box) return;

  const ROWS = [
    ['Price', (r) => L.price(r.price)],
    ['Type', (r) => L.data.TYPES[r.type].short],
    ['Level', (r) => L.level(r)],
    ['Interior', (r) => `${r.interior} m²`],
    ['Outdoor', (r) => `${r.outdoor} m² ${L.data.TYPES[r.type].outdoor.toLowerCase()}`],
    ['Bedrooms', (r) => r.beds],
    ['Bathrooms', (r) => r.baths],
    ['Car spaces', (r) => r.cars],
    ['Aspect', (r) => r.aspect],
  ];

  const render = () => {
    const list = L.store.shortlist.list().map(L.byId);
    const n = list.length;
    $('#sl-empty').hidden = n > 0;
    $('#sl-actions').hidden = n === 0;
    box.hidden = n === 0;
    $('#sl-count').hidden = n === 0;
    $('#sl-count').textContent = `${L.plural(n, 'residence')} saved`;
    box.style.setProperty('--n', String(Math.min(Math.max(n, 2), 4)));
    box.innerHTML = list.map((r) => `
      <article class="cmp" data-id="${r.id}" aria-labelledby="cmp-${r.id}">
        <a class="cmp__media" href="residence.html?id=${r.id}" tabindex="-1" aria-hidden="true">${L.img(r.gallery[0])}</a>
        <div class="cmp__head"><h2 class="cmp__title" id="cmp-${r.id}"><a href="residence.html?id=${r.id}">${L.title(r)}</a></h2>${L.badge(r.status)}</div>
        ${ROWS.map(([k, f]) => `<div class="cmp__row"><span class="cmp__k">${k}</span><span class="cmp__v">${L.esc(f(r))}</span></div>`).join('')}
        <div class="cmp__actions">
          ${r.status === 'sold' ? '' : `<a class="ds-button ds-button--secondary" href="book.html?id=${r.id}">Book a viewing</a>`}
          <button class="ds-button ds-button--tertiary" type="button" data-remove="${r.id}" aria-label="Remove ${r.code} from shortlist">Remove</button>
        </div>
      </article>`).join('');
    const bookable = list.filter((r) => r.status !== 'sold').slice(0, L.data.VIEWING.maxResidences);
    $('#sl-book').href = bookable.length ? `book.html?ids=${bookable.map((r) => r.id).join(',')}` : 'book.html';
  };

  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]');
    if (!b) return;
    const r = L.byId(b.dataset.remove);
    const before = L.store.shortlist.list();
    const idx = before.indexOf(r.id);
    L.store.shortlist.remove(r.id);
    L.toast(`${r.code} removed from your shortlist`, { label: 'Undo', run: () => L.store.shortlist.set(before) });
    // Keep focus in the list: next item's Remove, or the page heading when empty
    const next = $$('[data-remove]')[Math.min(idx, $$('[data-remove]').length - 1)];
    (next || $('#sl-empty a') || $('h1')).focus();
  });

  $('#sl-clear').addEventListener('click', async () => {
    const n = L.store.shortlist.list().length;
    const ok = await L.confirm({
      heading: 'Clear shortlist?',
      body: `<p>${L.plural(n, 'residence')} will be removed from your shortlist.</p>`,
      confirm: 'Clear shortlist',
    });
    if (!ok) return;
    L.store.shortlist.clear();
    L.toast('Shortlist cleared');
    $('#sl-empty a').focus();
  });

  document.addEventListener('lava:change', render);
  render();
})();
