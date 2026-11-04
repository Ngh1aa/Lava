/** Spatial proposals for the original LAVA concept, not a leasing inventory. */
export const spaces = [
  {
    id: "workplace",
    number: "01",
    name: "The open workplace",
    type: "Work",
    level: "02–04",
    photo: 4,
    headline: "A little room.\nA lot of possibility.",
    description:
      "An adaptable working landscape, with places to come together and room to find your own rhythm. The planted edge keeps the outside within reach.",
    atmosphere: "Focused, open, connected",
    image: "workplace.webp",
    zones: [
      "Shared working",
      "Quiet rooms",
      "Collaboration",
      "Planted terrace",
    ],
    features: [
      "Flexible, open working zones",
      "Sheltered outdoor edges",
      "Daylight shaped by deep overhangs",
    ],
    note: "An open-plan workplace reference photographed by Israel Andrade.",
  },
  {
    id: "gallery-lounge",
    number: "02",
    name: "The gallery lounge",
    type: "Meet",
    level: "01",
    photo: 1,
    headline: "Where ideas\nfind each other.",
    description:
      "A shared living room for the building. Informal conversations, a quiet coffee and a changing cultural programme share one generous ground-level space.",
    atmosphere: "Warm, tactile, unhurried",
    image: "lounge.webp",
    zones: ["Gallery", "Lounge seating", "Coffee point", "Arrival"],
    features: [
      "An informal place to meet",
      "Space for small exhibitions",
      "A continuous route from arrival",
    ],
    note: "Lugdunum Museum, Lyon. An interior reference for material and atmosphere.",
  },
  {
    id: "meeting-suite",
    number: "03",
    name: "The meeting suite",
    type: "Meet",
    level: "05",
    photo: 5,
    headline: "Good conversations.\nNew perspectives.",
    description:
      "A quieter destination above the working floors. A sequence of meeting rooms opens to a shared threshold and a long view beyond the building.",
    atmosphere: "Calm, considered, collaborative",
    image: "meeting.webp",
    zones: [
      "Meeting room",
      "Project room",
      "Shared threshold",
      "Open-air break",
    ],
    features: [
      "A choice of meeting settings",
      "A shared space between sessions",
      "A sheltered place to step outside",
    ],
    note: "A conference-room reference at Sunday Digital in Munich, photographed by Nastuh Abootalebi.",
  },
  {
    id: "open-terrace",
    number: "04",
    name: "The open terrace",
    type: "Unwind",
    level: "06",
    photo: 2,
    headline: "More sky.\nA different pace.",
    description:
      "At the top of the building, the architecture opens up. Planted pockets, shaded seats and uninterrupted sky make space for an entirely different kind of moment.",
    atmosphere: "Open, planted, restorative",
    image: "terrace.webp",
    zones: ["Covered seating", "Garden", "Open terrace", "Shared table"],
    features: [
      "A planted rooftop landscape",
      "Places to sit in sun or shade",
      "A shared outdoor destination",
    ],
    note: "Neue Nationalgalerie, Berlin. An open-air reference for proportion and shade.",
  },
] as const;

export type Space = (typeof spaces)[number];
export const spaceById = (id: string) =>
  spaces.find((space) => space.id === id);

const plans: Record<
  Space["id"],
  { walls: string; furniture: string; labels: [number, number][] }
> = {
  workplace: {
    walls: "M100 310H700M490 70V310M490 190H700M590 70V190",
    furniture:
      "M145 135h115v45H145zM305 135h115v45H305zM145 225h115v45H145zM305 225h115v45H305zM530 235h120v40H530zM135 360h110v25H135zM520 360h110v25H520z",
    labels: [
      [125, 110],
      [515, 115],
      [515, 225],
      [125, 355],
    ],
  },
  "gallery-lounge": {
    walls: "M460 70V300H700M100 330H325M430 330H460V420",
    furniture:
      "M150 130h18v120H150zM250 100h120v18H250zM270 240h120v18H270zM515 120h135v45H515zM505 200h30v55H505zM600 200h30v55H600zM155 355h90v30H155z",
    labels: [
      [125, 110],
      [125, 300],
      [490, 110],
      [485, 360],
    ],
  },
  "meeting-suite": {
    walls: "M100 250H700M365 70V250M535 70V250M100 330H700M570 330V420",
    furniture:
      "M160 135h140v55H160zM400 120h100v70H400zM570 120h95v70H570zM145 355h110v25H145zM330 355h110v25H330zM610 360h45v25H610z",
    labels: [
      [125, 110],
      [390, 110],
      [125, 300],
      [595, 355],
    ],
  },
  "open-terrace": {
    walls: "M100 245H340V70M340 245H525M525 245V420M100 330H340",
    furniture:
      "M145 135h115v45H145zM145 270h145v30H145zM380 110h85v75H380zM515 110h135v35H515zM565 285h85v85H565zM150 365h130v25H150z",
    labels: [
      [125, 110],
      [365, 110],
      [365, 300],
      [125, 355],
    ],
  },
};

/** Original, distinct zoning studies. Dimensions and commercial areas are not invented. */
export function planSvg(space: Space, standalone = false) {
  const plan = plans[space.id];
  const legend = standalone
    ? `<g fill="currentColor" font-family="sans-serif" font-size="24"><text x="100" y="520">LAVA / ${space.name}</text>${space.zones.map((zone, i) => `<text x="${i % 2 === 0 ? 100 : 430}" y="${565 + Math.floor(i / 2) * 40}">0${i + 1} / ${zone}</text>`).join("")}<text x="100" y="650">Concept zoning. Not to scale.</text></g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${standalone ? 700 : 490}" role="img" aria-labelledby="plan-title-${space.id}"><title id="plan-title-${space.id}">${space.name} — conceptual zoning plan, not to scale</title><g fill="none" stroke="currentColor"><path d="M100 70H700V420H100Z" stroke-width="3"/><path d="${plan.walls}" stroke-width="2"/><path d="${plan.furniture}" opacity=".6"/><path d="M100 420v25h600v-25M122 445v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12m22 12v-12" opacity=".35"/><path d="M740 110V60m-10 15 10-15 10 15"/></g><g fill="currentColor" font-family="sans-serif" font-size="36">${plan.labels.map(([x, y], i) => `<text x="${x}" y="${y}">0${i + 1}</text>`).join("")}<text x="726" y="155">N</text></g>${legend}</svg>`;
}
