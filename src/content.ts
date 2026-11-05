/** Photographs of Harpa, individually verified and credited. */
const photography = {
  "arrival": {
    "image": "harpa-0.webp",
    "width": 1600,
    "height": 1200,
    "alt": "Harpa Concert Hall reflected in water at dusk in Reykjavik",
    "photographer": "Bogdan Giurca",
    "source": "https://www.pexels.com/photo/concert-hall-in-reykjavik-21700767/",
    "license": "https://www.pexels.com/license/"
  },
  "lounge": {
    "image": "harpa-1.webp",
    "width": 1600,
    "height": 1067,
    "alt": "Sunlight through the geometric glass facade into Harpa foyer",
    "photographer": "Bernd Dittrich",
    "source": "https://unsplash.com/photos/the-sun-shines-through-the-windows-of-a-modern-building-8d_mSO1rN1s",
    "license": "https://unsplash.com/license"
  },
  "terrace": {
    "image": "harpa-2.webp",
    "width": 1600,
    "height": 1280,
    "alt": "Harpa Concert Hall exterior under an overcast Reykjavik sky",
    "photographer": "Phil Evenden",
    "source": "https://www.pexels.com/photo/harpa-concert-hall-in-reykjavik-iceland-architecture-34340714/",
    "license": "https://www.pexels.com/license/"
  },
  "facade": {
    "image": "harpa-3.webp",
    "width": 1600,
    "height": 1067,
    "alt": "Geometric glass facade of Harpa Concert Hall",
    "photographer": "Peter Holmboe",
    "source": "https://www.pexels.com/photo/detail-of-the-harpa-facade-in-reykjavik-iceland-18121504/",
    "license": "https://www.pexels.com/license/"
  },
  "workplace": {
    "image": "harpa-4.webp",
    "width": 1600,
    "height": 2133,
    "alt": "Geometric ceiling inside Harpa Concert Hall",
    "photographer": "Matheus Bertelli",
    "source": "https://www.pexels.com/photo/contemporary-metal-ceiling-of-building-hall-4558566/",
    "license": "https://www.pexels.com/license/"
  },
  "meeting": {
    "image": "harpa-5.webp",
    "width": 1600,
    "height": 1908,
    "alt": "Detailed glass facade of Harpa Concert Hall",
    "photographer": "Bernd Dittrich",
    "source": "https://unsplash.com/photos/a-building-that-has-many-windows-in-it-IioKNx7RyTg",
    "license": "https://unsplash.com/license"
  }
} as const;

/** All LAVA project claims remain conceptual; reference photography is credited separately. */
export const content = {
  brand: "LAVA",
  tagline: "Architecture in a different light",
  heroNote: ["Harpa Concert Hall.", "Reykjavík, Iceland."],
  hero: ["A symphony", "of light."],
  vision: ["Shaped by Iceland.", "Made for everyone."],
  statement:
    "Harpa brings music, gathering and a crystalline facade to Reykjavík’s harbour. This independent LAVA study explores one building through its form, light and public spaces.",
  overview: {
    heading: "One building. Many ways to see.",
    body: "Harpa Concert Hall and Conference Centre, Reykjavík. Designed by Henning Larsen and Batteríið Architects, with the facade developed with Olafur Eliasson.",
    facts: [
      {
        value: "2011",
        label: "Opened in Reykjavík",
        detail: "A cultural landmark on the harbour",
      },
      {
        value: "2013",
        label: "Mies van der Rohe Award",
        detail: "Architecture recognised across Europe",
      },
      {
        value: "01",
        label: "Continuous experience",
        detail: "Music, light and public life",
      },
    ],
  },
  experiences: [
    {
      title: "Light as a material",
      body: "The faceted glass envelope changes with daylight, weather and the harbour around it.",
    },
    {
      title: "An Icelandic geometry",
      body: "The facade draws on the interlocking basalt formations of the Icelandic coast.",
    },
    {
      title: "A shared cultural home",
      body: "The foyer brings everyday public life into the building alongside concerts and conferences.",
    },
  ],
  gallery: [
    {
      ...photography.arrival,
      title: "Harbour at dusk",
      category: "Exterior photograph",
    },
    {
      ...photography.lounge,
      title: "Light in the foyer",
      category: "Interior photograph",
    },
    {
      ...photography.terrace,
      title: "The crystalline silhouette",
      category: "Exterior photograph",
    },
    {
      ...photography.facade,
      title: "Geometry of glass",
      category: "Facade photograph",
    },
    {
      ...photography.workplace,
      title: "Above the foyer",
      category: "Interior photograph",
    },
    {
      ...photography.meeting,
      title: "The reflective envelope",
      category: "Facade photograph",
    },
  ],
};

/** No invented contact destination. Supply a verified inbox at build time. */
export const contactEmail = import.meta.env?.VITE_CONTACT_EMAIL?.trim() ?? "";
export const asset = (file: string) =>
  `${document.documentElement.dataset.root ?? import.meta.env.BASE_URL ?? "/"}images/${file}`;
