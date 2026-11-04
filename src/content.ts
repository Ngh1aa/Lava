/** Real photographs used as architectural references, not photographs of the LAVA concept. */
const photography = {
  workplace: {
    image: "workplace.webp",
    width: 1600,
    height: 1067,
    alt: "People working at shared desks beneath pendant lighting in an open-plan office",
    photographer: "Israel Andrade",
    source:
      "https://unsplash.com/photos/people-sitting-on-chair-in-front-of-computer-YI_9SivVt_s",
  },
  meeting: {
    image: "meeting.webp",
    width: 1600,
    height: 1068,
    alt: "Sunlit conference room with a wooden table, pink upholstered chairs and floor-to-ceiling glazing",
    photographer: "Nastuh Abootalebi",
    source:
      "https://unsplash.com/photos/pink-dining-table-with-four-chairs-inside-room-J1rNS2qv8BQ",
  },
  arrival: {
    image: "arrival.webp",
    width: 1600,
    height: 757,
    alt: "Copenhagen Opera House illuminated with warm interior light at night",
    photographer: "Rasmus Lauridsen",
    source:
      "https://unsplash.com/photos/modern-building-illuminated-at-night-with-warm-interior-lighting-bsTw-CKKhx4",
  },
  lounge: {
    image: "lounge.webp",
    width: 1280,
    height: 1280,
    alt: "Concrete interior and leather bench beside a large window at Lugdunum Museum in Lyon",
    photographer: "Sébastien Lavalaye",
    source:
      "https://unsplash.com/photos/a-modern-bench-sits-beside-a-large-window-kXKQEhfd06o",
  },
  terrace: {
    image: "terrace.webp",
    width: 898,
    height: 2000,
    alt: "Steel roof, glass facade and open terrace at Neue Nationalgalerie in Berlin",
    photographer: "Caio Arbulu",
    source:
      "https://unsplash.com/photos/modern-building-with-a-large-terrace-under-a-blue-sky-bvx2_DCO9GA",
  },
  facade: {
    image: "facade.webp",
    width: 1600,
    height: 1067,
    alt: "Black and white photograph of an illuminated geometric facade in Hamburg",
    photographer: "Maik Winnecke",
    source:
      "https://unsplash.com/photos/modern-building-facade-illuminated-at-night-U2YVQBUMq40",
  },
} as const;

/** All LAVA project claims remain conceptual; reference photography is credited separately. */
export const content = {
  brand: "LAVA",
  tagline: "Architecture in a different light",
  heroNote: ["An architectural concept.", "A new kind of place."],
  hero: ["A different", "perspective."],
  vision: ["Extraordinary spaces.", "Everyday possibilities."],
  statement:
    "An exploration of balance. Between the monumental and the human. The energy of a shared space and the quiet of a moment to yourself.",
  overview: {
    heading: "A place to see things differently.",
    body: "A composition of open terraces, generous interiors and shifting perspectives. LAVA brings work, culture and connection into one architectural idea.",
    facts: [
      {
        value: "06",
        label: "Terraced levels",
        detail: "A landscape in the sky",
      },
      {
        value: "03",
        label: "Architectural perspectives",
        detail: "One connected whole",
      },
      {
        value: "01",
        label: "Continuous experience",
        detail: "From arrival to rooftop",
      },
    ],
  },
  views: [
    {
      id: "arrival",
      label: "The arrival",
      title: "An open invitation.",
      description:
        "A lifted ground plane opens the building to its surroundings. Above it, horizontal terraces frame a changing play of light.",
      position: [16, 9, 19],
      target: [0, 2.2, 0],
    },
    {
      id: "terraces",
      label: "The terraces",
      title: "Room to step outside.",
      description:
        "Each level steps back to make space for open air. Deep overhangs create shade, while planted edges soften the geometry.",
      position: [-14, 11, 16],
      target: [0, 2.3, 0],
    },
    {
      id: "structure",
      label: "The structure",
      title: "Clarity in every line.",
      description:
        "Slender bronze fins meet weighty concrete planes. Repetition gives the facade rhythm; the spaces between give it depth.",
      position: [12, 5.5, 10],
      target: [0, 2.8, 0],
    },
  ],
  experiences: [
    {
      title: "Light as a material",
      body: "Deep reveals and slender fins shape the daylight. As evening arrives, warm interiors bring another layer of the architecture into view.",
    },
    {
      title: "A dialogue with nature",
      body: "Planted terraces, reflective water and open sky form a softer edge to the building. Nature becomes part of the route through it.",
    },
    {
      title: "A more human scale",
      body: "The broad silhouette gives way to intimate places to sit, meet and pause. A monumental idea, experienced one moment at a time.",
    },
  ],
  gallery: [
    {
      ...photography.arrival,
      title: "The blue hour",
      category: "Exterior reference",
    },
    {
      ...photography.lounge,
      title: "A warm welcome",
      category: "Interior reference",
    },
    {
      ...photography.terrace,
      title: "Between earth and sky",
      category: "Open-air reference",
    },
    {
      ...photography.facade,
      title: "A study of form",
      category: "Facade reference",
    },
    {
      ...photography.workplace,
      title: "Room for focus",
      category: "Interior reference",
    },
    {
      ...photography.meeting,
      title: "Ideas around a table",
      category: "Interior reference",
    },
  ],
};

export type ViewId = (typeof content.views)[number]["id"];

/** No invented contact destination. Supply a verified inbox at build time. */
export const contactEmail = import.meta.env?.VITE_CONTACT_EMAIL?.trim() ?? "";
export const asset = (file: string) =>
  `${document.documentElement.dataset.root ?? import.meta.env.BASE_URL ?? "/"}images/${file}`;
