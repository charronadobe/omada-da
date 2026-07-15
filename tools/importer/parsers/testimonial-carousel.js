/* eslint-disable */
/* global WebImporter */
/**
 * Parser for testimonial-carousel. Base: carousel.
 * Source: https://www.omadahealth.com/
 * Generated: 2026-07-15
 *
 * Structure: single column, one row per testimonial slide.
 *   Each row cell holds: logo image, quote (h4), author name, designation, read-more link.
 *
 * Source markup: .testimonial-slider-section with .testimonial-slider__content slides.
 * The slick carousel clones slides, so dedupe by read-more href.
 */
export default function parse(element, { document }) {
  const slides = Array.from(
    element.querySelectorAll('.testimonial-slider__content, [class*="slider__content"]'),
  ).filter((s) => s.querySelector('.testimonial-slider__message, h1, h2, h3, h4, blockquote, p'));

  const cells = [];
  const seen = new Set();

  slides.forEach((slide) => {
    const logo = slide.querySelector('.testimonial-slider__quote img, img');
    const message = slide.querySelector('.testimonial-slider__message, h4, blockquote');
    const name = slide.querySelector('.testimonial-slider__name, [class*="__name"]');
    const designation = slide.querySelector('.testimonial-slider__designation, [class*="__designation"]');
    const link = slide.querySelector('.testimonial-slider__read-more, a');

    const key = (link && link.getAttribute('href'))
      || (message && message.textContent.trim());
    if (key && seen.has(key)) return;
    if (key) seen.add(key);

    const cell = [];
    if (logo) cell.push(logo);

    if (message) {
      const h = document.createElement('h4');
      h.textContent = message.textContent.replace(/\s+/g, ' ').trim();
      cell.push(h);
    }
    if (name) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${name.textContent.replace(/^\d+/, '').trim()}</strong>`;
      cell.push(p);
    }
    if (designation) {
      const p = document.createElement('p');
      p.textContent = designation.textContent.replace(/^\d+/, '').trim();
      cell.push(p);
    }
    if (link && link.getAttribute('href')) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = link.textContent.trim() || 'Learn more';
      cell.push(a);
    }

    if (cell.length) cells.push([cell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'testimonial-carousel', cells });
  element.replaceWith(block);
}
