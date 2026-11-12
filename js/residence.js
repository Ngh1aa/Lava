/* Residence detail: one template for every residence, chosen by ?id=. Unknown id shows a
 * not-found state. Gallery, specs, generated floor plan, shortlist, booking and similar homes. */
(() => {
  'use strict';
  const L = window.Lava;
  const { $, $$ } = L;
  const detail = $('#detail');
  if (!detail) return;
  const id = new URLSearchParams(window.location.search).get('id') || '';
  const r = L.byId(id);

  // Breadcrumb returns to the list the visitor came from, filters included
  const back = L.store.note.get('list');
  if (back && /^residences\.html(\?[\w=,&%.-]*)?$/.test(back)) $('[data-list-link]').href = back;

  if (!r) {
    $('#missing-code').textContent = id || 'none';
    $('#missing').hidden = false;
    document.title = 'Residence not found: Lava';
    return;
  }
  const T = L.data.TYPES[r.type];
  document.title = `${L.title(r)}: Lava`;
  detail.hidden = false;

  /* ---------- Head, price, specs, actions ---------- */
  $('#d-title').textContent = L.title(r);
  $('#d-badge').outerHTML = L.badge(r.status);
  $('#d-price').textContent = L.price(r.price);
  const rows = [
    ['Type', T.name], ['Level', L.level(r)], ['Interior', `${r.interior} m²`], [T.outdoor, `${r.outdoor} m²`],
    ['Bedrooms', r.beds], ['Bathrooms', r.baths], ['Car spaces', r.cars], ['Aspect', r.aspect], ['Block', r.block],
  ];
  $('#d-spec').innerHTML = rows.map(([k, v]) => `<dt>${L.esc(k)}</dt><dd>${L.esc(v)}</dd>`).join('');

  const save = $('#d-save');
  save.dataset.save = r.id;
  $('#d-ask').href = `index.html?ask=${r.id}#contact`;
  const book = $('#d-book');
  if (r.status === 'sold') {
    // A sold home cannot be viewed: the button stays visible, locked, with the reason beside it
    const locked = document.createElement('button');
    locked.className = book.className;
    locked.type = 'button';
    locked.disabled = true;
    locked.id = 'd-book';
    locked.textContent = 'Book a viewing';
    locked.setAttribute('aria-describedby', 'd-lock');
    book.replaceWith(locked);
    $('#d-lock').hidden = false;
  } else {
    book.href = `book.html?id=${r.id}`;
  }

  /* ---------- Gallery ---------- */
  const pics = r.gallery.map((k) => L.data.IMG[k]);
  const stage = $('#gal-img');
  const thumbs = $('#gal-thumbs');
  let cur = 0;
  thumbs.innerHTML = pics.map((p, i) => `<button class="gallery__thumb" type="button" data-thumb="${i}" aria-label="Photo ${i + 1} of ${pics.length}" aria-pressed="${i === 0}"><img src="${p.src}" width="${p.w}" height="${p.h}" alt="" loading="lazy"></button>`).join('');
  const show = (i) => {
    cur = (i + pics.length) % pics.length;
    const p = pics[cur];
    const swap = () => {
      stage.src = p.src; stage.width = p.w; stage.height = p.h; stage.alt = p.alt;
    };
    if (L.reduceMotion || stage.getAttribute('src') === p.src) swap();
    else stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-out' }).finished.then(() => {
      swap();
      stage.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
    });
    $('#gal-pos').textContent = `${cur + 1} / ${pics.length}`;
    $$('[data-thumb]', thumbs).forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.thumb) === cur)));
  };
  stage.src = pics[0].src; stage.width = pics[0].w; stage.height = pics[0].h; stage.alt = pics[0].alt;
  $('#gal-pos').textContent = `1 / ${pics.length}`;
  thumbs.addEventListener('click', (e) => { const b = e.target.closest('[data-thumb]'); if (b) show(Number(b.dataset.thumb)); });
  $$('[data-gal]').forEach((b) => b.addEventListener('click', () => show(cur + Number(b.dataset.gal))));
  $('.gallery').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
  });

  /* ---------- Floor plan (generated from the residence's size and room count) ---------- */
  const VB = 800, PAD = 20;
  const W = Math.sqrt(r.interior * 1.3);
  const Dp = r.interior / W;
  const tD = Dp * 0.45, bD = Dp - tD;
  const oD = Math.min(r.outdoor / W, Dp * 0.5);
  const S = (VB - PAD * 2) / W;
  const rooms = [];
  const bw = W / r.beds;
  for (let i = 0; i < r.beds; i += 1) {
    rooms.push({ name: i === 0 ? 'Main bedroom' : `Bedroom ${i + 1}`, x: i * bw, y: 0, w: bw, h: tD });
    if (i < r.baths - 1) rooms.push({ name: i === 0 ? 'Ensuite' : `Ensuite ${i + 1}`, x: i * bw + bw * 0.62, y: 0, w: bw * 0.38, h: tD * 0.5, inset: true });
  }
  const bathW = Math.min(2.6, W * 0.22), kitW = Math.min(3.4, W * 0.28);
  rooms.push({ name: 'Living and dining', x: 0, y: tD, w: W - bathW - kitW, h: bD });
  rooms.push({ name: 'Kitchen', x: W - bathW - kitW, y: tD, w: kitW, h: bD });
  rooms.push({ name: 'Bathroom', x: W - bathW, y: tD, w: bathW, h: bD * 0.55 });
  rooms.push({ name: 'Laundry', x: W - bathW, y: tD + bD * 0.55, w: bathW, h: bD * 0.45 });
  const out = { name: T.outdoor, x: 0, y: Dp + 0.6, w: W, h: oD, area: r.outdoor };
  const H = PAD * 2 + (out.y + out.h) * S + 44;
  const px = (v) => (PAD + v * S).toFixed(1);
  const dim = (m) => m.toFixed(1);
  const all = rooms.concat(out);
  let svg = `<svg viewBox="0 0 ${VB} ${H.toFixed(0)}" role="img" aria-labelledby="plan-cap">`;
  svg += `<rect class="fp-out" x="${px(out.x)}" y="${px(out.y)}" width="${(out.w * S).toFixed(1)}" height="${(out.h * S).toFixed(1)}"/>`;
  if (r.type === 'penthouse') svg += `<rect class="fp-pool" x="${px(out.x + out.w * 0.62)}" y="${px(out.y + out.h * 0.2)}" width="${(out.w * 0.3 * S).toFixed(1)}" height="${(out.h * 0.6 * S).toFixed(1)}"/>`;
  rooms.forEach((m) => { svg += `<rect class="fp-room${m.inset ? ' fp-wet' : ''}" x="${px(m.x)}" y="${px(m.y)}" width="${(m.w * S).toFixed(1)}" height="${(m.h * S).toFixed(1)}"/>`; });
  svg += `<rect class="fp-wall" x="${px(0)}" y="${px(0)}" width="${(W * S).toFixed(1)}" height="${(Dp * S).toFixed(1)}"/>`;
  all.forEach((m, i) => {
    const cx = px(m.x + m.w / 2), cy = px(m.y + m.h / 2);
    svg += `<g class="fp-mark"><circle cx="${cx}" cy="${cy}"/><text x="${cx}" y="${cy}" dy="0.35em" text-anchor="middle">${i + 1}</text></g>`;
  });
  const bar = 5 * S;
  const by = H - 24;
  svg += `<path class="fp-scale" d="M${PAD} ${by - 6}v6h${bar.toFixed(1)}v-6"/><text class="fp-scale-t" x="${(PAD + bar + 10).toFixed(1)}" y="${by}" dy="0.1em">5 m</text>`;
  svg += '</svg>';
  $('#d-plan').innerHTML = `${svg}<figcaption class="ds-visually-hidden" id="plan-cap">Floor plan of ${L.esc(L.title(r))}, ${r.interior} m² inside plus ${r.outdoor} m² ${L.esc(T.outdoor.toLowerCase())}</figcaption>`;
  $('#d-rooms').innerHTML = all.map((m, i) => `<li><b>${i + 1}</b><span>${m.name}</span><span class="rooms__dim">${m.area ? `${m.area} m²` : `${dim(m.w)} × ${dim(m.h)} m`}</span></li>`).join('');
  // Keep marker numbers the same on-screen size whatever the plan's rendered width
  const planSvg = $('#d-plan svg');
  const fit = () => { const w = planSvg.getBoundingClientRect().width; if (w) planSvg.style.setProperty('--k', String(VB / w)); };
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(planSvg);
  fit();

  /* ---------- Similar residences ---------- */
  const similar = L.data.residences.filter((x) => x.id !== r.id)
    .sort((a, b) => (a.type === r.type ? 0 : 1) - (b.type === r.type ? 0 : 1)
      || (a.status === 'sold') - (b.status === 'sold')
      || Math.abs(a.price - r.price) - Math.abs(b.price - r.price))
    .slice(0, 3);
  $('#d-similar').innerHTML = similar.map((x) => `<li>${L.card(x, 3)}</li>`).join('');
  L.sync();
})();
