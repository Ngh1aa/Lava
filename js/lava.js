/* Lava: hành vi trang. Không thư viện ngoài.
 * Gửi form là MÔ PHỎNG (chưa có backend): chờ 900 ms rồi báo thành công; mất mạng thì báo lỗi
 * và giữ nguyên dữ liệu. Xem docs/DESIGN-NOTES.md mục "Phần mô phỏng". */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav đang ở chương nào */
  const navLinks = $$('.nav a');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const a = byId.get(e.target.id);
        if (a && e.isIntersecting) {
          navLinks.forEach((l) => l.removeAttribute('aria-current'));
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Menu điện thoại ---------- */
  const menu = $('#mmenu');
  const menuBtn = $('.menu-btn');
  const openMenu = () => {
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    $('[data-close-menu]', menu).focus();
  };
  const closeMenu = (restoreFocus = true) => {
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus) menuBtn.focus();
  };
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', openMenu);
    $('[data-close-menu]', menu).addEventListener('click', () => closeMenu());
    $$('a', menu).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'Tab') {
        const f = $$('a, button', menu);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- 02 Căn hộ: tab theo mẫu ARIA, mũi tên chuyển tab ---------- */
  const tabs = $$('.unit-tab');
  const unitImg = $('#unit-img');
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (unitImg && tab.dataset.img) { unitImg.src = tab.dataset.img; unitImg.alt = tab.dataset.alt || ''; }
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
    });
  });

  /* ---------- 05 Tiện ích: chấm trên mặt bằng và danh sách cùng chọn một mục ---------- */
  const AMEN = [
    ['Hồ bơi 25 m', 'Hồ nước mặn có làn bơi và bể trẻ em, nhìn thẳng ra vườn.', ['6:00–21:00 mỗi ngày', 'Cạnh khối C']],
    ['Vườn trung tâm', 'Hơn 1.800 m² cỏ và cây bóng mát, bàn ăn ngoài trời cho cả bốn khối.', ['Mở cả ngày', 'Mọi khối nhìn ra vườn']],
    ['Phòng gym', 'Khu cardio, khu tạ và một phòng tập yoga riêng có cửa kính ra vườn.', ['5:30–22:00 mỗi ngày', 'Dùng thẻ cư dân']],
    ['Sảnh cộng đồng', 'Bếp chung và bàn dài 16 chỗ cho tiệc gia đình, đặt trước qua ban quản lý.', ['8:00–22:00 mỗi ngày', 'Đặt trước 24 giờ']],
    ['Đường dạo bộ', 'Vòng đi bộ quanh vườn, nối ra lối đi ven biển.', ['600 m mỗi vòng', 'Có đèn ban đêm']],
    ['Hầm xe và kho', 'Hai chỗ đỗ mỗi căn, kho riêng có khoá và trụ sạc xe điện.', ['Mở 24 giờ', 'Thẻ từ cư dân']],
  ];
  const amenCtrls = $$('[data-amen]');
  const pickAmen = (i) => {
    amenCtrls.forEach((c) => c.setAttribute('aria-pressed', String(Number(c.dataset.amen) === i)));
    const [name, desc, meta] = AMEN[i];
    $('#amen-name').textContent = name;
    $('#amen-desc').textContent = desc;
    $('#amen-meta').replaceChildren(...meta.map((m) => Object.assign(document.createElement('span'), { textContent: m })));
  };
  amenCtrls.forEach((c) => c.addEventListener('click', () => pickAmen(Number(c.dataset.amen))));

  /* ---------- Kiểm dữ liệu dùng chung ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^0\d{9}$/;
  const digits = (v) => v.replace(/[\s.-]/g, '');
  const setError = (input, msg) => {
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    const bad = Boolean(msg);
    input.setAttribute('aria-invalid', String(bad));
    if (err) err.hidden = !bad;
    return !bad;
  };
  const validate = (input, kind, required) => {
    const v = input.value.trim();
    if (!v) return setError(input, required);
    if (kind === 'email') return setError(input, !EMAIL.test(v));
    if (kind === 'phone') return setError(input, !PHONE.test(digits(v)));
    return setError(input, false);
  };
  // Sửa lỗi ngay khi người dùng gõ lại đúng
  $$('.ds-field__control[aria-describedby]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') !== 'true') return;
      const kind = input.type === 'email' ? 'email' : input.type === 'tel' ? 'phone' : 'text';
      validate(input, kind, input.required || input.dataset.required === 'true');
    });
  });

  /* Gửi mô phỏng: mất mạng thì thất bại */
  const fakeSend = () => new Promise((resolve, reject) => {
    setTimeout(() => (navigator.onLine ? resolve() : reject(new Error('offline'))), 900);
  });
  const busy = (btn, on, label) => {
    if (on) { btn.dataset.label = btn.textContent; btn.textContent = label; }
    else if (btn.dataset.label) btn.textContent = btn.dataset.label;
    btn.disabled = on;
    btn.setAttribute('aria-busy', String(on));
  };
  /* ---------- Form brochure ---------- */
  const bForm = $('#brochure-form');
  const bDone = $('#brochure-done');
  if (bForm) {
    const name = $('#b-name'), email = $('#b-email'), phone = $('#b-phone');
    const netErr = $('[data-net-error]', bForm);
    bForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      netErr.hidden = true;
      const ok = [validate(name, 'text', true), validate(email, 'email', true), validate(phone, 'phone', false)];
      const firstBad = [name, email, phone][ok.indexOf(false)];
      if (firstBad) { firstBad.focus(); return; }
      const btn = $('button[type="submit"]', bForm);
      busy(btn, true, 'Đang gửi…');
      try {
        await fakeSend();
        $('[data-out="email"]', bDone).textContent = email.value.trim();
        bForm.hidden = true;
        bDone.hidden = false;
        bDone.focus();
      } catch {
        netErr.hidden = false;
        btn.focus();
      } finally {
        busy(btn, false);
      }
    });
    $('[data-edit-brochure]').addEventListener('click', () => {
      bDone.hidden = true;
      bForm.hidden = false;
      email.focus();
      email.select();
    });
  }

  /* ---------- Form đăng ký ba bước ---------- */
  const eForm = $('#enq-form');
  const eDone = $('#enq-done');
  if (eForm) {
    const steps = $$('.step', eForm);
    const marks = $$('.steps li', eForm);
    const netErr = $('[data-net-error]', eForm);
    const name = $('#e-name'), phone = $('#e-phone'), email = $('#e-email');
    const need = $('#e-need'), day = $('#e-day'), unit = $('#e-unit');
    let cur = 1;

    const via = () => $('input[name="via"]:checked', eForm).value;
    const syncVia = () => {
      const v = via();
      $$('[data-via]', eForm).forEach((f) => { f.hidden = f.dataset.via !== v; });
      phone.dataset.required = String(v === 'call');
      email.dataset.required = String(v === 'email');
    };
    const syncNeed = () => { $('[data-need-field="xem"]', eForm).hidden = need.value !== 'xem'; };
    $$('input[name="via"]', eForm).forEach((r) => r.addEventListener('change', syncVia));
    need.addEventListener('change', syncNeed);
    syncVia(); syncNeed();

    const show = (n, focus = true) => {
      cur = n;
      steps.forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
      marks.forEach((m, i) => {
        if (i + 1 === n) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
        m.classList.toggle('is-done', i + 1 < n);
      });
      netErr.hidden = true;
      if (focus) {
        const first = $('input:not([type="radio"]):not([hidden]), select', steps[n - 1]);
        const target = n === 2 ? $('input[name="via"]:checked', eForm) : first;
        if (target) target.focus();
      }
    };
    const stepValid = (n) => {
      if (n === 1) { const ok = validate(name, 'text', true); if (!ok) name.focus(); return ok; }
      if (n === 2) {
        const input = via() === 'call' ? phone : email;
        const ok = validate(input, via() === 'call' ? 'phone' : 'email', true);
        if (!ok) input.focus();
        return ok;
      }
      return true;
    };
    $$('[data-next]', eForm).forEach((b) => b.addEventListener('click', () => { if (stepValid(cur)) show(cur + 1); }));
    $$('[data-back]', eForm).forEach((b) => b.addEventListener('click', () => show(cur - 1)));
    // Enter trong ô nhập ở bước 1–2 đi tiếp thay vì gửi cả form
    eForm.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && cur < 3 && e.target.matches('input')) {
        e.preventDefault();
        if (stepValid(cur)) show(cur + 1);
      }
    });

    eForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (cur !== 3) return;
      const btn = $('button[type="submit"]', eForm);
      busy(btn, true, 'Đang gửi…');
      try {
        await fakeSend();
        const isCall = via() === 'call';
        const out = (k, v) => { $(`[data-out="${k}"]`, eDone).textContent = v; };
        out('name', name.value.trim());
        out('contact', isCall ? `Gọi ${digits(phone.value)}` : email.value.trim());
        out('need', need.value === 'xem' ? `${need.selectedOptions[0].text}, ${day.value}` : need.selectedOptions[0].text);
        out('unit', unit.selectedOptions[0].text);
        out('next', isCall
          ? 'Chuyên viên sẽ gọi trong giờ làm việc để xác nhận.'
          : 'Chuyên viên sẽ trả lời qua email trong giờ làm việc.');
        eForm.hidden = true;
        eDone.hidden = false;
        eDone.focus();
      } catch {
        netErr.hidden = false;
        btn.focus();
      } finally {
        busy(btn, false);
      }
    });
    $('[data-edit-enq]').addEventListener('click', () => {
      eDone.hidden = true;
      eForm.hidden = false;
      show(3);
    });

    /* Nút "Hẹn xem nhà mẫu", "Hỏi về căn này" ở mọi nơi: điền sẵn nhu cầu và loại căn.
       Bước bắt đầu là bước đầu tiên còn thiếu dữ liệu, không xoá gì đã nhập. */
    $$('a[data-need]').forEach((a) => a.addEventListener('click', () => {
      need.value = a.dataset.need;
      if (a.dataset.unit) unit.value = a.dataset.unit;
      syncNeed();
      if (!eDone.hidden) { eDone.hidden = true; eForm.hidden = false; }
      const start = !name.value.trim() ? 1 : !(via() === 'call' ? phone : email).value.trim() ? 2 : 3;
      show(start, false);
      setTimeout(() => {
        const t = start === 1 ? name : start === 2 ? $('input[name="via"]:checked', eForm) : need;
        t.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 450);
    }));
  }
})();
