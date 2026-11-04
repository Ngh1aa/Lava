import { content as c, architectureModel } from "./content.ts";
import { spaces, spaceById, planSvg, type Space } from "./spaces.ts";
import {
  heroSection,
  visionSection,
  overviewSection,
  architectureSection,
  experienceSection,
  lightboxSection,
} from "./sections.ts";
import { enquiryPage } from "./enquiry-page.ts";

export function pageDescription(path: string) {
  const space = spaceById(path.match(/^\/spaces\/([^/]+)\/$/)?.[1] ?? "");
  if (space) return `${space.name}. ${space.description}`;
  const descriptions: Record<string, string> = {
    "/project/":
      "Discover the vision, principles and six-level architectural idea behind LAVA.",
    "/architecture/":
      "Explore a licensed Modern Office Building reference model in 3D, from three perspectives and two lighting conditions.",
    "/spaces/":
      "Explore four spatial concepts for work, meeting and open-air moments. Filter by use or level and save your selection.",
    "/experience/":
      "Experience a day in LAVA, from a shared arrival to a quieter moment under the open sky.",
    "/gallery/":
      "A credited collection of real architectural photographs exploring the light, material and atmosphere that inform LAVA.",
    "/saved/":
      "Review your saved LAVA spaces and bring your selection into one personal enquiry.",
    "/enquiry/":
      "Bring your ideas and selected spaces together in a personal LAVA enquiry.",
    "/enquiry/review/":
      "Review your LAVA enquiry, check the selected spaces and return to edit your details.",
    "/enquiry/ready/":
      "Prepare a local copy of your LAVA enquiry to keep and share in your next conversation.",
    "/contact/":
      "Start a conversation about LAVA and find answers about this independent architectural concept.",
    "/credits/":
      "Photographer credits, original image sources and licenses for the LAVA architectural reference collection.",
    "/privacy/":
      "How LAVA handles saved spaces, local enquiry drafts, downloads and external links.",
  };
  return (
    descriptions[path] ??
    "LAVA. An architectural exploration of light, form and a different way of being in space."
  );
}

function contact() {
  return `${heading("Contact", "A conversation.<br>A new beginning.", "Have a spatial idea, a collaboration in mind, or a question about the concept? Start by bringing your thoughts together.")}<section class="contact-options section"><article><span>01 / Your idea</span><h2>Tell your story.</h2><p>Choose the spaces that interest you and prepare an enquiry you can keep and share.</p>${link("/enquiry/", "Start an enquiry", "solid-button")}</article><article><span>02 / About this project</span><h2>An open concept.</h2><p>LAVA is an independent architectural exploration. A project location and commercial contact have not been established.</p>${link("https://github.com/Ngh1aa/Lava", "Visit the project source")}</article></section><section class="contact-faq section"><h2>Before we begin.</h2><div class="experience-list">${[
    [
      "Can I book or lease a space?",
      "The spaces are design concepts, not an available property inventory. No reservations, commercial offers or live availability are provided.",
    ],
    [
      "What happens to my enquiry?",
      "Your draft remains in this browser tab. You can review it and download a text file. No enquiry is sent to a server. If a verified email is configured, you can open a draft in your own email app.",
    ],
    [
      "Are these photographs of LAVA?",
      "The photographs and the licensed 3D building are credited architectural references. The six-level spatial programme and zoning sketches are independent LAVA proposals, not floor plans of the reference model.",
    ],
  ]
    .map(
      ([q, a]) =>
        `<details><summary>${q}<span class="detail-plus" aria-hidden="true"></span></summary><p>${a}</p></details>`,
    )
    .join("")}</div></section>`;
}
function credits() {
  return `${heading("Asset credits", "Real places.<br>Shared inspiration.", "These photographs are architectural references. They illustrate material, light and atmosphere; they do not depict the LAVA concept.")}<section class="credits-list section">${c.gallery.map((p, i) => `<article><img src="/images/${p.image}" ${responsivePhoto(i, "(max-width: 767px) calc(100vw - 40px), 40vw")} alt="${p.alt}" width="${p.width}" height="${p.height}" loading="lazy"><div><span class="eyebrow">0${i + 1} / ${p.category}</span><h2>${p.photographer}</h2><p>${p.alt}</p>${link(p.source, "Original photograph on Unsplash")}</div></article>`).join("")}<p>Photography is used under the <a class="text-link" href="https://unsplash.com/license">Unsplash License ↗</a>. The spatial sketches were created for LAVA; the reference building is credited below. Manrope is licensed under the SIL Open Font License.</p><article id="model-credit"><img src="/images/structure.webp" alt="Modern Office Building by CN Entertainment, adapted with LAVA lighting" width="1600" height="1000" loading="lazy"><div><span class="eyebrow">3D architectural reference</span><h2>${architectureModel.title}</h2><p>By ${architectureModel.author}. Licensed under <a class="text-link" href="${architectureModel.license}">CC BY 4.0</a>. Adapted for LAVA with reflective glazing, warm lighting, new framing and a hidden source ground plane. The author does not endorse LAVA.</p><p>This reference building is separate from LAVA’s proposed six-level spatial programme and original zoning sketches.</p>${link(architectureModel.source, "Original model on Sketchfab")}</div></article></section>`;
}
function privacy() {
  return `${heading("Privacy", "Your perspective.<br>Your information.", "A straightforward explanation of the information used by this concept website.")}<section class="policy-content section"><h2>Saved spaces</h2><p>Your saved space choices stay in this browser. Use “Clear selection” on Saved spaces to remove them. Your name, email and message are not stored with this list.</p><h2>Enquiry drafts</h2><p>Your contact details, message and selected spaces stay in the current browser tab while you review and edit. Closing the tab normally ends that draft session. Use “Clear my draft” on the final step to remove it immediately.</p><h2>Sharing an enquiry</h2><p>Downloading creates a text file on your device. No enquiry is submitted to a server. If a contact email is configured, the email link opens your own app with a draft. You review and send it there.</p><h2>Other connections</h2><p>This website does not include analytics or advertising scripts. Images and fonts are served with the site. External photograph credits and project links open the original providers, whose own policies apply. The hosting provider may maintain standard access logs.</p>${link("/contact/", "About the concept")}</section>`;
}
export function pageTitle(path: string) {
  const s = path.startsWith("/spaces/")
    ? spaceById(path.split("/")[2] ?? "")
    : undefined;
  return `${s?.name ?? { "/": "A different perspective", "/project/": "The project", "/architecture/": "Architecture", "/spaces/": "Explore spaces", "/experience/": "The experience", "/gallery/": "Image collection", "/saved/": "Saved spaces", "/enquiry/": "Your enquiry", "/enquiry/review/": "Review your enquiry", "/enquiry/ready/": "Ready to share", "/contact/": "Contact", "/credits/": "Asset credits", "/privacy/": "Privacy" }[path] ?? "Page not found"} — LAVA`;
}
export function renderPage(path = "/") {
  const s = path.startsWith("/spaces/")
    ? spaceById(path.split("/")[2] ?? "")
    : undefined;
  const body =
    path === "/"
      ? home()
      : path === "/project/"
        ? project()
        : path === "/architecture/"
          ? architecture()
          : path === "/spaces/"
            ? catalogue()
            : s
              ? detail(s)
              : path === "/experience/"
                ? experience()
                : path === "/gallery/"
                  ? gallery()
                  : path === "/saved/"
                    ? saved()
                    : path === "/enquiry/"
                      ? enquiryPage(0, heading, link)
                      : path === "/enquiry/review/"
                        ? enquiryPage(1, heading, link)
                        : path === "/enquiry/ready/"
                          ? enquiryPage(2, heading, link)
                          : path === "/contact/"
                            ? contact()
                            : path === "/credits/"
                              ? credits()
                              : path === "/privacy/"
                                ? privacy()
                                : heading(
                                    "Page not found",
                                    "A different<br>direction.",
                                    "This page could not be found. Continue exploring the LAVA concept below.",
                                    link(
                                      "/spaces/",
                                      "Explore spaces",
                                      "solid-button",
                                    ),
                                  );
  return `${header(path)}<main id="main" data-page="${path}">${body}</main>${footer()}${lightboxSection()}`;
}

export const routes = [
  "/",
  "/project/",
  "/architecture/",
  "/spaces/",
  ...spaces.map((s) => `/spaces/${s.id}/`),
  "/experience/",
  "/gallery/",
  "/saved/",
  "/enquiry/",
  "/enquiry/review/",
  "/enquiry/ready/",
  "/contact/",
  "/credits/",
  "/privacy/",
];
const nav = [
  ["project", "The project"],
  ["architecture", "Architecture"],
  ["spaces", "Spaces"],
  ["experience", "Experience"],
  ["gallery", "Gallery"],
];
export const link = (href: string, label: string, cls = "text-link") =>
  `<a class="${cls}" href="${href}">${label}<span aria-hidden="true"> ↗</span></a>`;
const breadcrumb = (label: string, parent?: [string, string]) =>
  `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">LAVA</a><span aria-hidden="true">/</span>${parent ? `<a href="${parent[0]}">${parent[1]}</a><span aria-hidden="true">/</span>` : ""}<span aria-current="page">${label}</span></nav>`;
export const heading = (
  label: string,
  title: string,
  copy: string,
  extra = "",
) =>
  `<section class="page-heading section">${breadcrumb(label)}<div class="page-title-row"><h1>${title}</h1><div class="page-intro"><p>${copy}</p>${extra}</div></div></section>`;
const photo = (index: number, cls = "", eager = false) => {
  const p = c.gallery[index];
  return `<figure class="reference-photo ${cls}"><a class="image-link" href="/images/${p.image}" data-gallery="${index}" aria-label="Open ${p.title}"><img src="/images/${p.image}" ${responsivePhoto(index, cls === "gallery-item" ? "(max-width: 767px) calc(100vw - 40px), 46vw" : "100vw")} alt="${p.alt}" width="${p.width}" height="${p.height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"><span class="image-open" aria-hidden="true">↗</span></a><figcaption><span>${p.category}</span><a class="photo-credit" href="${p.source}" target="_blank" rel="noopener noreferrer">${p.photographer} ↗</a></figcaption></figure>`;
};
function responsivePhoto(index: number, sizes: string) {
  const p = c.gallery[index];
  const name = p.image.replace(".webp", "");
  const sources = [
    ...[640, 960]
      .filter((width) => width < p.width)
      .map((width) => `/images/${name}-${width}.webp ${width}w`),
    `/images/${p.image} ${p.width}w`,
  ];
  return `srcset="${sources.join(", ")}" sizes="${sizes}"`;
}
const nextChapter = (
  number: string,
  title: string,
  href: string,
  label: string,
) =>
  `<section class="chapter-next section"><span class="eyebrow">${number} / Continue the story</span><h2>${title}</h2>${link(href, label)}</section>`;
const saveFeedback = () =>
  `<div class="save-feedback" role="status" aria-live="polite" data-save-feedback hidden></div>`;
const saveButton = (s: Space) =>
  `<button class="save-space" type="button" data-save="${s.id}" aria-pressed="false" aria-label="Save space: ${s.name}" disabled><span aria-hidden="true">＋</span> Save space</button>`;
export const spaceCard = (s: Space, eager = false) =>
  `<article class="catalogue-card" data-space="${s.id}" data-type="${s.type}" data-level="${s.level}"><div class="catalogue-image"><a href="/spaces/${s.id}/" aria-label="Explore ${s.name}"><img src="/images/${s.image}" ${responsivePhoto(s.photo, "(max-width: 767px) calc(100vw - 40px), 46vw")} alt="${c.gallery[s.photo].alt}" width="${c.gallery[s.photo].width}" height="${c.gallery[s.photo].height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}><span class="image-open" aria-hidden="true">↗</span></a><span class="image-label">Photo reference</span></div><div class="card-meta"><span>${s.type} / Level ${s.level}</span>${saveButton(s)}</div>${saveFeedback()}<a class="card-title" href="/spaces/${s.id}/"><span class="space-number">${s.number}</span><h2>${s.name}</h2><span aria-hidden="true">↗</span></a><p>${s.atmosphere}</p></article>`;

function header(path: string) {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="header" id="top"><a class="header-brand" href="/" aria-label="LAVA home">LAVA<span class="brand-mark" aria-hidden="true">/</span></a><nav class="desktop-nav" aria-label="Main navigation">${nav.map(([id, label]) => `<a href="/${id}/" ${path.startsWith(`/${id}/`) ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav><div class="header-actions"><a class="saved-link" href="/saved/" aria-label="Saved 0 spaces"><span aria-hidden="true">◇</span><span class="saved-label">Saved</span> <span data-saved-count>0</span></a><a class="header-contact" href="/enquiry/">Enquire <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">Menu <span class="menu-lines" aria-hidden="true"></span></button></div></header><dialog class="mobile-menu" id="mobile-menu" aria-label="Navigation"><div class="menu-top"><span>LAVA /</span><button class="menu-close" type="button">Close <span aria-hidden="true">×</span></button></div><nav aria-label="Mobile navigation">${[...nav, ["saved", "Saved spaces"], ["contact", "Contact"]].map(([id, label], i) => `<a href="/${id}/" ${path.startsWith(`/${id}/`) ? 'aria-current="page"' : ""}><span class="menu-number">0${i + 1}</span>${label}</a>`).join("")}</nav><p>${c.tagline}</p></dialog>`;
}
function footer() {
  return `<footer class="footer section"><div class="footer-top"><a href="#top">Back to the beginning <span aria-hidden="true">↑</span></a><nav aria-label="Footer navigation">${link("/contact/", "Contact")}${link("/credits/", "Asset credits")}${link("/privacy/", "Privacy")}</nav></div><div class="footer-wordmark">LAVA</div><div class="footer-bottom"><span>© ${new Date().getFullYear()} LAVA</span><span>Independent architectural concept</span><a href="https://github.com/Ngh1aa/Lava" target="_blank" rel="noopener noreferrer">Project source ↗</a></div></footer>`;
}
function home() {
  return `${heroSection()}${visionSection()}<section class="home-index section"><div class="section-top"><span>The project, in perspective</span><span>Explore the chapters</span></div><div class="chapter-grid"><a href="/project/"><span>01 / The idea</span><h2>One place.<br>Many possibilities.</h2><p>Discover the thinking behind LAVA.</p><span class="chapter-arrow" aria-hidden="true">↗</span></a><a href="/architecture/"><img src="/images/structure.webp" width="1600" height="1000" alt="Modern Office Building reference by CN Entertainment"><span>02 / Architecture</span><h2>A study<br>in balance.</h2><span class="chapter-arrow" aria-hidden="true">↗</span></a></div></section><section class="home-spaces section"><div class="section-top"><span>03 / Find your space</span>${link("/spaces/", "Explore all spaces")}</div><h2>Made for the way<br>you want to be.</h2><div class="catalogue-grid">${spaces
    .filter((s) => s.id === "gallery-lounge" || s.id === "open-terrace")
    .map((s) => spaceCard(s))
    .join(
      "",
    )}</div></section>${nextChapter("04", "Your next perspective.", "/enquiry/", "Start a conversation")}`;
}
function project() {
  return `${heading("The project", "A place for<br>what comes next.", c.overview.body)}${photo(0, "project-cover", true)}<section class="project-story section"><span class="eyebrow">01 / The idea</span><h2>Between the city<br>and a quieter world.</h2><div class="story-copy"><p>${c.statement}</p><p>The concept unfolds as a vertical neighbourhood: a shared arrival, adaptable workplaces and a rooftop landscape. Each level adds another way to experience the whole.</p><p class="concept-note">LAVA is an independent design concept. Location, areas, pricing and availability have not been established. Photography illustrates architectural references.</p></div></section>${overviewSection()}<section class="project-principles section"><span class="eyebrow">02 / The principles</span>${c.experiences.map((e, i) => `<article><span>0${i + 1}</span><h3>${e.title}</h3><p>${e.body}</p></article>`).join("")}</section>${nextChapter("02", "The idea, taking shape.", "/architecture/", "Explore the architecture")}`;
}
function architecture() {
  return `${heading("Architecture", "Form follows<br>possibility.", "Explore Modern Office Building, a licensed architectural reference by CN Entertainment. Change perspective, light or rotation. The six-level LAVA spatial programme is a separate design proposal.")}${architectureSection()}<section class="material-study section"><div><span class="eyebrow">A deliberate material language</span><h2>Weight.<br>Warmth. Rhythm.</h2></div><dl>${[
    [
      "Charcoal cladding",
      "Dark planes wrap the building and establish its strong silhouette.",
    ],
    [
      "A white frame",
      "An angular border draws the eye to the projecting glazed corner.",
    ],
    [
      "Corner glazing",
      "Slender mullions create a fine rhythm across the broad glass surfaces.",
    ],
  ]
    .map(([t, d], i) => `<div><dt>0${i + 1} / ${t}</dt><dd>${d}</dd></div>`)
    .join(
      "",
    )}</dl></section>${nextChapter("03", "Architecture, inhabited.", "/spaces/", "Find a space")}`;
}
function catalogue() {
  return `${heading("Spaces", "Find your<br>kind of space.", "Four spatial ideas across six terraced levels.", '<span class="concept-note">Concept collection</span>')}<section class="catalogue section" aria-label="Space catalogue"><form class="filter-bar" method="get" action="/spaces/" data-filters><fieldset><legend class="sr-only">Space use</legend>${["All", "Work", "Meet", "Unwind"].map((x, i) => `<label class="filter-option"><input type="radio" name="use" value="${x}" ${i === 0 ? "checked" : ""}><span>${x}</span></label>`).join("")}</fieldset><label class="level-filter">Level <select name="level" aria-label="Filter by level"><option value="all">All levels</option><option value="01">01 — Arrival</option><option value="02–04">02–04 — Workplace</option><option value="05">05 — Meetings</option><option value="06">06 — Rooftop</option></select></label><noscript><p>All four spaces are shown below. Filtering and saving need JavaScript.</p></noscript></form><div class="results-line"><p data-result-count role="status">4 spaces to explore</p><a href="/saved/">View saved spaces <span aria-hidden="true">↗</span></a></div><div class="catalogue-grid">${spaces.map((s, i) => spaceCard(s, i === 0)).join("")}</div><div class="empty-state" data-filter-empty hidden><span class="empty-symbol" aria-hidden="true">∅</span><h2>A different combination?</h2><p>No concept spaces match these filters. Try another use or level.</p><button class="solid-button" data-reset-filters>Show all spaces</button></div></section>${nextChapter("04", "A place in your plans.", "/enquiry/", "Discuss your ideas")}`;
}
function detail(s: Space) {
  return `<section class="detail-heading section">${breadcrumb(s.name, ["/spaces/", "Spaces"])}<div class="detail-title"><div><span class="eyebrow">${s.type} / Level ${s.level} / Concept space ${s.number}</span><h1>${s.headline.replace("\n", "<br>")}</h1></div><div class="detail-actions">${saveButton(s)}${link(`/enquiry/?space=${s.id}`, "Enquire about space", "solid-button")}</div></div>${saveFeedback()}</section><section class="detail-visual">${photo(s.photo, "detail-cover", true)}<span class="visual-caption">${s.note}</span></section><section class="space-overview section"><div><span class="eyebrow">${s.name}</span><h2>A space for<br>${s.type === "Work" ? "your own rhythm." : s.type === "Meet" ? "coming together." : "a slower moment."}</h2></div><div><p class="large-copy">${s.description}</p><ul class="feature-list">${s.features.map((f) => `<li>${f}</li>`).join("")}</ul></div></section><section class="plan-section section"><div class="plan-intro"><span class="eyebrow">The spatial idea</span><h2>Room to<br>imagine.</h2><p>Explore the relationship between the spaces. This original zoning sketch describes an idea, not a surveyed floor plan.</p><p class="concept-note">Concept zoning. Not to scale.</p><button class="text-link" data-download-plan="${s.id}" disabled>Download concept plan <span aria-hidden="true">↓</span></button></div><div class="plan-drawing">${planSvg(s)}<div class="plan-legend">${s.zones.map((z, i) => `<span>0${i + 1} / ${z}</span>`).join("")}</div></div></section><section class="related-spaces section"><div class="section-top"><span>Another perspective</span>${link("/spaces/", "All spaces")}</div><div class="catalogue-grid">${spaces
    .filter((x) => x.id !== s.id)
    .slice(0, 2)
    .map((s) => spaceCard(s))
    .join("")}</div></section>`;
}
function experience() {
  return `${heading("Experience", "A day, in<br>a different light.", "From the first conversation to the last light on the terrace. A building shaped around the moments in between.")}${photo(1, "experience-cover", true)}<section class="day-story section">${[
    {
      time: "09:00",
      title: "Arrive. Find your rhythm.",
      body: "A generous arrival leads to the lounge. Pause for a coffee, meet a colleague, or move straight into the day.",
      href: "/spaces/gallery-lounge/",
      label: "The gallery lounge",
    },
    {
      time: "13:00",
      title: "Make room for a new idea.",
      body: "A change of setting can change a conversation. Move from the open workplace to a quieter meeting space.",
      href: "/spaces/meeting-suite/",
      label: "The meeting suite",
    },
    {
      time: "18:00",
      title: "Leave space for the sky.",
      body: "A planted edge and a seat under the open sky. Step away from the working day without leaving the building.",
      href: "/spaces/open-terrace/",
      label: "The open terrace",
    },
  ]
    .map(
      (d) =>
        `<article><span class="day-time">${d.time}</span><div><h2>${d.title}</h2><p>${d.body}</p>${link(d.href, d.label)}</div></article>`,
    )
    .join(
      "",
    )}</section>${experienceSection()}${nextChapter("05", "See what moves you.", "/gallery/", "Explore the image collection")}`;
}
function gallery() {
  return `${heading("Gallery", "A collection<br>of perspectives.", "Real places. Shared inspiration. A photographic study of the light, materials and spaces that inform LAVA. Every image is credited to its photographer.")}<section class="gallery-collection section"><div class="gallery-filter" role="group" aria-label="Filter photographs">${["All", "Exterior", "Interior", "Open-air", "Facade"].map((x, i) => `<button type="button" data-photo-filter="${x}" aria-pressed="${i === 0}">${x}</button>`).join("")}</div><p class="collection-count" role="status" data-photo-count>${c.gallery.length} architectural references</p><div class="gallery-grid">${c.gallery.map((g, i) => `<div data-photo-category="${g.category.split(" ")[0]}">${photo(i, "gallery-item")}<div class="gallery-item-title"><h2>${g.title}</h2><span>0${i + 1} / 0${c.gallery.length}</span></div></div>`).join("")}</div></section>${nextChapter("06", "Keep the conversation going.", "/enquiry/", "Share your perspective")}`;
}
function saved() {
  return `${heading("Saved spaces", "Your own<br>perspective.", "Keep the spaces that speak to you together. Add them to one enquiry, or continue exploring before you decide.")}<section class="saved-content section"><div class="results-line"><p role="status" data-shortlist-count>Loading your saved spaces…</p><button class="text-link" data-clear-saved hidden>Clear selection</button></div>${saveFeedback()}<div class="catalogue-grid" data-shortlist-grid>${spaces.map((s) => spaceCard(s)).join("")}</div><div class="empty-state" data-saved-empty hidden><span class="empty-symbol" aria-hidden="true">◇</span><h2>Make room for a favourite.</h2><p>Save a space as you explore. Your selection will be waiting here on this browser.</p>${link("/spaces/", "Explore the spaces", "solid-button")}</div><div class="shortlist-actions" data-shortlist-actions hidden>${link("/enquiry/?selection=saved", "Enquire with selection", "solid-button")}${link("/spaces/", "Continue exploring")}</div><p class="concept-note" data-storage-note>Only space choices are stored in this browser. No account needed.</p><p class="form-status" role="status" data-save-status></p><noscript><p>Saved spaces need JavaScript. You can explore every space using the links above.</p></noscript></section>`;
}
