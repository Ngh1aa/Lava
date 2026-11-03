/** All project claims are conceptual; replace with verified project information before a commercial launch. */
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
  spaces: [
    {
      title: "Space to connect.",
      name: "The gallery lounge",
      image: "lounge.webp",
      width: 1536,
      height: 1024,
      alt: "Double-height concrete lounge with warm lighting, stone benches and full-height glazing",
      body: "A generous welcome. Tactile materials, quiet corners and an uninterrupted connection to the world outside.",
    },
    {
      title: "A pause, above it all.",
      name: "The open terrace",
      image: "terrace.webp",
      width: 1536,
      height: 1024,
      alt: "Open architectural terrace with concrete overhangs, planted edges and warm light at dusk",
      body: "Step out of the everyday. Open-air spaces make room for a conversation, a fresh thought or a slower moment.",
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
      image: "arrival.webp",
      title: "The blue hour",
      category: "Exterior",
      alt: "LAVA terraced building with warm bronze glazing reflected in still water at blue hour",
    },
    {
      image: "lounge.webp",
      title: "A warm welcome",
      category: "Interior",
      alt: "Concrete gallery lounge with warm recessed lighting and stone seating",
    },
    {
      image: "terrace.webp",
      title: "Between earth and sky",
      category: "Open air",
      alt: "Planted concrete terrace opening onto the evening landscape",
    },
    {
      image: "structure.webp",
      title: "A study of form",
      category: "Architectural model",
      alt: "Close view of the bronze fins and cantilevered concrete slabs of the LAVA model",
    },
  ],
};

export type ViewId = (typeof content.views)[number]["id"];

/** No invented contact destination. Supply a verified inbox at build time. */
export const contactEmail = import.meta.env?.VITE_CONTACT_EMAIL?.trim() ?? "";
export const asset = (file: string) =>
  `${import.meta.env.BASE_URL ?? "/"}images/${file}`;
