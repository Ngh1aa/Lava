import { content as c } from "./content.ts";
import { spaces, spaceById, type Space } from "./spaces.ts";
import {
  overviewSection,
  experienceSection,
  lightboxSection,
} from "./sections.ts";
import { enquiryPage } from "./enquiry-page.ts";

export function pageDescription(path: string) {
  const space = spaceById(path.match(/^\/spaces\/([^/]+)\/$/)?.[1] ?? "");
  if (space) return `${space.name}. ${space.description}`;
  const descriptions: Record<string, string> = {
    "/project/":
      "Discover Harpa Concert Hall in Reykjavík, its architects and architectural idea.",
    "/architecture/":
      "Explore the form, faceted glass and light of Harpa Concert Hall.",
    "/spaces/":
      "Explore four architectural perspectives on Harpa Concert Hall.",
    "/experience/":
      "Explore music, light and public life at Harpa Concert Hall in Reykjavík.",
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
      "Photographer credits and licenses for the Harpa Concert Hall collection.",
    "/privacy/":
      "How LAVA handles saved spaces, local enquiry drafts, downloads and external links.",
  };
  return (
    descriptions[path] ??
    "LAVA. An architectural exploration of light, form and a different way of being in space."
  );
}

function contact() {
  return `${heading("Contact", "Architecture.<br>A conversation.", "Continue your exploration of Harpa, or collect your thoughts about its architecture.")}<section class="contact-options section"><article><span>01 / Your idea</span><h2>Your perspective.</h2><p>Prepare a personal note about the architecture, the spaces or a collaboration. Review it before downloading a copy.</p>${link("/enquiry/", "Start an enquiry", "solid-button")}</article><article><span>02 / Visit Harpa</span><h2>See it in person.</h2><p>For concerts, visiting information and venue enquiries, continue to Harpa’s official website.</p>${link("https://www.harpa.is/en", "Visit Harpa")}</article></section><section class="contact-faq section"><h2>Before we begin.</h2><div class="experience-list">${[
    [
      "Can I book or lease a space?",
      "This is an independent study of Harpa’s architecture. It does not provide venue reservations, tickets, commercial offers or live availability.",
    ],
    [
      "What happens to my enquiry?",
      "Your draft remains in this browser tab. You can review it and download a text file. No enquiry is sent to a server. If a verified email is configured, you can open a draft in your own email app.",
    ],
    [
      "Which building is featured?",
      "The main collection shows Harpa Concert Hall. LAVA is an independent architectural study, not Harpa’s official website.",
    ],
  ]
    .map(
      ([q, a]) =>
        `<details><summary>${q}<span class="detail-plus" aria-hidden="true"></span></summary><p>${a}</p></details>`,
    )
    .join("")}</div></section>`;
}
function credits() {
 return `${heading("Asset credits","One building.<br>Six perspectives.","All photographs on the main LAVA pages depict Harpa Concert Hall. Each source and license is listed below.")}<section class="credits-list section">${c.gallery.map((p,i)=>`<article><img src="/images/${p.image}" ${responsivePhoto(i,"40vw")} alt="${p.alt}" width="${p.width}" height="${p.height}" loading="lazy"><div><span class="eyebrow">0${i+1} / ${p.category}</span><h2>${p.photographer}</h2><p>${p.alt}</p><div class="credit-actions">${link(p.source,"Original photograph")}${link(p.license,"Photo license")}</div></div></article>`).join("")}<p>Images are resized and encoded as WebP; layout may crop their displayed framing. No endorsement by the venue, architects or photographers is implied. Syncopate: Apache 2.0. Manrope: SIL OFL. Architectural sources: Henning Larsen and Batteríið Architects.</p></section>`;
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
                                    "This page could not be found. Continue exploring Harpa below.",
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
  ["project", "The building"],
  ["architecture", "Architecture"],
  ["spaces", "Spaces"],
  ["gallery", "Gallery"],
];
export const link = (href: string, label: string, cls = "text-link") =>
  `<a class="${cls}" href="${href}">${label}<svg class="link-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg></a>`;
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
  return `<a class="skip-link" href="#main">Skip to content</a><header class="header" id="top"><a class="header-brand" href="/" aria-label="LAVA home">LAVA<span class="brand-mark" aria-hidden="true">/</span></a><nav class="desktop-nav" aria-label="Main navigation">${nav.map(([id, label]) => `<a href="/${id}/" ${path.startsWith(`/${id}/`) ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav><div class="header-actions"><a class="header-contact" href="/contact/">Contact <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">Menu <span class="menu-lines" aria-hidden="true"></span></button></div></header><dialog class="mobile-menu" id="mobile-menu" aria-label="Navigation"><div class="menu-top"><span>LAVA /</span><button class="menu-close" type="button">Close <span aria-hidden="true">×</span></button></div><nav aria-label="Mobile navigation">${[...nav, ["contact", "Contact"]].map(([id, label], i) => `<a href="/${id}/" ${path.startsWith(`/${id}/`) ? 'aria-current="page"' : ""}><span class="menu-number">0${i + 1}</span>${label}</a>`).join("")}</nav><p>${c.tagline}</p></dialog>`;
}
function footer() {
  return `<footer class="footer section"><div class="footer-top"><a href="#top">Back to the beginning <span aria-hidden="true">↑</span></a><nav aria-label="Footer navigation">${link("/contact/", "Contact")}${link("/credits/", "Asset credits")}${link("/privacy/", "Privacy")}</nav></div><div class="footer-wordmark">LAVA</div><div class="footer-bottom"><span>© ${new Date().getFullYear()} LAVA</span><span>Independent study / Harpa</span><a href="https://github.com/Ngh1aa/Lava" target="_blank" rel="noopener noreferrer">Project source ↗</a></div></footer>`;
}
function home() {
  return `<section class="harpa-hero" aria-labelledby="hero-title"><picture><source media="(max-width: 767px)" srcset="/images/harpa-0-mobile.webp"><img src="/images/harpa-0.webp" ${responsivePhoto(0, "100vw")} alt="${c.gallery[0].alt}" width="${c.gallery[0].width}" height="${c.gallery[0].height}" fetchpriority="high"></picture><div class="harpa-hero-top"><span>01 / Reykjavík, Iceland</span><span>Harpa Concert Hall</span></div><div class="harpa-title-brand" aria-hidden="true">LAVA</div><div class="harpa-hero-copy"><span class="eyebrow">LAVA / An architectural study</span><h1 id="hero-title">A symphony<br>of light.</h1>${link("/architecture/", "Explore Harpa", "solid-button")}</div><a class="harpa-photo-credit" href="${c.gallery[0].source}">Photo: ${c.gallery[0].photographer} ↗</a></section><section class="project-story home-intro section"><span class="eyebrow">One building, in focus</span><h2>Rock-solid.<br>Light-filled.</h2><div class="story-copy"><p>${c.statement}</p>${link("/project/", "Discover the building")}</div></section>${projectDossier()}<section class="home-index section"><div class="section-top"><span>Two ways to explore</span><span>Form / Public life</span></div><div class="chapter-grid"><a href="/architecture/"><img src="/images/harpa-3.webp" ${responsivePhoto(3, "(max-width: 767px) 100vw, 50vw")} alt="Harpa facade detail" width="1600" height="1067" loading="lazy"><span>02 / Architecture</span><h2>A crystalline<br>envelope.</h2><span class="chapter-arrow" aria-hidden="true">↗</span></a><a href="/spaces/"><img src="/images/harpa-1.webp" ${responsivePhoto(1, "(max-width: 767px) 100vw, 50vw")} alt="Light in Harpa foyer" width="1600" height="1067" loading="lazy"><span>03 / Spaces</span><h2>A place<br>to gather.</h2><span class="chapter-arrow" aria-hidden="true">↗</span></a></div></section>${editorialEssay("The envelope", "A landscape.<br>Made of glass.", "Basalt formations become a faceted skin of glass and steel. Its depth gives the building a different expression from every angle.", 5, "/architecture/", "Read the architecture")}${editorialEssay("Public life", "Culture.<br>Beyond the concert.", "The foyer is a place to pause, meet and look out towards the water. Daily life unfolds between the performance spaces and the luminous facade.", 1, "/experience/", "Discover the experience", true)}${nextChapter("07", "Harpa, in perspective.", "/gallery/", "View the collection")}`;
}


function projectDossier(showLink = true) {
  return `<section class="project-dossier section" aria-labelledby="dossier-title"><div class="dossier-heading"><span class="eyebrow">The project / Reykjavík</span><h2 id="dossier-title">Rooted in Iceland.<br>Open to the world.</h2>${showLink ? link("/project/", "Meet the building") : ""}</div><dl><div><dt>Architecture</dt><dd>Henning Larsen<br>Batteríið Architects</dd></div><div><dt>Facade collaboration</dt><dd>Olafur Eliasson</dd></div><div><dt>Completed</dt><dd>2011</dd></div><div><dt>Recognition</dt><dd>2013 Mies van der Rohe Award</dd></div></dl></section>`;
}
function editorialEssay(label: string, title: string, copy: string, image: number, href: string, action: string, reverse = false) {
  return `<section class="editorial-essay section${reverse ? " editorial-essay-reverse" : ""}">${photo(image, "essay-photo")}<div class="essay-copy"><span class="eyebrow">${label}</span><h2 data-reveal>${title}</h2><p>${copy}</p>${link(href, action)}</div></section>`;
}

function project() {
 return `${heading("The building", "Harpa.<br>A cultural home.", c.overview.body)}${photo(2,"project-cover",true)}<section class="project-story section"><span class="eyebrow">At the harbour</span><h2>Between the city<br>and the sea.</h2><div class="story-copy"><p>Opened in 2011, Harpa combines a concert hall and conference centre on Reykjavík’s waterfront. Its architecture brings public gathering spaces behind a faceted glass envelope.</p><p>The facade draws inspiration from Iceland’s basalt formations. Its changing reflections connect the building to the weather, water and city around it.</p><p class="concept-note">LAVA is an independent architectural study of Harpa, not the venue’s official website.</p>${link("https://www.henninglarsen.com/projects/harpa", "Project source: Henning Larsen")}${link("https://www.arkitekt.is/en/project/harpa", "Project source: Batteríið Architects")}</div></section>${overviewSection()}${projectDossier(false)}${nextChapter("02","Read the architecture.","/architecture/","Explore form and light")}`;
}

function architecture() {
 return `${heading("Architecture", "Landscape.<br>Made crystalline.", "An architectural reading of Harpa’s silhouette, faceted glass and changing light.")}${photo(3,"project-cover",true)}<section class="material-study section"><div><span class="eyebrow">Form / Material / Light</span><h2>A different<br>reflection.</h2></div><dl><div><dt>01 / Basalt as inspiration</dt><dd>The glass facade draws on interlocking basalt formations along the Icelandic coast.</dd></div><div><dt>02 / A faceted envelope</dt><dd>The quasi-brick geometry creates a changing surface of reflection and transparency.</dd></div><div><dt>03 / A shared interior</dt><dd>Behind the glass, the foyer connects public life with the concert and conference programme.</dd></div></dl></section>${editorialEssay("Beyond the facade", "Depth.<br>Reflection. Light.", "The glass envelope frames a changing view of the harbour. From inside, its geometry becomes part of the experience of moving through the building.", 5, "/gallery/", "Explore the details")}${nextChapter("03","Inside the envelope.","/spaces/","Explore the spaces")}`;
}

function catalogue() {
 return `${heading("Spaces", "A shared<br>cultural home.", "Four ways to read the relationship between Harpa’s public spaces, glass and harbour setting.")}<section class="catalogue section"><div class="catalogue-grid">${spaces.map(x=>`<article class="catalogue-card"><a href="/spaces/${x.id}/"><img src="/images/${x.image}" ${responsivePhoto(x.photo, "(max-width: 767px) 100vw, 50vw")} alt="${c.gallery[x.photo].alt}" width="${c.gallery[x.photo].width}" height="${c.gallery[x.photo].height}" loading="lazy"><span class="eyebrow">${x.number} / Harpa</span><h2>${x.name}</h2><p>${x.description}</p><span class="text-link">Explore this perspective ↗</span></a></article>`).join("")}</div></section>`;
}

function detail(s: Space) {
 const related = spaces.filter(other => other.id !== s.id).slice(0, 2);
 return `${heading(s.name,s.headline.replace("\n","<br>"),s.description)}${photo(s.photo,"detail-cover",true)}<section class="space-overview section"><div><span class="eyebrow">Harpa / ${s.number}</span><h2>${s.name}</h2></div><div><p class="large-copy">${s.atmosphere}</p><ul class="feature-list">${s.features.map(f=>`<li>${f}</li>`).join("")}</ul><p class="concept-note">Architectural interpretation, not a room booking or floor plan.</p>${link("https://www.henninglarsen.com/projects/harpa","Project source")}</div></section><section class="related-perspectives section"><div class="section-top"><h2>Continue exploring.</h2>${link("/spaces/","All spaces")}</div><div class="related-grid">${related.map(other => `<a href="/spaces/${other.id}/"><img src="/images/${other.image}" ${responsivePhoto(other.photo,"(max-width: 767px) 100vw, 50vw")} alt="${c.gallery[other.photo].alt}" width="${c.gallery[other.photo].width}" height="${c.gallery[other.photo].height}" loading="lazy"><span>${other.number} / ${other.name}</span></a>`).join("")}</div></section>`;
}

function experience() {
 return `${heading("Experience","Music.<br>Everyday life.","Harpa is a cultural gathering place as well as a concert and conference venue.")}${photo(1,"experience-cover",true)}${experienceSection()}${editorialEssay("A public interior", "A place to pause.", "A mirrored ceiling, dark surfaces and changing daylight extend the visual rhythm of the glass facade into the foyer.",4,"/spaces/","Explore the spaces")}${nextChapter("05","See Harpa in detail.","/gallery/","Open the collection")}`;
}

function gallery() {
  return `${heading("Gallery", "A collection<br>of perspectives.", "Harpa Concert Hall, from the harbour to the glass envelope. Six photographs, each credited to its photographer.")}<section class="gallery-collection section"><div class="gallery-filter" role="group" aria-label="Filter photographs">${["All", "Exterior", "Interior", "Facade"].map((x, i) => `<button type="button" data-photo-filter="${x}" aria-pressed="${i === 0}">${x}</button>`).join("")}</div><p class="collection-count" role="status" data-photo-count>${c.gallery.length} Harpa photographs</p><div class="gallery-grid">${c.gallery.map((g, i) => `<div data-photo-category="${g.category.split(" ")[0]}">${photo(i, "gallery-item", i === 0)}<div class="gallery-item-title"><h2>${g.title}</h2><span>0${i + 1} / 0${c.gallery.length}</span></div></div>`).join("")}</div></section>${nextChapter("06", "Keep the conversation going.", "/enquiry/", "Share your perspective")}`;
}
function saved() {
  return `${heading("Saved spaces", "Your own<br>perspective.", "Keep the spaces that speak to you together. Add them to one enquiry, or continue exploring before you decide.")}<section class="saved-content section"><div class="results-line"><p role="status" data-shortlist-count>Loading your saved spaces…</p><button class="text-link" data-clear-saved hidden>Clear selection</button></div>${saveFeedback()}<div class="catalogue-grid" data-shortlist-grid>${spaces.map((s) => spaceCard(s)).join("")}</div><div class="empty-state" data-saved-empty hidden><span class="empty-symbol" aria-hidden="true">◇</span><h2>Make room for a favourite.</h2><p>Save a space as you explore. Your selection will be waiting here on this browser.</p>${link("/spaces/", "Explore the spaces", "solid-button")}</div><div class="shortlist-actions" data-shortlist-actions hidden>${link("/enquiry/?selection=saved", "Enquire with selection", "solid-button")}${link("/spaces/", "Continue exploring")}</div><p class="concept-note" data-storage-note>Only space choices are stored in this browser. No account needed.</p><p class="form-status" role="status" data-save-status></p><noscript><p>Saved spaces need JavaScript. You can explore every space using the links above.</p></noscript></section>`;
}
