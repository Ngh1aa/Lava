import { spaceById } from "./spaces";
import { contactEmail } from "./content";

// brownfield-allow: Native state updates fill feedback slots rendered by page.ts,
// selected-space rows and enquiry review values. They do not replace page layout
// or move rendered components; query + append is progressive enhancement here.

const one = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
const all = <T extends HTMLElement = HTMLElement>(selector: string) =>
  Array.from(document.querySelectorAll<T>(selector));
const root = () =>
  new URL(document.documentElement.dataset.root ?? "./", location.href);
const url = (path: string) => new URL(path.replace(/^\//, ""), root()).href;
const SAVED = "lava.saved.v1";
const DRAFT = "lava.enquiry.v1";
const ids = (value: unknown): string[] =>
  Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id): id is string =>
              typeof id === "string" && Boolean(spaceById(id)),
          ),
        ),
      ]
    : [];
function readSaved() {
  try {
    return ids(JSON.parse(localStorage.getItem(SAVED) ?? "[]"));
  } catch {
    return [];
  }
}
function download(
  body: string,
  file: string,
  type = "text/plain;charset=utf-8",
) {
  const objectUrl = URL.createObjectURL(new Blob([body], { type }));
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = file;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
interface Draft {
  name: string;
  email: string;
  interest: string;
  message: string;
  spaces: string[];
}
const emptyDraft = (): Draft => ({
  name: "",
  email: "",
  interest: "Architecture and spaces",
  message: "",
  spaces: [],
});
function readDraft(): Draft {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(DRAFT) ?? "null");
    if (!value || typeof value !== "object") return emptyDraft();
    const v = value as Record<string, unknown>;
    return {
      name: typeof v.name === "string" ? v.name.slice(0, 100) : "",
      email: typeof v.email === "string" ? v.email.slice(0, 254) : "",
      interest:
        typeof v.interest === "string"
          ? v.interest.slice(0, 100)
          : "Architecture and spaces",
      message: typeof v.message === "string" ? v.message.slice(0, 3000) : "",
      spaces: ids(v.spaces),
    };
  } catch {
    return emptyDraft();
  }
}
const validEmail = (value: string) =>
  /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(value.trim());
const validDraft = (d: Draft) =>
  Boolean(
    d.name.trim() && validEmail(d.email) && d.message.trim().length >= 10,
  );
const draftBody = (d: Draft) =>
  `LAVA — Architectural concept enquiry\n\nName: ${d.name.trim()}\nEmail: ${d.email.trim()}\nInterest: ${d.interest}\nSpaces: ${d.spaces.map((id) => spaceById(id)?.name).join(", ") || "General project enquiry"}\n\n${d.message.trim()}\n\nConcept enquiry only. Not submitted, reserved or booked.`;

export function initJourney() {
  let saved = readSaved();
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
  let feedbackHost: HTMLElement | null = null;
  function getFeedback() {
    const feedback =
      one(".saved-content > [data-save-feedback]") ?? feedbackHost!;
    all("[data-save-feedback]").forEach((host) => {
      if (host !== feedback) host.hidden = true;
    });
    return feedback;
  }
  function refreshSaved() {
    all("[data-saved-count]").forEach(
      (el) => (el.textContent = String(saved.length)),
    );
    one(".saved-link")?.setAttribute(
      "aria-label",
      `Saved ${saved.length} spaces`,
    );
    all<HTMLButtonElement>("[data-save]").forEach((button) => {
      const s = spaceById(button.dataset.save ?? "");
      if (!s) return;
      const active = saved.includes(s.id);
      button.disabled = false;
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute(
        "aria-label",
        active ? `Remove ${s.name} from saved spaces` : `Save space: ${s.name}`,
      );
      button.replaceChildren();
      const mark = document.createElement("span");
      mark.ariaHidden = "true";
      mark.textContent = active ? "−" : "＋";
      button.append(mark, ` ${active ? "Remove" : "Save space"}`);
    });
    const grid = one("[data-shortlist-grid]");
    if (grid) {
      grid
        .querySelectorAll<HTMLElement>("[data-space]")
        .forEach(
          (card) => (card.hidden = !saved.includes(card.dataset.space ?? "")),
        );
      one("[data-shortlist-count]")!.textContent =
        `${saved.length} saved ${saved.length === 1 ? "space" : "spaces"}`;
      one("[data-saved-empty]")!.hidden = saved.length > 0;
      one("[data-shortlist-actions]")!.hidden = saved.length === 0;
      one("[data-clear-saved]")!.hidden = saved.length === 0;
    }
  }
  function setSaved(next: string[], message: string, allowUndo = true) {
    const previous = [...saved];
    try {
      localStorage.setItem(SAVED, JSON.stringify(next));
    } catch {
      const feedback = getFeedback();
      feedback.hidden = false;
      feedback.textContent =
        "Your browser could not save this selection. Open the space and enquire directly instead.";
      return;
    }
    saved = next;
    refreshSaved();
    const feedback = getFeedback();
    feedback.hidden = false;
    feedback.textContent = message;
    if (allowUndo) {
      const undo = document.createElement("button");
      undo.textContent = "Undo";
      undo.type = "button";
      undo.addEventListener("click", () => {
        setSaved(previous, "Selection restored.", false);
        const restored = one<HTMLElement>(
          "[data-shortlist-grid] [data-space]:not([hidden]) [data-save]",
        );
        if (restored) restored.focus();
        else {
          feedback.tabIndex = -1;
          feedback.focus();
        }
      });
      feedback.append(undo);
    }
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      if (!feedback.contains(document.activeElement)) feedback.hidden = true;
    }, 10000);
  }
  refreshSaved();
  all<HTMLButtonElement>("[data-save]").forEach((button) =>
    button.addEventListener("click", () => {
      feedbackHost =
        button
          .closest(".catalogue-card")
          ?.querySelector("[data-save-feedback]") ??
        button
          .closest(".detail-heading")
          ?.querySelector("[data-save-feedback]") ??
        null;
      const id = button.dataset.save!;
      const active = saved.includes(id);
      setSaved(
        active ? saved.filter((x) => x !== id) : [...saved, id],
        `${spaceById(id)!.name} ${active ? "removed." : "saved."}`,
      );
      if (one("[data-shortlist-grid]") && active) {
        (
          one<HTMLElement>(
            "[data-shortlist-grid] [data-space]:not([hidden]) [data-save]",
          ) ?? one<HTMLElement>("[data-saved-empty] a")
        )?.focus();
      }
    }),
  );
  one("[data-clear-saved]")?.addEventListener("click", () => {
    setSaved([], "Selection cleared.");
    one<HTMLElement>("[data-saved-empty] a")?.focus();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === SAVED) {
      saved = readSaved();
      refreshSaved();
    }
  });
  window.addEventListener("pageshow", () => {
    saved = readSaved();
    refreshSaved();
  });

  const filters = one<HTMLFormElement>("[data-filters]");
  if (filters) {
    function applyFilters(fromUrl = false) {
      const params = new URLSearchParams(location.search);
      if (fromUrl) {
        const use = params.get("use") ?? "All";
        const radio = Array.from(filters!.elements).find(
          (el) => el instanceof HTMLInputElement && el.value === use,
        ) as HTMLInputElement | undefined;
        (
          radio ?? filters!.querySelector<HTMLInputElement>('[value="All"]')!
        ).checked = true;
        const select = filters!.querySelector<HTMLSelectElement>("select")!;
        select.value = params.get("level") ?? "all";
        if (!select.value) select.value = "all";
      }
      const formData = new FormData(filters!);
      const use = String(formData.get("use"));
      const level = String(formData.get("level"));
      let count = 0;
      all(".catalogue [data-space]").forEach((card) => {
        card.hidden =
          !(use === "All" || card.dataset.type === use) ||
          !(level === "all" || card.dataset.level === level);
        if (!card.hidden) count++;
      });
      one("[data-result-count]")!.textContent =
        `${count} ${count === 1 ? "space" : "spaces"} to explore`;
      one("[data-filter-empty]")!.hidden = count > 0;
      if (!fromUrl) {
        const next = new URL(location.href);
        if (use === "All") next.searchParams.delete("use");
        else next.searchParams.set("use", use);
        if (level === "all") next.searchParams.delete("level");
        else next.searchParams.set("level", level);
        history.pushState(null, "", next);
      }
      try {
        sessionStorage.setItem("lava.space-filters.v1", location.search);
      } catch {
        /* Filtering remains usable without storage. */
      }
    }
    applyFilters(true);
    filters.addEventListener("change", () => applyFilters());
    filters.addEventListener("submit", (e) => e.preventDefault());
    window.addEventListener("popstate", () => applyFilters(true));
    one("[data-reset-filters]")?.addEventListener("click", () => {
      filters.reset();
      applyFilters();
      filters.querySelector<HTMLInputElement>("input")!.focus();
    });
  }
  const spaceBreadcrumb = one<HTMLAnchorElement>(
    '.detail-heading .breadcrumb a[href$="spaces/"]',
  );
  if (spaceBreadcrumb) {
    try {
      spaceBreadcrumb.href = url(
        `/spaces/${sessionStorage.getItem("lava.space-filters.v1") ?? ""}`,
      );
    } catch {
      /* The unfiltered native link remains available. */
    }
  }
  all<HTMLButtonElement>("[data-photo-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      all("[data-photo-filter]").forEach((el) =>
        el.setAttribute("aria-pressed", String(el === button)),
      );
      let count = 0;
      all("[data-photo-category]").forEach((el) => {
        el.hidden =
          button.dataset.photoFilter !== "All" &&
          el.dataset.photoCategory !== button.dataset.photoFilter;
        if (!el.hidden) count++;
      });
      one("[data-photo-count]")!.textContent =
        `${count} Harpa ${count === 1 ? "photograph" : "photographs"}`;
    }),
  );
  const workspace = one("[data-enquiry-step]");
  if (!workspace) return;
  // Re-read tab storage after history restoration, including a draft cleared on a later page.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) location.reload();
  });
  const step = Number(workspace.dataset.enquiryStep);
  const draft = readDraft();
  const params = new URLSearchParams(location.search);
  if (params.get("selection") === "saved") draft.spaces = [...saved];
  const direct = spaceById(params.get("space") ?? "");
  if (direct) draft.spaces = ids([...draft.spaces, direct.id]);
  const status = (message: string) => {
    const el = one("[data-enquiry-status]");
    if (el) el.textContent = message;
  };
  function persist() {
    try {
      sessionStorage.setItem(DRAFT, JSON.stringify(draft));
      return true;
    } catch {
      status(
        "Draft storage is unavailable in this browser. Keep this page open and download a copy below.",
      );
      return false;
    }
  }
  function selection() {
    const host = one("[data-selected-spaces]")!;
    host.replaceChildren();
    const title = document.createElement("h3");
    title.textContent = `${draft.spaces.length} selected ${draft.spaces.length === 1 ? "space" : "spaces"}`;
    host.append(title);
    if (!draft.spaces.length) {
      const p = document.createElement("p");
      p.textContent =
        "A general project enquiry. You can add spaces as you explore.";
      host.append(p);
    }
    draft.spaces.forEach((id) => {
      const s = spaceById(id)!;
      const row = document.createElement("div");
      row.className = "selected-space";
      const a = document.createElement("a");
      a.href = url(`/spaces/${id}/`);
      a.textContent = s.name;
      row.append(a);
      if (step === 0) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.ariaLabel = `Remove ${s.name} from enquiry`;
        remove.addEventListener("click", () => {
          draft.spaces = draft.spaces.filter((x) => x !== id);
          persist();
          selection();
          (
            one<HTMLElement>("[data-selected-spaces] button") ??
            one<HTMLElement>(".enquiry-aside > .text-link")
          )?.focus();
        });
        row.append(remove);
      }
      host.append(row);
    });
  }
  selection();
  if (step === 0) {
    const form = one<HTMLFormElement>(".journey-form")!;
    const fields = ["name", "email", "message"] as const;
    for (const key of [...fields, "interest"] as const) {
      const input = one<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >(`#${key}`)!;
      input.value = draft[key];
    }
    function validate(key: (typeof fields)[number]) {
      const input = one<HTMLInputElement | HTMLTextAreaElement>(`#${key}`)!;
      const value = input.value.trim();
      const error = !value
        ? key === "name"
          ? "Please enter your name."
          : key === "email"
            ? "Please enter your email address."
            : "Please tell us about your enquiry."
        : key === "email" && (!input.validity.valid || !validEmail(value))
          ? "Enter an email address like name@example.com."
          : key === "message" && value.length < 10
            ? "Please add at least 10 characters."
            : "";
      input.setAttribute("aria-invalid", String(Boolean(error)));
      one(`#${key}-error`)!.textContent = error;
      return !error;
    }
    function collect() {
      for (const key of [...fields, "interest"] as const)
        draft[key] = one<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >(`#${key}`)!.value;
    }
    form.addEventListener("input", (e) => {
      collect();
      persist();
      const key = (e.target as HTMLInputElement).id;
      if (
        fields.includes(key as (typeof fields)[number]) &&
        (e.target as HTMLElement).getAttribute("aria-invalid") === "true"
      )
        validate(key as (typeof fields)[number]);
    });
    form.addEventListener("change", () => {
      collect();
      persist();
    });
    one<HTMLButtonElement>(".form-submit")!.disabled = false;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = fields.map(validate);
      if (results.includes(false)) {
        one(`#${fields[results.indexOf(false)]}`)!.focus();
        status(
          "Please review the highlighted fields. Your details are still here.",
        );
        return;
      }
      collect();
      if (persist()) location.href = url("/enquiry/review/");
      else {
        let fallback = one<HTMLButtonElement>("[data-storage-download]");
        if (!fallback) {
          fallback = document.createElement("button");
          fallback.type = "button";
          fallback.className = "solid-button";
          fallback.dataset.storageDownload = "";
          fallback.textContent = "Download enquiry instead";
          fallback.addEventListener("click", () => {
            collect();
            if (fields.map(validate).every(Boolean)) {
              download(draftBody(draft), "LAVA-enquiry.txt");
              status("Your file is ready. Nothing has been sent.");
            }
          });
          form.append(fallback);
        }
      }
    });
    if ((direct || params.get("selection") === "saved") && persist()) {
      // Entry parameters are an intent, not a permanent filter. Consuming them keeps
      // a removed space from being re-added on refresh or Back to the same form.
      const next = new URL(location.href);
      next.searchParams.delete("space");
      next.searchParams.delete("selection");
      history.replaceState(null, "", next);
    }
  } else if (!validDraft(draft)) {
    one(step === 1 ? "[data-draft-review]" : "[data-draft-ready]")!.hidden =
      true;
    one("[data-draft-missing]")!.hidden = false;
  } else {
    if (step === 1) {
      const dl = one("[data-review-details]")!;
      for (const [label, value] of [
        ["Your name", draft.name],
        ["Email address", draft.email],
        ["Interest", draft.interest],
        [
          "Selected spaces",
          draft.spaces.map((id) => spaceById(id)!.name).join(", ") ||
            "General project enquiry",
        ],
        ["Your message", draft.message],
      ]) {
        const row = document.createElement("div");
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = value;
        row.append(dt, dd);
        dl.append(row);
      }
      const prepare = one<HTMLButtonElement>("[data-prepare-enquiry]")!;
      prepare.disabled = false;
      prepare.addEventListener(
        "click",
        () => (location.href = url("/enquiry/ready/")),
      );
    } else {
      const button = one<HTMLButtonElement>("[data-download-enquiry]")!;
      button.disabled = false;
      button.addEventListener("click", () => {
        try {
          download(draftBody(draft), "LAVA-enquiry.txt");
          status("Your enquiry file is ready. It has not been sent.");
        } catch {
          status(
            "The file could not be created. Your draft is still here. Try again or return to review your details.",
          );
        }
      });
      one("[data-ready-summary]")!.textContent =
        `Prepared for ${draft.name}. ${draft.spaces.length} selected ${draft.spaces.length === 1 ? "space" : "spaces"}`;
      if (/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(contactEmail)) {
        const email = one<HTMLAnchorElement>("[data-email-enquiry]")!;
        email.hidden = false;
        email.href = `mailto:${contactEmail}?subject=${encodeURIComponent("LAVA — A conversation")}&body=${encodeURIComponent(draftBody(draft))}`;
      }
      const clearDialog = one<HTMLDialogElement>("#clear-draft-dialog")!;
      one("[data-clear-draft]")!.addEventListener("click", () =>
        clearDialog.showModal(),
      );
      one("[data-keep-draft]")!.addEventListener("click", () =>
        clearDialog.close(),
      );
      one("[data-confirm-clear]")!.addEventListener("click", () => {
        try {
          sessionStorage.removeItem(DRAFT);
          location.href = url("/enquiry/");
        } catch {
          status(
            "The draft could not be removed. Close this tab to end the session.",
          );
        }
      });
    }
  }
}
