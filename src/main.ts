import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "./style.css";
import { content, asset } from "./content";
import { initJourney } from "./journey";

// Keep shared bookmarks from the original single-page experience useful.
const legacyPages: Record<string, string> = {
  "#architecture": "architecture/",
  "#spaces": "spaces/",
  "#gallery": "gallery/",
  "#enquiry": "enquiry/",
  "#experience": "experience/",
  "#overview": "project/",
};
if (
  document.querySelector<HTMLElement>("main")?.dataset.page === "/" &&
  legacyPages[location.hash]
) {
  const root = new URL(
    document.documentElement.dataset.root ?? "./",
    location.href,
  );
  location.replace(new URL(legacyPages[location.hash], root).href);
}

const $ = <T extends Element = HTMLElement>(selector: string) => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
};
const $$ = <T extends Element = HTMLElement>(selector: string) =>
  Array.from(document.querySelectorAll<T>(selector));
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
if (!reduced.matches) {
  document.documentElement.classList.add("js-motion", "intro");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  $$("[data-reveal]").forEach((el) => observer.observe(el));
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      document.documentElement.classList.remove("js-motion", "intro");
      observer.disconnect();
    }
  });
}

// Native dialogs provide focus trapping and Escape behavior, with focus restored to the opener.
const menu = $<HTMLDialogElement>("#mobile-menu");
const menuToggle = $<HTMLButtonElement>(".menu-toggle");
menuToggle.addEventListener("click", () => {
  menu.showModal();
  menuToggle.setAttribute("aria-expanded", "true");
});
$(".menu-close").addEventListener("click", () => menu.close());
menu.addEventListener("close", () =>
  menuToggle.setAttribute("aria-expanded", "false"),
);
menu.querySelectorAll<HTMLAnchorElement>("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.close();
    const target = link.hash ? document.querySelector(link.hash) : null;
    const heading = target?.querySelector<HTMLElement>("h2");
    if (heading) {
      heading.tabIndex = -1;
      requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  }),
);
matchMedia("(min-width: 1100px)").addEventListener("change", (e) => {
  if (e.matches && menu.open) menu.close();
});

initJourney();

// Gallery: native image links remain useful if JS is unavailable.
const lightbox = $<HTMLDialogElement>("#lightbox");
let imageIndex = 0;
let galleryOpener: HTMLElement | undefined;
function activeImages() {
  const collection = document.querySelector(".gallery-collection");
  return collection
    ? Array.from(
        collection.querySelectorAll<HTMLAnchorElement>("[data-gallery]"),
      )
        .filter((link) => !link.closest("[hidden]"))
        .map((link) => Number(link.dataset.gallery))
    : content.gallery.map((_, index) => index);
}
function showImage(index: number) {
  imageIndex = (index + content.gallery.length) % content.gallery.length;
  const item = content.gallery[imageIndex];
  const image = $<HTMLImageElement>("#lightbox-image");
  image.src = asset(item.image);
  image.alt = item.alt;
  $("#lightbox-title").textContent = item.title;
  $("#lightbox-category").textContent = item.category;
  const credit = $<HTMLAnchorElement>("#lightbox-credit");
  credit.href = item.source;
  credit.textContent = `Photo: ${item.photographer}`;
  const visible = activeImages();
  $("#lightbox-count").textContent =
    `${String(visible.indexOf(imageIndex) + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
  $$<HTMLButtonElement>(".lightbox-prev, .lightbox-next").forEach(
    (button) => (button.disabled = visible.length < 2),
  );
}
function stepImage(direction: number) {
  const visible = activeImages();
  if (!visible.length) return;
  const current = visible.indexOf(imageIndex);
  showImage(visible[(current + direction + visible.length) % visible.length]);
}
$$<HTMLAnchorElement>("[data-gallery]").forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    galleryOpener = link;
    showImage(Number(link.dataset.gallery));
    lightbox.showModal();
  }),
);
$(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("close", () => galleryOpener?.focus());
$(".lightbox-prev").addEventListener("click", () => stepImage(-1));
$(".lightbox-next").addEventListener("click", () => stepImage(1));
lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    stepImage(1);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    stepImage(-1);
  }
});
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    const r = lightbox.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      lightbox.close();
  }
});
let touchStart = 0;
$(".lightbox-stage").addEventListener(
  "touchstart",
  (event) => {
    touchStart = event.changedTouches[0].clientX;
  },
  { passive: true },
);
$(".lightbox-stage").addEventListener(
  "touchend",
  (event) => {
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 50) stepImage(delta < 0 ? 1 : -1);
  },
  { passive: true },
);
