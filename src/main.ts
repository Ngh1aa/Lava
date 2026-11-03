import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "./style.css";
import { content, contactEmail, asset } from "./content";
import type { SceneController } from "./scene";

const $ = <T extends Element = HTMLElement>(selector: string) => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
};
const $$ = <T extends Element = HTMLElement>(selector: string) =>
  Array.from(document.querySelectorAll<T>(selector));
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
if (new URLSearchParams(location.search).get("direction") === "b")
  document.documentElement.dataset.direction = "b";
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
    const target = document.querySelector(link.hash);
    const heading = target?.querySelector<HTMLElement>("h2");
    if (heading) {
      heading.tabIndex = -1;
      requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  }),
);
matchMedia("(min-width: 840px)").addEventListener("change", (e) => {
  if (e.matches && menu.open) menu.close();
});

let viewer: SceneController | undefined;
let hero: SceneController | undefined;
let selectedView = 0;
let isDay = false;
let lowPower = false;
const statuses = { hero: $("#hero-status"), viewer: $("#showcase-status") };
function fallback(kind: "hero" | "viewer") {
  const host = $(kind === "hero" ? "#hero-scene" : "#architecture-scene");
  host.setAttribute("aria-busy", "false");
  host.dataset.render = "fallback";
  $<HTMLButtonElement>(`[data-deactivate="${kind}"]`).hidden = true;
  statuses[kind].textContent = "Still perspective";
  if (kind === "viewer")
    $$<HTMLButtonElement>(
      ".showcase-tools button, .camera-controls button",
    ).forEach((b) => {
      b.disabled = true;
      b.title = "The still perspective is active on this device";
    });
}
const stillMode = new URLSearchParams(location.search).get("view") === "still";
// Touch devices keep a still first frame until requested: lower data, CPU and battery cost.
const onDemand =
  matchMedia("(pointer: coarse)").matches ||
  navigator.connection?.saveData === true;
function offerScene(kind: "hero" | "viewer") {
  const host = $(kind === "hero" ? "#hero-scene" : "#architecture-scene");
  host.setAttribute("aria-busy", "false");
  host.dataset.render = "still";
  statuses[kind].textContent = "";
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
          statuses[kind].textContent =
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
            $<HTMLButtonElement>(`[data-deactivate="${kind}"]`).hidden = false;
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
    statuses[kind].textContent = "Preparing the perspective";
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
    $(kind === "hero" ? "#hero-scene" : "#architecture-scene").classList.remove(
      "is-ready",
    );
    button.hidden = true;
    offerScene(kind);
    $<HTMLButtonElement>(`[data-activate="${kind}"]`).focus();
  }),
);
// Let typography and fallback paint before downloading the isolated 3D chunk.
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
lazyScene.observe($("#architecture-scene"));
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
  fallbackImage.src = asset(index === 2 ? "structure.webp" : "exterior.webp");
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
$(".quality-toggle").addEventListener("click", (event) => {
  lowPower = !lowPower;
  (event.currentTarget as HTMLButtonElement).setAttribute(
    "aria-pressed",
    String(lowPower),
  );
  viewer?.setLowPower(lowPower);
  hero?.setLowPower(lowPower);
  statuses.viewer.textContent = lowPower
    ? "Low power active"
    : "Drag to explore";
});
$$<HTMLButtonElement>("[data-orbit]").forEach((button) =>
  button.addEventListener("click", () =>
    viewer?.orbit(Number(button.dataset.orbit)),
  ),
);

// Gallery: native image links remain useful if JS is unavailable.
const lightbox = $<HTMLDialogElement>("#lightbox");
let imageIndex = 0;
let galleryOpener: HTMLElement | undefined;
function showImage(index: number) {
  imageIndex = (index + content.gallery.length) % content.gallery.length;
  const item = content.gallery[imageIndex];
  const image = $<HTMLImageElement>("#lightbox-image");
  image.src = asset(item.image);
  image.alt = item.alt;
  $("#lightbox-title").textContent = item.title;
  $("#lightbox-category").textContent = item.category;
  $("#lightbox-count").textContent =
    `0${imageIndex + 1} / 0${content.gallery.length}`;
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
$(".lightbox-prev").addEventListener("click", () => showImage(imageIndex - 1));
$(".lightbox-next").addEventListener("click", () => showImage(imageIndex + 1));
lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    showImage(imageIndex + 1);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    showImage(imageIndex - 1);
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
    if (Math.abs(delta) > 50) showImage(imageIndex + (delta < 0 ? 1 : -1));
  },
  { passive: true },
);
$$<HTMLButtonElement>("[data-gallery-scroll]").forEach((button) =>
  button.addEventListener("click", () => {
    const track = $(".gallery-track");
    track.scrollBy({
      left: track.clientWidth * 0.7 * Number(button.dataset.galleryScroll),
      behavior: reduced.matches ? "instant" : "smooth",
    });
  }),
);

const form = $<HTMLFormElement>(".enquiry-form");
$<HTMLButtonElement>(".form-submit").disabled = false;
const fields = ["name", "email", "message"] as const;
const validInbox = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(
  contactEmail,
);
if (validInbox) {
  $(".form-submit span").textContent = "Prepare email";
  $("#form-note").textContent =
    `Prepare an email to ${contactEmail}. Your email app opens before anything is sent.`;
}
function validate(field: (typeof fields)[number]) {
  const input = $<HTMLInputElement | HTMLTextAreaElement>(`#${field}`);
  const value = input.value.trim();
  let error = "";
  if (!value)
    error =
      field === "name"
        ? "Please enter your name."
        : field === "email"
          ? "Please enter your email address."
          : "Please tell us a little about your enquiry.";
  else if (field === "email" && !input.validity.valid)
    error = "Enter an email address like name@example.com.";
  else if (field === "message" && value.length < 10)
    error = "Please add a little more detail (at least 10 characters).";
  input.setAttribute("aria-invalid", String(Boolean(error)));
  $(`#${field}-error`).textContent = error;
  return !error;
}
fields.forEach((field) =>
  $(`#${field}`).addEventListener("input", () => {
    if ($(`#${field}`).getAttribute("aria-invalid") === "true") validate(field);
  }),
);
function enquiryBody() {
  const data = new FormData(form);
  return `LAVA enquiry\n\nName: ${String(data.get("name")).trim()}\nEmail: ${String(data.get("email")).trim()}\nInterest: ${String(data.get("interest"))}\n\n${String(data.get("message")).trim()}`;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const results = fields.map(validate);
  const firstInvalid = results.indexOf(false);
  if (firstInvalid >= 0) {
    $<HTMLInputElement>(`#${fields[firstInvalid]}`).focus();
    $("#form-status").textContent =
      "Please review the highlighted fields. Your details are still here.";
    return;
  }
  const body = enquiryBody();
  if (validInbox) {
    location.href = `mailto:${contactEmail}?subject=${encodeURIComponent("LAVA — A conversation")}&body=${encodeURIComponent(body)}`;
    $("#form-status").textContent =
      "Continue in your email app to review and send. If it did not open, save your enquiry instead.";
    let downloadButton =
      form.querySelector<HTMLButtonElement>(".download-enquiry");
    if (!downloadButton) {
      downloadButton = document.createElement("button");
      downloadButton.type = "button";
      downloadButton.className = "download-enquiry enquiry-external";
      downloadButton.textContent = "Save enquiry";
      form.append(downloadButton);
      downloadButton.addEventListener("click", () => {
        if (fields.map(validate).every(Boolean)) downloadDraft(enquiryBody());
      });
    }
  } else downloadDraft(body);
});
function downloadDraft(body: string) {
  try {
    const url = URL.createObjectURL(
      new Blob([body], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "LAVA-enquiry.txt";
    document.body.append(link);
    link.click();
    link.remove();
    // The browser owns the download after the click; releasing on the next task preserves it.
    setTimeout(() => URL.revokeObjectURL(url), 0);
    $("#form-status").textContent =
      "Your enquiry file is ready. It has not been sent. Keep it to share when you get in touch.";
  } catch {
    $("#form-status").textContent =
      "The file could not be created. Your details are still here; copy your message and try again.";
  }
}
