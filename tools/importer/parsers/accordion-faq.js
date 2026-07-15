/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.omadahealth.com/
 * Generated: 2026-07-15
 *
 * Structure (from accordion library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name (added by createBlock)
 *   Each item row: [ title/question cell, content/answer cell ]
 */
export default function parse(element, { document }) {
  const items = Array.from(
    element.querySelectorAll('.accordion-item, .faq-accordion__content-item, [class*="accordion-item"]')
  );

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    // Question: text within the toggle (prefer heading if present).
    const toggle = item.querySelector('.accordion-toggle, [class*="content-toggle"]');
    const question = (toggle && toggle.querySelector('h1, h2, h3, h4, h5, h6')) || toggle;

    // Answer: the body content revealed on expand.
    const body = item.querySelector('.accordion-body, [class*="accordion-body"]');
    const answer = (body && body.querySelector('.faq-accordion__content, [class*="__content"]')) || body;

    cells.push([question || '', answer || '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
