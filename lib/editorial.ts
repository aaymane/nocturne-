/**
 * Editorial copy. Kept as a single source so writing iterations
 * don't touch component files.
 */

export const sceneProduct = {
  eyebrow: 'EDITION 01 / Available now',
  productName: 'The Nightcrest Cap',
  productSubtitle: 'Edition 01 — Paris',
  price: '€380',
  edition: '200 pieces · numbered',
  shipping: 'Worldwide · 5-7 days',
  tagline: 'Conceived as an object of cinema.',

  descriptionLines: [
    'Nappa leather, combed wool, embroidered thread-on-thread.',
    'Built for the night, the rain, the movement.',
    'Crafted in Paris, 8th arrondissement.',
    '200 pieces. Numbered. Final.',
  ],

  specs: [
    { label: 'Main material', value: 'Black matte nappa leather' },
    { label: 'Side panels',   value: 'Combed black wool' },
    { label: 'Visor',         value: 'Matte black leather' },
    { label: 'Hardware',      value: 'Brushed satin chrome' },
    { label: 'Lining',        value: 'Anthracite satin' },
    { label: 'Sweatband',     value: 'Perforated leather' },
    { label: 'Origin',        value: 'Made in France' },
    { label: 'Edition',       value: '200 numbered pieces' },
  ],

  worn: {
    title: 'After dark',
    body:  'Built for the silhouette in motion. The collar up, the streets wet, the city quiet. The Nightcrest sits low, weighted, signed in shadow.',
  },

  packaging: {
    title: 'The object, edited.',
    body:  'Each piece arrives in a matte black box, lined in anthracite satin. Inside : a numbered certificate, a wax-sealed envelope, a velvet pouch. The full ritual.',
  },

  cta: {
    label:   'Reserve your edition',
    subtext: '200 pieces · No restock',
    href:    '/reserve',
  },
};

export const editorial = {
  brand: 'Nocturne',
  volume: 'Volume 01 — Nocturne',
  subtitle: 'An editorial in motion',
  city: 'Paris — 8th arrondissement',
  coordinates: '48.8566° N · 2.3522° E',

  hero: {
    line1: 'Engineered',
    line2: 'for the night.',
    sub: 'Curated objects at the intersection of luxury fashion and automotive cinematography. Filmed after dark, between rain and reflection.',
  },

  scene2: {
    eyebrow: 'Chapter I — Motion',
    headline: 'Luxury after\nmidnight.',
    body: [
      'Rain reflections. Silent motion. A long descent through Paris when the city softens and the lights become liquid.',
      'The collection is not photographed in a studio. It is filmed — at speed, at night, through glass and weather.',
    ],
    meta: [
      { label: 'Filmed', value: '03:14 AM' },
      { label: 'District', value: '8e Arr.' },
      { label: 'Weather', value: 'Light rain' },
    ],
  },

  scene3: {
    eyebrow: 'Chapter II — Detail',
    headlinePrefix: 'Crafted',
    headlineEm: 'details.',
    headlineSuffix: 'In the language of leather and light.',
    body: 'Premium textures and finishes informed by luxury automotive interiors — perforated leather, brushed chrome, matte black, the faintest gold.',
    list: [
      { n: '01', t: 'Embroidered nightcrest, brushed thread', v: 'Atelier' },
      { n: '02', t: 'Perforated grain, water-resistant', v: 'Fabrication' },
      { n: '03', t: 'Chrome arch, satin underside', v: 'Hardware' },
      { n: '04', t: 'Limited release — 200 pieces', v: 'Edition' },
    ],
  },

  scene4: {
    eyebrow: 'Chapter III — Editorial',
    headlineLine1: 'Paris.',
    headlineLine2: 'Rain.',
    headlineLine3: 'Motion.',
    columns: [
      {
        title: 'Direction',
        body: 'A cinematic intersection between modern luxury fashion and automotive culture, framed as a single, slow descent through the city.',
      },
      {
        title: 'Cinematography',
        body: 'Shot anamorphic at 24p. Practical light only — streetlamps, headlamps, the reflection of wet asphalt.',
      },
      {
        title: 'Soundtrack',
        body: 'Low frequency ambience, distant traffic, rain on glass. No score. The city scores itself.',
      },
    ],
  },

  footer: {
    headlineLine1: 'Stay for',
    headlineLine2: 'the next chapter.',
    columns: [
      {
        title: 'Editorial Office',
        body: 'A studio practice based in Paris. Films, objects, and printed matter at the intersection of fashion, motion, and atmosphere.',
      },
      {
        title: 'Chapters',
        items: ['Vol. 01 — Nocturne', 'Vol. 02 — coming', 'Archive'],
      },
      {
        title: 'Contact',
        items: ['studio@nocturne.editorial', 'Press inquiries', 'Stockists'],
      },
      {
        title: 'Subscribe',
        items: ['Editorial dispatch', 'Quarterly only', 'No commerce'],
      },
    ],
    copyright: '© MMXXVI — Nocturne Editorial. All cinematic rights reserved.',
  },
};
