/* Book a private viewing: residences, day and time, details, review, confirmation.
 *   book.html                 new booking (restores the draft kept in sessionStorage)
 *   book.html?id=b-207        new booking with one residence ticked
 *   book.html?ids=a,b,c       new booking from the shortlist
 *   book.html?reschedule=REF  change the day and time of an existing booking
 * Confirming is simulated: 700 ms, fails when offline, then saves to sessionStorage. */
(() => {
  'use strict';
  const L = window.Lava;
  const { $, $$ } = L;
  const form = $('#book-form');
  if (!form) return;
  const D = L.data;
  const q = new URLSearchParams(window.location.search);
  const rescheduleRef = q.get('reschedule');
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^0\d{9}$/;
  const digits = (v) => v.replace(/[\s.-]/g, '');

  const steps = $$('.step', form);
  const marks = $$('.steps li', form);
  const netErr = $('[data-net-error]', form);
  const done = $('#book-done');
  const f = { name: $('#v-name'), email: $('#v-email'), phone: $('#v-phone'), note: $('#v-note') };
  const days = L.viewingDays();
  const bookable = D.residences.filter((r) => r.status !== 'sold');

  /* ---------- State ---------- */
  let original = null; // booking being rescheduled
  const st = { ids: [], date: '', time: '', step: 1 };

  if (rescheduleRef) {
    original = L.store.bookings.get(rescheduleRef);
    if (!original || original.status !== 'upcoming') {
      form.hidden = true;
      $('.book__side').hidden = true;
      $('#book').classList.add('book--solo');
      $('#book-missing').hidden = false;
      $('#book-title').textContent = 'Reschedule viewing';
      document.title = 'Reschedule viewing: Lava';
      return;
    }
    Object.assign(st, { ids: original.ids.slice(), date: original.date, time: '' });
    ['name', 'email', 'phone', 'note'].forEach((k) => { f[k].value = original[k] || ''; });
    $('#book-title').textContent = 'Reschedule viewing';
    document.title = 'Reschedule viewing: Lava';
    $('#book-submit').textContent = 'Confirm new time';
  } else {
    const draft = L.store.draft.get('book') || {};
    ['name', 'email', 'phone', 'note'].forEach((k) => { f[k].value = draft[k] || ''; });
    if (draft.date && days.includes(draft.date)) { st.date = draft.date; st.time = draft.time || ''; }
    const fromQuery = (q.get('ids') || q.get('id') || '').split(',').map((x) => L.byId(x)).filter((r) => r && r.status !== 'sold').map((r) => r.id);
    st.ids = (fromQuery.length ? fromQuery : (draft.ids || [])).filter((id) => bookable.some((r) => r.id === id)).slice(0, D.VIEWING.maxResidences);
  }
  if (!st.date || !days.includes(st.date)) st.date = days.find((d) => D.VIEWING.times.some((t) => !L.slotTaken(d, t, rescheduleRef))) || days[0];
  if (st.time && L.slotTaken(st.date, st.time, rescheduleRef)) st.time = '';

  const saveDraft = () => {
    if (original) return;
    L.store.draft.set('book', { ids: st.ids, date: st.date, time: st.time, name: f.name.value, email: f.email.value, phone: f.phone.value, note: f.note.value });
  };

  /* ---------- Step 1: residences ---------- */
  const shortlisted = L.store.shortlist.list();
  const ordered = bookable.slice().sort((a, b) => (shortlisted.includes(b.id) - shortlisted.includes(a.id)) || a.code.localeCompare(b.code));
  $('#pick-list').innerHTML = ordered.map((r) => `
    <li><label class="pick">
      <input type="checkbox" name="res" value="${r.id}">
      <span class="ds-check__box" aria-hidden="true"><svg class="ds-icon" aria-hidden="true"><use href="#app-i-check"/></svg></span>
      <span class="pick__img">${L.img(r.gallery[0])}</span>
      <span class="pick__body"><b>${L.title(r)}</b><span>${L.typeLine(r)}</span></span>
      <span class="pick__end"><span class="pick__price">${L.price(r.price)}</span>${r.status === 'reserved' ? L.badge('reserved') : ''}</span>
    </label></li>`).join('');
  const boxes = $$('input[name="res"]', form);
  const syncPicks = () => {
    boxes.forEach((b) => { b.checked = st.ids.includes(b.value); });
    const full = st.ids.length >= D.VIEWING.maxResidences;
    boxes.forEach((b) => { b.disabled = full && !b.checked; });
    $('#pick-max').hidden = !full;
  };
  boxes.forEach((b) => b.addEventListener('change', () => {
    st.ids = b.checked ? st.ids.concat(b.value) : st.ids.filter((x) => x !== b.value);
    if (st.ids.length) $('#pick-err').hidden = true;
    syncPicks(); saveDraft(); renderSide();
  }));

  /* ---------- Step 2: day and time ---------- */
  const freeTimes = (d) => D.VIEWING.times.filter((t) => !L.slotTaken(d, t, rescheduleRef));
  const renderDays = () => {
    $('#days').innerHTML = days.map((d) => {
      const p = L.dateParts(d);
      const full = freeTimes(d).length === 0;
      return `<label class="day${full ? ' is-full' : ''}"><input type="radio" name="day" value="${d}"${d === st.date ? ' checked' : ''}${full ? ' disabled' : ''} aria-label="${L.dateLong(d)}${full ? ', fully booked' : ''}"><span class="day__wd">${p.wd}</span><span class="day__d">${p.day}</span><span class="day__m">${full ? 'Full' : p.mon}</span></label>`;
    }).join('');
  };
  const renderTimes = () => {
    $('#times').innerHTML = D.VIEWING.times.map((t) => {
      const taken = L.slotTaken(st.date, t, rescheduleRef);
      const isOld = original && original.date === st.date && original.time === t;
      const note = isOld ? 'Current' : taken === 'yours' ? 'Booked' : taken ? 'Taken' : '';
      return `<label class="slot${taken || isOld ? ' is-off' : ''}"><input type="radio" name="time" value="${t}"${t === st.time ? ' checked' : ''}${taken || isOld ? ' disabled' : ''}><span class="slot__t">${L.time(t)}</span>${note ? `<span class="slot__n">${note}</span>` : ''}</label>`;
    }).join('');
  };
  $('#days').addEventListener('change', (e) => {
    st.date = e.target.value;
    if (st.time && (L.slotTaken(st.date, st.time, rescheduleRef) || (original && original.date === st.date && original.time === st.time))) st.time = '';
    renderTimes(); saveDraft(); renderSide();
    L.enter($('#times'), 6);
  });
  $('#times').addEventListener('change', (e) => {
    st.time = e.target.value;
    $('#slot-err').hidden = true;
    saveDraft(); renderSide();
  });

  /* ---------- Step 3: details, inline validation ---------- */
  const setError = (input, bad) => {
    input.setAttribute('aria-invalid', String(bad));
    $(`#${input.getAttribute('aria-describedby')}`).hidden = !bad;
    return !bad;
  };
  const check = {
    name: () => setError(f.name, f.name.value.trim().length < 2),
    email: () => setError(f.email, !EMAIL.test(f.email.value.trim())),
    phone: () => setError(f.phone, !PHONE.test(digits(f.phone.value))),
  };
  Object.keys(check).forEach((k) => {
    f[k].addEventListener('blur', () => { if (f[k].value.trim()) check[k](); });
    f[k].addEventListener('input', () => { if (f[k].getAttribute('aria-invalid') === 'true') check[k](); saveDraft(); });
  });
  f.note.addEventListener('input', saveDraft);

  /* ---------- Review and side summary ---------- */
  const resNames = () => st.ids.map((id) => L.byId(id)).filter(Boolean);
  const edit = (step, label) => `<button class="ds-button ds-button--tertiary review__edit" type="button" data-goto="${step}" aria-label="${label}">Change</button>`;
  const renderReview = () => {
    const contact = [f.email.value.trim(), digits(f.phone.value)].map(L.esc).join('<br>');
    $('#review').innerHTML = `
      <div class="review__row"><dt>Residences</dt><dd>${resNames().map((r) => L.esc(L.title(r))).join('<br>')}</dd>${edit(1, 'Change residences')}</div>
      <div class="review__row"><dt>When</dt><dd>${L.dateLong(st.date)}<br>${L.time(st.time)}, 45 minutes</dd>${edit(2, 'Change day and time')}</div>
      <div class="review__row"><dt>Name</dt><dd>${L.esc(f.name.value.trim())}</dd>${edit(3, 'Change your details')}</div>
      <div class="review__row"><dt>Contact</dt><dd>${contact}</dd></div>
      ${f.note.value.trim() ? `<div class="review__row"><dt>Note</dt><dd>${L.esc(f.note.value.trim())}</dd></div>` : ''}`;
  };
  const renderSide = () => {
    const list = resNames();
    $('#side-summary').innerHTML = `
      <dt>Residences</dt><dd>${list.length ? list.map((r) => `<a href="residence.html?id=${r.id}">${L.esc(r.code)}</a>`).join(', ') : 'None chosen'}</dd>
      <dt>Day</dt><dd>${st.date ? L.dateLong(st.date) : 'Not chosen'}</dd>
      <dt>Time</dt><dd>${st.time ? `${L.time(st.time)}, 45 minutes` : 'Not chosen'}</dd>`;
  };

  /* ---------- Step navigation ---------- */
  const show = (n, focus = true) => {
    const changed = n !== st.step;
    st.step = n;
    steps.forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
    marks.forEach((m, i) => {
      if (i + 1 === n) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
      m.classList.toggle('is-done', i + 1 < n);
    });
    netErr.hidden = true;
    if (n === 2) { renderDays(); renderTimes(); }
    if (n === 4) renderReview();
    if (changed) L.enter(steps[n - 1]);
    if (focus) {
      const target = n === 1 ? (boxes.find((b) => b.checked) || boxes[0])
        : n === 2 ? ($('input[name="time"]:checked', form) || $('input[name="day"]:checked', form))
          : n === 3 ? f.name : $('#book-submit');
      if (target) target.focus({ preventScroll: true });
      $('#book').scrollIntoView({ block: 'start', behavior: L.reduceMotion ? 'auto' : 'smooth' });
    }
  };
  const valid = (n) => {
    if (n === 1) {
      const ok = st.ids.length > 0;
      $('#pick-err').hidden = ok;
      if (!ok) boxes[0].focus();
      return ok;
    }
    if (n === 2) {
      const ok = Boolean(st.time) && !L.slotTaken(st.date, st.time, rescheduleRef);
      $('#slot-err').hidden = ok;
      if (!ok) ($('input[name="time"]:not(:disabled)', form) || $('input[name="day"]:checked', form)).focus();
      return ok;
    }
    if (n === 3) {
      const res = ['name', 'email', 'phone'].map((k) => check[k]());
      const bad = res.indexOf(false);
      if (bad >= 0) f[['name', 'email', 'phone'][bad]].focus();
      return bad < 0;
    }
    return true;
  };
  $$('[data-next]', form).forEach((b) => b.addEventListener('click', () => { if (valid(st.step)) show(st.step + 1); }));
  $$('[data-back]', form).forEach((b) => b.addEventListener('click', () => show(st.step - 1)));
  form.addEventListener('click', (e) => { const g = e.target.closest('[data-goto]'); if (g) show(Number(g.dataset.goto)); });
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && st.step < 4 && e.target.matches('input')) {
      e.preventDefault();
      if (valid(st.step)) show(st.step + 1);
    }
  });

  /* ---------- Confirm ---------- */
  const fakeSend = () => new Promise((resolve, reject) => {
    setTimeout(() => (navigator.onLine ? resolve() : reject(new Error('offline'))), 700);
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (st.step !== 4) return;
    for (const n of [1, 2, 3]) if (!valid(n)) { show(n); valid(n); return; }
    const btn = $('#book-submit');
    const label = btn.textContent;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.textContent = 'Booking…';
    try {
      await fakeSend();
      const details = { ids: st.ids.slice(), date: st.date, time: st.time, name: f.name.value.trim(), email: f.email.value.trim(), phone: digits(f.phone.value), note: f.note.value.trim() };
      let ref;
      if (original) {
        ref = original.ref;
        L.store.bookings.patch(ref, Object.assign(details, { previous: { date: original.date, time: original.time } }));
      } else {
        ref = L.newRef();
        L.store.bookings.add(Object.assign({ ref, status: 'upcoming', createdAt: new Date().toISOString() }, details));
        L.store.draft.clear('book');
      }
      $('#done-title').textContent = original ? 'Viewing rescheduled' : 'Viewing booked';
      $('#done-summary').innerHTML = `
        <dt>Reference</dt><dd data-out="ref">${ref}</dd>
        <dt>Day</dt><dd data-out="day">${L.dateLong(details.date)}</dd>
        <dt>Time</dt><dd data-out="time">${L.time(details.time)}</dd>
        <dt>Residences</dt><dd data-out="res">${resNames().map((r) => L.esc(r.code)).join(', ')}</dd>`;
      form.hidden = true;
      done.hidden = false;
      L.enter(done);
      done.focus();
    } catch {
      netErr.hidden = false;
      btn.focus();
    } finally {
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      btn.textContent = label;
    }
  });

  syncPicks();
  renderSide();
  show(original ? 2 : 1, false);
})();
