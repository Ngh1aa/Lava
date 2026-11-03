import { content as c } from "./content.ts";

// This template is rendered by Vite at build time. The complete narrative works without client JS.
export function renderPage() {
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="header" id="top">
    <a class="header-brand" href="#top" aria-label="LAVA home">LAVA<span class="brand-mark" aria-hidden="true">/</span></a>
    <a class="header-caption" href="#vision">${c.tagline}</a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="#vision">The vision</a><a href="#architecture">Architecture</a><a href="#spaces">Spaces</a>
    </nav>
    <a class="header-contact" href="#enquiry">Start a conversation <span aria-hidden="true">↗</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">Menu <span class="menu-lines" aria-hidden="true"></span></button>
  </header>
  <dialog class="mobile-menu" id="mobile-menu" aria-label="Navigation">
    <div class="menu-top"><span>LAVA /</span><button class="menu-close" type="button">Close <span aria-hidden="true">×</span></button></div>
    <nav aria-label="Mobile navigation">${[
      ["vision", "The vision"],
      ["architecture", "Architecture"],
      ["spaces", "Spaces"],
      ["gallery", "Gallery"],
      ["enquiry", "Get in touch"],
    ]
      .map(
        ([id, label], i) =>
          `<a href="#${id}"><span class="menu-number">0${i + 1}</span>${label}</a>`,
      )
      .join("")}</nav>
    <p>${c.tagline}</p>
  </dialog>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title" data-screen="Hero">
      <div class="hero-wordmark" aria-hidden="true">LAVA</div>
      <div class="hero-note">${c.heroNote.join("<br>")}</div>
      <div class="scene hero-scene" id="hero-scene" role="img" aria-label="Interactive three-dimensional view of LAVA's cantilevered architecture" aria-busy="true">
        <img class="scene-fallback" src="images/exterior.webp" alt="" width="1600" height="1000" fetchpriority="high" />
      </div>
      <div class="hero-bottom">
        <div class="hero-copy"><h1 id="hero-title">${c.hero.join("<br>")}</h1><a class="round-link" href="#architecture"><span class="round-arrow" aria-hidden="true">↗</span><span>Explore LAVA</span></a></div>
        <div class="hero-coordinate"><span>Form. Light. Possibility.</span><a href="#vision" class="scroll-link">Scroll to discover <span aria-hidden="true">↓</span></a></div>
      </div>
      <button class="activate-scene hero-activate" type="button" data-activate="hero" hidden>View in 3D <span aria-hidden="true">↗</span></button><button class="activate-scene hero-activate" type="button" data-deactivate="hero" hidden>Still view</button><p class="scene-status" id="hero-status" role="status">Preparing the perspective</p>
    </section>
    <section class="vision section" id="vision" aria-labelledby="vision-title" data-screen="Vision">
      <div class="section-top"><span>01 / The vision</span><span>Beyond the expected</span></div>
      <h2 class="statement" id="vision-title" data-reveal>${c.vision[0]}<br><span>${c.vision[1]}</span></h2>
      <div class="vision-bottom" data-reveal><span class="architectural-mark" aria-hidden="true"></span><p>${c.statement}</p></div>
    </section>
    <section class="overview section" id="overview" aria-labelledby="overview-title" data-screen="Overview">
      <div class="overview-intro" data-reveal><h2 id="overview-title">${c.overview.heading}</h2><p>${c.overview.body}</p></div>
      <dl class="facts" data-reveal>${c.overview.facts.map((f) => `<div><dd>${f.value}</dd><dt>${f.label}</dt><dd class="fact-detail">${f.detail}</dd></div>`).join("")}</dl>
    </section>
    <section class="architecture" id="architecture" aria-labelledby="architecture-title" data-screen="Architecture">
      <div class="section architecture-heading"><div class="section-top"><span>02 / Architecture</span><span>A study in balance</span></div><h2 id="architecture-title" data-reveal>Quietly bold.<br>Distinctly LAVA.</h2></div>
      <div class="showcase" id="showcase">
        <div class="scene architecture-scene" id="architecture-scene" role="img" aria-label="LAVA architectural model with selectable camera perspectives and lighting" aria-busy="true"><img class="scene-fallback" src="images/exterior.webp" alt="" width="1600" height="1000" loading="lazy" /></div>
        <button class="activate-scene viewer-activate" type="button" data-activate="viewer" hidden>Explore in 3D <span aria-hidden="true">↗</span></button><div class="showcase-tools"><div class="light-switch" role="group" aria-label="Architectural lighting"><button type="button" data-light="dusk" aria-pressed="true">Dusk</button><button type="button" data-light="day" aria-pressed="false">Daylight</button></div><button class="quality-toggle" type="button" aria-pressed="false">Low power</button></div>
        <button class="activate-scene viewer-deactivate" type="button" data-deactivate="viewer" hidden>Still view</button><div class="showcase-caption"><span id="view-number">01 / 03 The arrival</span><span id="showcase-status" role="status">Preparing the perspective</span><div class="camera-controls"><button type="button" data-orbit="-1" aria-label="Rotate building left"><span aria-hidden="true">←</span></button><button type="button" data-orbit="1" aria-label="Rotate building right"><span aria-hidden="true">→</span></button></div></div>
      </div>
      <div class="view-panel section">
        <div class="view-tabs" role="tablist" aria-label="Architectural perspectives">${c.views.map((v, i) => `<button type="button" id="tab-${v.id}" role="tab" aria-selected="${i === 0}" aria-controls="view-description" tabindex="${i === 0 ? "0" : "-1"}" data-view="${v.id}"><span>0${i + 1}</span>${v.label}</button>`).join("")}</div>
        <div class="view-description" id="view-description" role="tabpanel" aria-labelledby="tab-arrival" tabindex="0"><h3>${c.views[0].title}</h3><p>${c.views[0].description}</p></div>
      </div>
    </section>
    <section class="spaces section" id="spaces" aria-labelledby="spaces-title" data-screen="Spaces">
      <div class="section-top"><span>03 / Spaces</span><span>Made for the moments between</span></div><h2 id="spaces-title" data-reveal>Life, given<br>a little more space.</h2>
      <div class="spaces-grid">${c.spaces.map((s, i) => `<figure class="space space-${i + 1}" data-reveal><a class="image-link" href="images/${s.image}" data-gallery="${i + 1}" aria-label="View ${s.name}"><img src="images/${s.image}" alt="${s.alt}" width="${s.width}" height="${s.height}" loading="lazy" decoding="async" /><span class="image-open" aria-hidden="true">↗</span></a><figcaption><span class="space-name">0${i + 1} / ${s.name}</span><h3>${s.title}</h3><p>${s.body}</p></figcaption></figure>`).join("")}</div>
    </section>
    <section class="experience section" id="experience" aria-labelledby="experience-title" data-screen="Experience">
      <div class="experience-heading"><span class="section-index">04 / The experience</span><h2 id="experience-title" data-reveal>The details<br>make the difference.</h2></div>
      <div class="experience-list">${c.experiences.map((e, i) => `<details ${i === 0 ? "open" : ""}><summary><span class="detail-index">0${i + 1}</span>${e.title}<span class="detail-plus" aria-hidden="true"></span></summary><p>${e.body}</p></details>`).join("")}</div>
    </section>
    <section class="gallery section" id="gallery" aria-labelledby="gallery-title" data-screen="Gallery">
      <div class="gallery-heading"><h2 id="gallery-title" data-reveal>A closer look.</h2><div class="gallery-nav"><button type="button" data-gallery-scroll="-1" aria-label="Previous gallery images"><span aria-hidden="true">←</span></button><button type="button" data-gallery-scroll="1" aria-label="Next gallery images"><span aria-hidden="true">→</span></button></div></div>
      <div class="gallery-track">${c.gallery.map((g, i) => `<figure><a href="images/${g.image}" data-gallery="${i}" aria-label="Open ${g.title}"><img src="images/${g.image}" alt="${g.alt}" width="1200" height="800" loading="lazy" decoding="async" /><span class="image-open" aria-hidden="true">↗</span></a><figcaption><span>${g.title}</span><span>0${i + 1} / 04</span></figcaption></figure>`).join("")}</div>
    </section>
    <section class="enquiry section" id="enquiry" aria-labelledby="enquiry-title" data-screen="Enquiry">
      <div class="enquiry-intro"><span class="section-index">05 / Get in touch</span><h2 id="enquiry-title" data-reveal>Great things<br>start with<br>a conversation.</h2><a class="enquiry-external" href="https://github.com/Ngh1aa/Lava" target="_blank" rel="noopener noreferrer">Meet the project <span aria-hidden="true">↗</span></a></div>
      <form class="enquiry-form" novalidate><h3>What do you have in mind?</h3><div class="field"><label for="name">Your name</label><input id="name" name="name" autocomplete="name" required maxlength="100" aria-describedby="name-error" /><span class="field-error" id="name-error"></span></div><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="254" aria-describedby="email-error" /><span class="field-error" id="email-error"></span></div><div class="field"><label for="interest">I'm interested in</label><select id="interest" name="interest"><option>Architecture and spaces</option><option>A creative collaboration</option><option>A general conversation</option></select></div><div class="field"><label for="message">Your message</label><textarea id="message" name="message" rows="3" required minlength="10" maxlength="3000" aria-describedby="message-error"></textarea><span class="field-error" id="message-error"></span></div><p class="form-note" id="form-note">Save your enquiry as a file to share. Your details stay on this device.</p><button class="form-submit" type="submit" disabled><span>Save enquiry</span><span aria-hidden="true">↗</span></button><p class="form-status" id="form-status" role="status" aria-live="polite"></p><noscript><p>Saving an enquiry needs JavaScript. You can also visit the project using the link on this page.</p></noscript></form>
    </section>
  </main>
  <footer class="footer section"><div class="footer-top"><a href="#top">Back to the beginning <span aria-hidden="true">↑</span></a><nav aria-label="Footer navigation"><a href="#architecture">Architecture</a><a href="#gallery">Gallery</a><a href="#enquiry">Contact</a></nav></div><div class="footer-wordmark">LAVA</div><div class="footer-bottom"><span>© ${new Date().getFullYear()} LAVA</span><span>${c.tagline}</span><a href="https://github.com/Ngh1aa/Lava" target="_blank" rel="noopener noreferrer">Project source ↗</a></div></footer>
  <dialog class="lightbox" id="lightbox" aria-labelledby="lightbox-title"><div class="lightbox-top"><h2 id="lightbox-title">The blue hour</h2><button type="button" class="lightbox-close" aria-label="Close gallery">Close <span aria-hidden="true">×</span></button></div><div class="lightbox-stage"><img id="lightbox-image" src="images/exterior.webp" alt="" width="1536" height="1024" /><button class="lightbox-prev" type="button" aria-label="Previous image"><span aria-hidden="true">←</span></button><button class="lightbox-next" type="button" aria-label="Next image"><span aria-hidden="true">→</span></button></div><div class="lightbox-bottom"><span id="lightbox-category">Exterior</span><span id="lightbox-count" role="status" aria-live="polite">01 / 04</span></div></dialog>
  `;
}
