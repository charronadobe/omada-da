/* eslint-disable */
/* global WebImporter */
/**
 * Parser for stats-bar. Base: columns.
 * Source: https://www.omadahealth.com/
 * Generated: 2026-07-15
 *
 * Structure: 2 columns, one row per stat.
 *   Each row: [ value (e.g. "$1,000+"), description ]
 *
 * Source markup: .build-roi-counter with .featuers-counter__item elements,
 * each containing .featuers-counter__value (spans: prefix, number, suffix) and
 * .featuers-counter__desc. The slick carousel clones items, so dedupe by
 * description text.
 */
export default function parse(element, { document }) {
  const items = Array.from(
    element.querySelectorAll('.featuers-counter__item, [class*="counter__item"]'),
  );

  const cells = [];
  const seen = new Set();

  items.forEach((item) => {
    const valueEl = item.querySelector('.featuers-counter__value, [class*="__value"]');
    const descEl = item.querySelector('.featuers-counter__desc, .featuers-counter__description, [class*="__desc"]');
    const value = valueEl ? valueEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const desc = descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!value && !desc) return;
    const key = desc || value;
    if (seen.has(key)) return;
    seen.add(key);
    cells.push([value, desc]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'stats-bar', cells });
  element.replaceWith(block);
}
