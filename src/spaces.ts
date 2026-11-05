/** Architectural perspectives on Harpa, not a leasing inventory. */
export const spaces = [
  {
    "id": "workplace",
    "number": "01",
    "name": "The foyer",
    "type": "Meet",
    "level": "Public",
    "photo": 1,
    "headline": "Light.\nA place to gather.",
    "description": "A public interior behind the glass envelope, connecting Harpa’s cultural programme with everyday life.",
    "atmosphere": "A public interior behind the glass envelope, connecting Harpa’s cultural programme with everyday life.",
    "image": "harpa-1.webp",
    "zones": [
      "Public space",
      "Light",
      "Circulation",
      "Envelope"
    ],
    "features": [
      "Harpa Concert Hall, Reykjavík",
      "Photographed architectural perspective",
      "Source: Henning Larsen project account"
    ],
    "note": "Photograph of Harpa Concert Hall."
  },
  {
    "id": "gallery-lounge",
    "number": "02",
    "name": "The harbour edge",
    "type": "Unwind",
    "level": "Public",
    "photo": 2,
    "headline": "City.\nWater. Architecture.",
    "description": "Read the relationship between Harpa’s angular silhouette and Reykjavík’s waterfront.",
    "atmosphere": "Read the relationship between Harpa’s angular silhouette and Reykjavík’s waterfront.",
    "image": "harpa-2.webp",
    "zones": [
      "Public space",
      "Light",
      "Circulation",
      "Envelope"
    ],
    "features": [
      "Harpa Concert Hall, Reykjavík",
      "Photographed architectural perspective",
      "Source: Henning Larsen project account"
    ],
    "note": "Photograph of Harpa Concert Hall."
  },
  {
    "id": "meeting-suite",
    "number": "03",
    "name": "The crystalline facade",
    "type": "Meet",
    "level": "Public",
    "photo": 3,
    "headline": "A facade.\nMany reflections.",
    "description": "A close reading of the quasi-brick glass envelope and its relationship to the Icelandic landscape.",
    "atmosphere": "A close reading of the quasi-brick glass envelope and its relationship to the Icelandic landscape.",
    "image": "harpa-3.webp",
    "zones": [
      "Public space",
      "Light",
      "Circulation",
      "Envelope"
    ],
    "features": [
      "Harpa Concert Hall, Reykjavík",
      "Photographed architectural perspective",
      "Source: Henning Larsen project account"
    ],
    "note": "Photograph of Harpa Concert Hall."
  },
  {
    "id": "open-terrace",
    "number": "04",
    "name": "The interior geometry",
    "type": "Unwind",
    "level": "Public",
    "photo": 4,
    "headline": "Look up.\nRead the geometry.",
    "description": "The geometric ceiling adds another architectural perspective to the experience of Harpa’s interior.",
    "atmosphere": "The geometric ceiling adds another architectural perspective to the experience of Harpa’s interior.",
    "image": "harpa-4.webp",
    "zones": [
      "Public space",
      "Light",
      "Circulation",
      "Envelope"
    ],
    "features": [
      "Harpa Concert Hall, Reykjavík",
      "Photographed architectural perspective",
      "Source: Henning Larsen project account"
    ],
    "note": "Photograph of Harpa Concert Hall."
  }
] as const;

export type Space = (typeof spaces)[number];
export const spaceById = (id: string) =>
  spaces.find((space) => space.id === id);
