import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "./style.css";
import { content, asset } from "./content";
import { initJourney } from "./journey";
import type { SceneController } from "./scene";

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

function initScenes() {
  let viewer: SceneController | undefined;
  let hero: SceneController | undefined;
  let selectedView = 0;
  let isDay = false;
  let lowPower = false;
  const statuses = {
    hero: document.querySelector<HTMLElement>("#hero-status"),
    viewer: document.querySelector<HTMLElement>("#showcase-status"),
  };
  function fallback(kind: "hero" | "viewer") {
    const host = $(kind === "hero" ? "#hero-scene" : "#architecture-scene");
    host.setAttribute("aria-busy", "false");
    host.dataset.render = "fallback";
    $<HTMLButtonElement>(`[data-deactivate="${kind}"]`).hidden = true;
    statuses[kind]!.textContent = "Still perspective";
    if (kind === "viewer")
      $$<HTMLButtonElement>(
        ".showcase-tools button, .camera-controls button",
      ).forEach((b) => {
        b.disabled = true;
        b.title = "The still perspective is active on this device";
      });
  }
  const stillMode =
    new URLSearchParams(location.search).get("view") === "still";
  // Touch devices keep a still first frame until requested: lower data, CPU and battery cost.
  const onDemand =
    matchMedia("(pointer: coarse)").matches ||
    navigator.connection?.saveData === true;
  function offerScene(kind: "hero" | "viewer") {
    const host = $(kind === "hero" ? "#hero-scene" : "#architecture-scene");
    host.setAttribute("aria-busy", "false");
    host.dataset.render = "still";
    statuses[kind]!.textContent = "";
    $<HTMLButtonElement>(`[data-activate="${kind}"]`).hidden = false;
    if (kind === "viewer")
      $$<HTMLButtonElement>(
        ".showcase-tools button, .camera-controls button",
      ).forEach((button) => {
        button.disabled = true;
      });
  }
  async function mountScene(kind: "hero" | "viewer") {
    if (stillMode) {
      fallback(kind);
      return;
    }
    try {
      const { createScene } = await import("./scene");
      const instance = createScene(
        $(kind === "hero" ? "#hero-scene" : "#architecture-scene"),
        {
          hero: kind === "hero",
          onReady() {
            statuses[kind]!.textContent =
              kind === "hero"
                ? onDemand
                  ? reduced.matches
                    ? "3D perspective"
                    : "Scroll to explore"
                  : ""
                : onDemand
                  ? "Use arrows to rotate"
                  : "Drag to explore";
            $(
              kind === "hero" ? "#hero-scene" : "#architecture-scene",
            ).dataset.render = "webgl";
            if (onDemand)
              $<HTMLButtonElement>(`[data-deactivate="${kind}"]`).hidden =
                false;
            if (kind === "viewer")
              $$<HTMLButtonElement>(
                ".showcase-tools button, .camera-controls button",
              ).forEach((button) => {
                button.disabled = false;
              });
          },
          onError() {
            fallback(kind);
          },
        },
      );
      if (kind === "hero") hero = instance;
      else {
        viewer = instance;
        viewer.setView(selectedView);
        viewer.setDay(isDay);
        viewer.setLowPower(lowPower);
      }
    } catch {
      fallback(kind);
    }
  }
  $$<HTMLButtonElement>("[data-activate]").forEach((button) =>
    button.addEventListener("click", () => {
      const kind = button.dataset.activate as "hero" | "viewer";
      button.hidden = true;
      statuses[kind]!.textContent = "Preparing the perspective";
      $(kind === "hero" ? "#hero-scene" : "#architecture-scene").setAttribute(
        "aria-busy",
        "true",
      );
      void mountScene(kind);
    }),
  );
  $$<HTMLButtonElement>("[data-deactivate]").forEach((button) =>
    button.addEventListener("click", () => {
      const kind = button.dataset.deactivate as "hero" | "viewer";
      if (kind === "hero") {
        hero?.destroy();
        hero = undefined;
      } else {
        viewer?.destroy();
        viewer = undefined;
      }
      $(
        kind === "hero" ? "#hero-scene" : "#architecture-scene",
      ).classList.remove("is-ready");
      button.hidden = true;
      offerScene(kind);
      $<HTMLButtonElement>(`[data-activate="${kind}"]`).focus();
    }),
  );
  // Let typography and fallback paint before downloading the isolated 3D chunk.
  if (document.querySelector("#hero-scene"))
    requestAnimationFrame(() => {
      if (onDemand && !stillMode) offerScene("hero");
      else void mountScene("hero");
    });
  const lazyScene = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        lazyScene.disconnect();
        if (onDemand && !stillMode) offerScene("viewer");
        else void mountScene("viewer");
      }
    },
    { rootMargin: "500px" },
  );
  const viewerHost = document.querySelector("#architecture-scene");
  if (viewerHost) lazyScene.observe(viewerHost);
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) {
      hero?.destroy();
      viewer?.destroy();
    }
  });

  function selectView(index: number, moveFocus = false) {
    selectedView = index;
    const tabs = $$<HTMLButtonElement>("[data-view]");
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    if (moveFocus) tabs[index].focus();
    const view = content.views[index];
    $("#view-number").textContent = `0${index + 1} / 03 ${view.label}`;
    $("#view-description").setAttribute("aria-labelledby", `tab-${view.id}`);
    $("#view-description h3").textContent = view.title;
    $("#view-description p").textContent = view.description;
    const fallbackImage = $<HTMLImageElement>(
      "#architecture-scene .scene-fallback",
    );
    fallbackImage.src = asset(`${view.still}.webp`);
    $<HTMLSourceElement>("#architecture-scene source").srcset = asset(`${view.still}-mobile.webp`);
    viewer?.setView(index);
  }
  $$<HTMLButtonElement>("[data-view]").forEach((tab, index) => {
    tab.addEventListener("click", () => selectView(index));
    tab.addEventListener("keydown", (event) => {
      let next: number;
      if (event.key === "ArrowRight") next = (index + 1) % content.views.length;
      else if (event.key === "ArrowLeft")
        next = (index + content.views.length - 1) % content.views.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = content.views.length - 1;
      else return;
      event.preventDefault();
      selectView(next, true);
    });
  });
  $$<HTMLButtonElement>("[data-light]").forEach((button) =>
    button.addEventListener("click", () => {
      isDay = button.dataset.light === "day";
      $$("[data-light]").forEach((el) =>
        el.setAttribute("aria-pressed", String(el === button)),
      );
      viewer?.setDay(isDay);
    }),
  );
  document
    .querySelector(".quality-toggle")
    ?.addEventListener("click", (event) => {
      lowPower = !lowPower;
      (event.currentTarget as HTMLButtonElement).setAttribute(
        "aria-pressed",
        String(lowPower),
      );
      viewer?.setLowPower(lowPower);
      hero?.setLowPower(lowPower);
      statuses.viewer!.textContent = lowPower
        ? "Reduce detail active"
        : "Drag to explore";
    });
  $$<HTMLButtonElement>("[data-orbit]").forEach((button) =>
    button.addEventListener("click", () =>
      viewer?.orbit(Number(button.dataset.orbit)),
    ),
  );
}
initScenes();
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
