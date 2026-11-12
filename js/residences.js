/* Residences listing: filters, sort, count, empty state. Filter state lives in the URL query so
 * Back from a residence returns to the same list, and is remembered for the residence breadcrumb. */
(() => {
  'use strict';
  const L = window.Lava;
  const { $, $$ } = L;
  const form = $('#filters');
  const grid = $('#res-grid');
  if (!form || !grid) return;
  const sortSel = $('#sort');
  const count = $('#res-count');
  const empty = $('#res-empty');
  const toggle = $('.filters-toggle');
  const all = L.data.residences;
  const STATUSES = ['available', 'reserved', 'sold'];
  const DEFAULT_SORT = 'price-asc';

  // Counts beside each availability box
  STATUSES.forEach((st) => { $(`[data-status-count="${st}"]`).textContent = String(all.filter((r) => r.status === st).length); });

  const readForm = () => {
    const fd = new FormData(form);
    return { type: fd.get('type') || '', beds: fd.get('beds') || '', price: fd.get('price') || '', status: fd.getAll('status'), sort: sortSel.value };
  };
  const writeForm = (st) => {
    ['type', 'beds', 'price'].forEach((k) => {
      const input = $(`input[name="${k}"][value="${st[k]}"]`, form) || $(`input[name="${k}"][value=""]`, form);
      input.checked = true;
    });
    $$('input[name="status"]', form).forEach((c) => { c.checked = st.status.includes(c.value); });
    sortSel.value = [...sortSel.options].some((o) => o.value === st.sort) ? st.sort : DEFAULT_SORT;
  };
  const fromURL = () => {
    const q = new URLSearchParams(window.location.search);
    const status = q.get('status');
    return {
      type: q.get('type') || '', beds: q.get('beds') || '', price: q.get('price') || '',
      status: status === null ? STATUSES.slice() : status.split(',').filter((s) => STATUSES.includes(s)),
      sort: q.get('sort') || DEFAULT_SORT,
    };
  };
  const toQuery = (st) => {
    const q = new URLSearchParams();
    if (st.type) q.set('type', st.type);
    if (st.beds) q.set('beds', st.beds);
    if (st.price) q.set('price', st.price);
    if (st.status.length !== STATUSES.length) q.set('status', st.status.join(','));
    if (st.sort !== DEFAULT_SORT) q.set('sort', st.sort);
    const s = q.toString();
    return s ? `?${s}` : '';
  };
  const activeCount = (st) => ['type', 'beds', 'price'].filter((k) => st[k]).length + (st.status.length !== STATUSES.length ? 1 : 0);

  const apply = (st) => {
    const band = L.data.PRICE_BANDS.find((b) => b.id === st.price);
    const list = all.filter((r) => (!st.type || r.type === st.type)
      && (!st.beds || r.beds === Number(st.beds))
      && (!band || (r.price >= band.min && r.price < band.max))
      && st.status.includes(r.status));
    const sorters = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'size-desc': (a, b) => b.interior - a.interior,
      code: (a, b) => a.code.localeCompare(b.code),
    };
    list.sort(sorters[st.sort] || sorters[DEFAULT_SORT]);
    return list;
  };

  const render = (animate) => {
    const st = readForm();
    const list = apply(st);
    grid.innerHTML = list.map((r) => `<li>${L.card(r)}</li>`).join('');
    grid.hidden = list.length === 0;
    empty.hidden = list.length !== 0;
    count.textContent = list.length === all.length ? L.plural(all.length, 'residence') : `${list.length} of ${L.plural(all.length, 'residence')}`;
    const n = activeCount(st);
    const badge = $('[data-active-filters]');
    badge.textContent = String(n);
    badge.hidden = n === 0;
    const q = toQuery(st);
    history.replaceState(null, '', `residences.html${q}`);
    L.store.note.set('list', `residences.html${q}`);
    if (animate) L.enter(list.length ? grid : empty, 8);
  };

  form.addEventListener('change', () => render(true));
  form.addEventListener('submit', (e) => e.preventDefault());
  sortSel.addEventListener('change', () => render(true));
  $$('[data-reset-filters]').forEach((b) => b.addEventListener('click', () => {
    writeForm({ type: '', beds: '', price: '', status: STATUSES.slice(), sort: sortSel.value });
    render(true);
    $('input[name="type"]', form).focus();
  }));

  // Filters fold away under a button on narrow screens
  const mq = window.matchMedia('(max-width: 1023px)');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    form.hidden = mq.matches && !open;
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  mq.addEventListener('change', () => setOpen(false));
  setOpen(false);

  writeForm(fromURL());
  render(false);
})();
