/* My viewings: every booking made in this tab. Reschedule goes back into the booking flow;
 * cancel asks for confirmation first, then marks the booking cancelled. */
(() => {
  'use strict';
  const L = window.Lava;
  const { $ } = L;
  const list = $('#vw-list');
  if (!list) return;

  const render = () => {
    const all = L.store.bookings.list().slice().sort((a, b) => {
      if (a.status !== b.status) return a.status === 'upcoming' ? -1 : 1;
      return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    });
    const upcoming = all.filter((b) => b.status === 'upcoming').length;
    $('#vw-empty').hidden = all.length > 0;
    $('#vw-actions').hidden = all.length === 0;
    list.hidden = all.length === 0;
    $('#vw-count').hidden = all.length === 0;
    $('#vw-count').textContent = L.plural(upcoming, 'upcoming viewing');
    list.innerHTML = all.map((b) => {
      const p = L.dateParts(b.date);
      const res = b.ids.map(L.byId).filter(Boolean);
      const off = b.status !== 'upcoming';
      return `<li class="vw${off ? ' is-cancelled' : ''}" data-ref="${b.ref}">
        <div class="vw__date" aria-hidden="true"><span>${p.wd}</span><b>${p.day}</b><span>${p.mon}</span></div>
        <div class="vw__body">
          <div class="vw__head">
            <h2 class="vw__title">${L.dateLong(b.date)}, ${L.time(b.time)}</h2>
            ${off ? '<span class="ds-badge ds-badge--neutral"><svg class="ds-icon ds-icon--sm" aria-hidden="true"><use href="#ds-i-x"/></svg>Cancelled</span>' : '<span class="ds-badge ds-badge--success"><svg class="ds-icon ds-icon--sm" aria-hidden="true"><use href="#app-i-calendar"/></svg>Upcoming</span>'}
          </div>
          <dl class="vw__meta">
            <div><dt>Residences</dt><dd>${res.map((r) => `<a href="residence.html?id=${r.id}">${L.esc(r.code)}</a>`).join(', ')}</dd></div>
            <div><dt>Reference</dt><dd class="vw__ref">${L.esc(b.ref)}</dd></div>
            <div><dt>Name</dt><dd>${L.esc(b.name)}</dd></div>
          </dl>
          ${off ? `<div class="vw__actions"><a class="ds-button ds-button--secondary" href="book.html?ids=${b.ids.join(',')}">Book again</a></div>` : `<div class="vw__actions">
            <a class="ds-button ds-button--secondary" href="book.html?reschedule=${encodeURIComponent(b.ref)}">Reschedule</a>
            <button class="ds-button ds-button--tertiary" type="button" data-cancel="${L.esc(b.ref)}">Cancel viewing</button>
          </div>`}
        </div>
      </li>`;
    }).join('');
  };

  list.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-cancel]');
    if (!btn) return;
    const b = L.store.bookings.get(btn.dataset.cancel);
    if (!b) return;
    const codes = b.ids.map(L.byId).filter(Boolean).map((r) => r.code).join(', ');
    const ok = await L.confirm({
      heading: 'Cancel viewing?',
      body: `<dl class="dlg-list"><dt>When</dt><dd>${L.dateLong(b.date)}, ${L.time(b.time)}</dd><dt>Residences</dt><dd>${L.esc(codes)}</dd><dt>Reference</dt><dd>${L.esc(b.ref)}</dd></dl>`,
      confirm: 'Cancel viewing',
      cancel: 'Keep viewing',
    });
    if (!ok) return;
    L.store.bookings.patch(b.ref, { status: 'cancelled' });
    L.toast(`Viewing ${b.ref} cancelled`);
    const row = list.querySelector(`[data-ref="${b.ref}"]`);
    if (row) { row.setAttribute('tabindex', '-1'); row.focus(); }
  });

  document.addEventListener('lava:change', render);
  render();
})();
