/* Lava: seed data for the site. Lava is a fictional development, so every number, name and price
 * here is invented (see docs/DESIGN-NOTES.md). Nothing in this file is written to at runtime;
 * the visitor's own data (shortlist, viewings, enquiries) lives in sessionStorage, see js/app.js. */
window.LAVA_DATA = (() => {
  'use strict';

  const IMG = {
    facade: { src: 'img/hero-mat-tien.jpg', w: 1024, h: 683, alt: 'Dark brick façade with tall glazed doors opening onto a white gravel garden' },
    row: { src: 'img/du-an-san-vuon.jpg', w: 1024, h: 683, alt: 'A row of two-storey grey brick homes, each with a covered terrace and a private lawn' },
    terrace: { src: 'img/can-san-vuon.jpg', w: 1024, h: 683, alt: 'Grey stone terrace outside wide glazing, a lawn and green hedges' },
    living: { src: 'img/can-tieu-chuan.jpg', w: 1024, h: 683, alt: 'Bright living room with pale timber floor, grey sofa and a low sideboard' },
    pool: { src: 'img/can-penthouse.jpg', w: 1024, h: 683, alt: 'Roof terrace with a private pool, loungers and a glazed living room' },
    robe: { src: 'img/luu-tru.jpg', w: 1024, h: 684, alt: 'Long walk-in robe with white joinery to the ceiling and a timber floor' },
    oak: { src: 'img/vat-lieu.jpg', w: 683, h: 1024, alt: 'Oak stool on a polished concrete floor against a rendered grey wall' },
    beach: { src: 'img/vi-tri-bien.jpg', w: 1024, h: 576, alt: 'Beach at sunset, the outgoing tide leaving bright streaks on the sand' },
    house: { src: 'img/mo-ban.jpg', w: 1024, h: 683, alt: 'Two-storey home in grey and white brick among garden trees' },
  };

  const TYPES = {
    garden: { name: 'Garden residence', short: 'Garden', outdoor: 'Private garden' },
    standard: { name: 'Standard residence', short: 'Standard', outdoor: 'Balcony' },
    penthouse: { name: 'Penthouse', short: 'Penthouse', outdoor: 'Roof terrace' },
  };

  // status: available | reserved | sold. price in VND billion.
  const residences = [
    { id: 'a-g01', code: 'A-G01', type: 'garden', block: 'A', level: 0, beds: 3, baths: 3, interior: 148, outdoor: 120, aspect: 'North-east', cars: 2, price: 9.6, status: 'available', gallery: ['terrace', 'row', 'living', 'robe'] },
    { id: 'a-g02', code: 'A-G02', type: 'garden', block: 'A', level: 0, beds: 2, baths: 2, interior: 112, outdoor: 86, aspect: 'East', cars: 2, price: 8.2, status: 'reserved', gallery: ['row', 'terrace', 'oak', 'robe'] },
    { id: 'b-g03', code: 'B-G03', type: 'garden', block: 'B', level: 0, beds: 3, baths: 3, interior: 156, outdoor: 140, aspect: 'North', cars: 2, price: 10.4, status: 'available', gallery: ['facade', 'terrace', 'living', 'robe'] },
    { id: 'a-101', code: 'A-101', type: 'standard', block: 'A', level: 1, beds: 2, baths: 2, interior: 86, outdoor: 12, aspect: 'West', cars: 1, price: 6.8, status: 'sold', gallery: ['living', 'oak', 'robe'] },
    { id: 'b-104', code: 'B-104', type: 'standard', block: 'B', level: 1, beds: 2, baths: 2, interior: 94, outdoor: 16, aspect: 'North', cars: 1, price: 7.3, status: 'available', gallery: ['house', 'living', 'robe'] },
    { id: 'b-207', code: 'B-207', type: 'standard', block: 'B', level: 2, beds: 3, baths: 2, interior: 118, outdoor: 20, aspect: 'North-east', cars: 2, price: 8.9, status: 'available', gallery: ['living', 'house', 'oak', 'robe'] },
    { id: 'c-212', code: 'C-212', type: 'standard', block: 'C', level: 2, beds: 3, baths: 3, interior: 128, outdoor: 24, aspect: 'East', cars: 2, price: 9.5, status: 'reserved', gallery: ['house', 'living', 'robe'] },
    { id: 'c-305', code: 'C-305', type: 'standard', block: 'C', level: 3, beds: 2, baths: 2, interior: 102, outdoor: 18, aspect: 'South-east', cars: 1, price: 7.9, status: 'available', gallery: ['living', 'oak', 'robe'] },
    { id: 'd-310', code: 'D-310', type: 'standard', block: 'D', level: 3, beds: 3, baths: 2, interior: 124, outdoor: 22, aspect: 'North', cars: 2, price: 9.2, status: 'sold', gallery: ['house', 'living', 'robe'] },
    { id: 'c-ph1', code: 'C-PH1', type: 'penthouse', block: 'C', level: 4, beds: 3, baths: 3, interior: 210, outdoor: 96, aspect: 'North and east', cars: 2, price: 19.5, status: 'available', gallery: ['pool', 'beach', 'living', 'robe'] },
    { id: 'd-ph2', code: 'D-PH2', type: 'penthouse', block: 'D', level: 4, beds: 4, baths: 4, interior: 240, outdoor: 120, aspect: 'North, east and west', cars: 2, price: 23.8, status: 'reserved', gallery: ['pool', 'beach', 'oak', 'robe'] },
  ];

  const STATUS = {
    available: { label: 'Available', badge: 'success', icon: 'ds-i-check-circle' },
    reserved: { label: 'Reserved', badge: 'warning', icon: 'app-i-clock' },
    sold: { label: 'Sold', badge: 'neutral', icon: 'app-i-lock' },
  };

  // Price bands for the listing filter (VND billion, min inclusive, max exclusive)
  const PRICE_BANDS = [
    { id: 'u8', label: 'Under 8 bn', min: 0, max: 8 },
    { id: '8-10', label: '8–10 bn', min: 8, max: 10 },
    { id: 'o10', label: 'Over 10 bn', min: 10, max: Infinity },
  ];

  // Private viewings at the display suite: every day, these start times, 45 minutes each.
  const VIEWING = {
    days: 14, // bookable days, starting tomorrow
    times: ['09:00', '10:30', '13:00', '14:30', '16:00'],
    maxResidences: 3,
  };

  const SUITE = { address: '12 Ven Bien Street', hours: 'Monday to Sunday, 8am–6pm', phone: '028 3915 2468', tel: '02839152468' };

  return { IMG, TYPES, residences, STATUS, PRICE_BANDS, VIEWING, SUITE };
})();
