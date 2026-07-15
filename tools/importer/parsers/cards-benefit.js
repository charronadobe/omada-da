/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-benefit. Base: cards.
 * Source: https://www.omadahealth.com/
 * Generated: 2026-07-15
 *
 * Structure (from cards library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name (added by createBlock)
 *   Each card row: [ image cell, text cell (title + description) ]
 */
export default function parse(element, { document }) {
  // Each card is a .platform-card__details wrapper containing an image + text.
  const cards = Array.from(
    element.querySelectorAll('.platform-card__details, [class*="card__details"]')
  );

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('img.platform-card__image, img');
    const title = card.querySelector('.platform-card__title, h3, h4, [class*="__title"]');
    const description = card.querySelector(
      '.platform-card__content, p, [class*="__content"]'
    );

    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);

    // 2-column row: image cell, text cell (pad image cell if missing)
    cells.push([image || '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-benefit', cells });
  element.replaceWith(block);
}
