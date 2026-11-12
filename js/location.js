/* Location: the map dots and the list select the same place. */
(() => {
  'use strict';
  const L = window.Lava;
  const { $, $$ } = L;
  const ctrls = $$('[data-place]');
  if (!ctrls.length) return;
  const PLACES = [
    ['Beach', 'A long sandy beach with lifeguards in season and a coastal path back to the garden loop.', ['4 min by car', '18 min on foot']],
    ['Seafood market', 'Morning boats unload here; open from 5am with a row of small restaurants behind the stalls.', ['6 min on foot', 'Daily from 5am']],
    ['Bilingual school', 'Kindergarten to year 12, with a school bus stop at the Lava entrance.', ['8 min by car', 'Bus stop at the gate']],
    ['Supermarket', 'A full supermarket with a pharmacy and a bakery on the ground floor.', ['9 min on foot', '7am–10pm daily']],
    ['General hospital', 'Emergency department open 24 hours, plus outpatient clinics.', ['10 min by car', 'Open 24 hours']],
    ['City centre', 'Offices, the night market and the riverside restaurants.', ['15 min by car', '25 min by bus']],
  ];
  const pick = (i) => {
    ctrls.forEach((c) => c.setAttribute('aria-pressed', String(Number(c.dataset.place) === i)));
    const [name, desc, meta] = PLACES[i];
    $('#place-name').textContent = name;
    $('#place-desc').textContent = desc;
    $('#place-meta').replaceChildren(...meta.map((m) => Object.assign(document.createElement('span'), { textContent: m })));
    L.enter($('.amen__detail'), 8);
  };
  ctrls.forEach((c) => c.addEventListener('click', () => pick(Number(c.dataset.place))));
})();
