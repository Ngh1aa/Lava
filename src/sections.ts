import { content as c } from "./content.ts";

export const heroSection = () => `
    <section class="hero" aria-labelledby="hero-title" data-screen="Hero">
      <div class="hero-wordmark" aria-hidden="true">LAVA</div>
      <div class="hero-note">${c.heroNote.join("<br>")}</div>
      <div class="scene hero-scene" id="hero-scene" role="img" aria-label="Interactive view of Modern Office Building by CN Entertainment" aria-busy="true">
        <picture><source media="(max-width: 767px)" srcset="/images/hero-mobile.webp"><img class="scene-fallback" src="/images/hero.webp" alt="" width="1600" height="1000" fetchpriority="high" /></picture>
      </div>
      <div class="hero-bottom">
        <div class="hero-copy"><h1 id="hero-title">${c.hero.join("<br>")}</h1><a class="round-link" href="/architecture/"><span class="round-arrow" aria-hidden="true">↗</span><span>Explore LAVA</span></a></div>
        <div class="hero-coordinate"><span>Form. Light. Possibility.</span><a href="#vision" class="scroll-link">Scroll to discover <span aria-hidden="true">↓</span></a></div>
      </div>
      <button class="activate-scene hero-activate" type="button" data-activate="hero" hidden>View in 3D <span aria-hidden="true">↗</span></button><button class="activate-scene hero-activate" type="button" data-deactivate="hero" hidden>Still view</button><p class="scene-status" id="hero-status" role="status">Preparing the perspective</p>
    </section>
`;

export const visionSection = () => `
    <section class="vision section" id="vision" aria-labelledby="vision-title" data-screen="Vision">
      <div class="section-top"><span>01 / The vision</span><span>Beyond the expected</span></div>
      <h2 class="statement" id="vision-title" data-reveal>${c.vision[0]}<br><span>${c.vision[1]}</span></h2>
      <div class="vision-bottom" data-reveal><span class="architectural-mark" aria-hidden="true"></span><p>${c.statement}</p></div>
    </section>
`;

export const overviewSection = () => `
    <section class="overview section" id="overview" aria-labelledby="overview-title" data-screen="Overview">
      <div class="overview-intro" data-reveal><h2 id="overview-title">${c.overview.heading}</h2><p>${c.overview.body}</p></div>
      <dl class="facts" data-reveal>${c.overview.facts.map((f) => `<div><dd>${f.value}</dd><dt>${f.label}</dt><dd class="fact-detail">${f.detail}</dd></div>`).join("")}</dl>
    </section>
`;

export const architectureSection = () => `
    <section class="architecture" id="architecture" aria-labelledby="architecture-title" data-screen="Architecture">
      <h2 class="sr-only" id="architecture-title">Interactive architecture</h2>
      <div class="showcase" id="showcase">
        <div class="scene architecture-scene" id="architecture-scene" role="img" aria-label="Modern Office Building reference model with selectable camera perspectives and lighting" aria-busy="true"><picture><source media="(max-width: 767px)" srcset="/images/exterior-mobile.webp"><img class="scene-fallback" src="/images/exterior.webp" alt="" width="1600" height="1000" loading="lazy" /></picture></div>
        <button class="activate-scene viewer-activate" type="button" data-activate="viewer" hidden>Explore in 3D <span aria-hidden="true">↗</span></button><div class="showcase-tools"><div class="light-switch" role="group" aria-label="Architectural lighting"><button type="button" data-light="dusk" aria-pressed="true">Dusk</button><button type="button" data-light="day" aria-pressed="false">Daylight</button></div><button class="quality-toggle" type="button" aria-pressed="false">Reduce detail</button></div>
        <button class="activate-scene viewer-deactivate" type="button" data-deactivate="viewer" hidden>Still view</button><div class="showcase-caption"><span id="view-number">01 / 03 The arrival</span><span id="showcase-status" role="status">Preparing the perspective</span><div class="camera-controls"><button type="button" data-orbit="-1" aria-label="Rotate building left"><span aria-hidden="true">←</span></button><button type="button" data-orbit="1" aria-label="Rotate building right"><span aria-hidden="true">→</span></button></div></div>
      </div>
      <div class="view-panel section">
        <div class="view-tabs" role="tablist" aria-label="Architectural perspectives">${c.views.map((v, i) => `<button type="button" id="tab-${v.id}" role="tab" aria-selected="${i === 0}" aria-controls="view-description" tabindex="${i === 0 ? "0" : "-1"}" data-view="${v.id}"><span>0${i + 1}</span>${v.label}</button>`).join("")}</div>
        <div class="view-description" id="view-description" role="tabpanel" aria-labelledby="tab-arrival" tabindex="0"><h3>${c.views[0].title}</h3><p>${c.views[0].description}</p></div>
      </div>
      <p class="model-credit section">3D: Modern Office Building by CN Entertainment / CC BY 4.0. <a class="text-link" href="/credits/#model-credit">Model source &amp; adaptations ↗</a></p>
    </section>
`;

export const experienceSection = () => `
    <section class="experience section" id="experience" aria-labelledby="experience-title" data-screen="Experience">
      <div class="experience-heading"><span class="section-index">04 / The experience</span><h2 id="experience-title" data-reveal>The details<br>make the difference.</h2></div>
      <div class="experience-list">${c.experiences.map((e, i) => `<details ${i === 0 ? "open" : ""}><summary><span class="detail-index">0${i + 1}</span>${e.title}<span class="detail-plus" aria-hidden="true"></span></summary><p>${e.body}</p></details>`).join("")}</div>
    </section>
`;

export const lightboxSection = () => `
  <dialog class="lightbox" id="lightbox" aria-labelledby="lightbox-title"><div class="lightbox-top"><h2 id="lightbox-title">The blue hour</h2><button type="button" class="lightbox-close" aria-label="Close gallery">Close <span aria-hidden="true">×</span></button></div><div class="lightbox-stage"><img id="lightbox-image" src="/images/exterior.webp" alt="" width="1536" height="1024" /><button class="lightbox-prev" type="button" aria-label="Previous image"><span aria-hidden="true">←</span></button><button class="lightbox-next" type="button" aria-label="Next image"><span aria-hidden="true">→</span></button></div><div class="lightbox-bottom"><span id="lightbox-category">${c.gallery[0].category}</span><a id="lightbox-credit" class="photo-credit" href="${c.gallery[0].source}" target="_blank" rel="noopener noreferrer">Photo: ${c.gallery[0].photographer}</a><span id="lightbox-count" role="status" aria-live="polite">01 / 0${c.gallery.length}</span></div></dialog>
`;
