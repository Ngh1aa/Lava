import { content as c } from "./content.ts";

export const overviewSection = () => `
    <section class="overview section" id="overview" aria-labelledby="overview-title" data-screen="Overview">
      <div class="overview-intro" data-reveal><h2 id="overview-title">${c.overview.heading}</h2><p>${c.overview.body}</p></div>
      <dl class="facts" data-reveal>${c.overview.facts.map((f) => `<div><dd>${f.value}</dd><dt>${f.label}</dt><dd class="fact-detail">${f.detail}</dd></div>`).join("")}</dl>
    </section>
`;

export const experienceSection = () => `
    <section class="experience section" id="experience" aria-labelledby="experience-title" data-screen="Experience">
      <div class="experience-heading"><span class="section-index">04 / The experience</span><h2 id="experience-title" data-reveal>The details<br>make the difference.</h2></div>
      <div class="experience-list">${c.experiences.map((e, i) => `<details ${i === 0 ? "open" : ""}><summary><span class="detail-index">0${i + 1}</span>${e.title}<span class="detail-plus" aria-hidden="true"></span></summary><p>${e.body}</p></details>`).join("")}</div>
    </section>
`;

export const lightboxSection = () => `
  <dialog class="lightbox" id="lightbox" aria-labelledby="lightbox-title"><div class="lightbox-top"><h2 id="lightbox-title">The blue hour</h2><button type="button" class="lightbox-close" aria-label="Close gallery">Close <span aria-hidden="true">×</span></button></div><div class="lightbox-stage"><img id="lightbox-image" loading="lazy" src="/images/harpa-0.webp" alt="" width="1536" height="1024" /><button class="lightbox-prev" type="button" aria-label="Previous image"><span aria-hidden="true">←</span></button><button class="lightbox-next" type="button" aria-label="Next image"><span aria-hidden="true">→</span></button></div><div class="lightbox-bottom"><span id="lightbox-category">${c.gallery[0].category}</span><a id="lightbox-credit" class="photo-credit" href="${c.gallery[0].source}" target="_blank" rel="noopener noreferrer">Photo: ${c.gallery[0].photographer}</a><span id="lightbox-count" role="status" aria-live="polite">01 / 0${c.gallery.length}</span></div></dialog>
`;
