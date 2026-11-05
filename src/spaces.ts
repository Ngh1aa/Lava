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
    "atmosphere": "Daylight falls across the foyer while the glass frames the city beyond. The interior is part of the public life of the building, connecting arrival, gathering and the cultural programme.",
    "image": "harpa-1.webp",
    "zones": [
      "Public space",
      "Light",
      "Circulation",
      "Envelope"
    ],
    "features": [
      "Filtered daylight through the glass envelope",
      "Views towards the city and harbour",
      "A gathering place alongside the cultural programme"
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
    "atmosphere": "Harpa’s crystalline volume meets the open harbour. Water and weather form a changing backdrop to the sharp outline of its glass envelope.",
    "image": "harpa-2.webp",
    "zones": [
      "Public space",
      "Light",
      "Circulation",
      "Envelope"
    ],
    "features": [
      "Angular silhouette on the waterfront",
      "Reflections of the sky and surrounding water",
      "A meeting of city and coastal landscape"
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
    "atmosphere": "The facade is experienced as a surface with depth. Repeated glass modules shift between transparency and reflection as the viewpoint changes.",
    "image": "harpa-3.webp",
    "zones": [
      "Public space",
      "Light",
      "Circulation",
      "Envelope"
    ],
    "features": [
      "Faceted glass and steel",
      "Basalt-inspired modular geometry",
      "Shifting reflection and transparency"
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
    "atmosphere": "Looking up reveals another layer of the building: light and reflection travel across a faceted ceiling, continuing the geometric rhythm of the facade.",
    "image": "harpa-4.webp",
    "zones": [
      "Public space",
      "Light",
      "Circulation",
      "Envelope"
    ],
    "features": [
      "A faceted, reflective ceiling",
      "Dark surfaces with changing highlights",
      "Geometric continuity with the glass envelope"
    ],
    "note": "Photograph of Harpa Concert Hall."
  }
] as const;

export type Space = (typeof spaces)[number];
export const spaceById = (id: string) =>
  spaces.find((space) => space.id === id);
