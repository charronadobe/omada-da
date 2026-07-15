/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta. Base: hero.
 * Source: https://www.omadahealth.com/
 * Generated: 2026-07-15
 *
 * Closing CTA band. Structure (from hero library-description.txt): 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background image (optional)
 *   Row 3: title + optional subheading + CTA (all in one cell)
 */
export default function parse(element, { document }) {
  // --- Row 2: background image ---
  const bgImage = element.querySelector(
    '.we-put-healthcare__background-image img, [class*="background-image"] img, img'
  );

  // --- Row 3: content ---
  const heading = element.querySelector('.title h1, .title h2, h1, h2');
  // Subheading may be empty on this page; include only if it has content.
  const subheadingEl = element.querySelector('.content');
  const subheading = subheadingEl && subheadingEl.textContent.trim() ? subheadingEl : null;
  const ctaLinks = Array.from(
    element.querySelectorAll('.link-wrapper a, .button-wrapper a, a.btn-secondary, a.link')
  );

  // Empty-block guard
  if (!heading && ctaLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (only if present)
  if (bgImage) cells.push([[bgImage]]);

  // Row 3: text content + CTA in the single cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
