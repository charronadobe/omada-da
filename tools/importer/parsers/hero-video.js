/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-video. Base: hero.
 * Source: https://www.omadahealth.com/
 * Generated: 2026-07-15
 *
 * Structure (from hero library-description.txt): 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background asset (optional) — the background video / image
 *   Row 3: eyebrow + title + subheading + CTA (all in one cell)
 */
export default function parse(element, { document }) {
  // --- Row 2: background asset ---
  // Prefer the background video; fall back to the background image.
  const bgVideo = element.querySelector('figure#video video, figure#video, video');
  const bgImage = element.querySelector(
    '.hero-banner__background-image img, [class*="background-image"] img'
  );

  // --- Row 3: content ---
  const eyebrow = element.querySelector(
    '.section_type_text, #section_type h6, [class*="section_type"] h6'
  );
  const heading = element.querySelector('.title h1, h1, .title h2, h2');
  const subheading = element.querySelector('.content, .content span, [class*="content"]');
  const ctaLinks = Array.from(
    element.querySelectorAll('.link-wrapper a, .button-wrapper a, a.btn-secondary, a.link')
  );

  // Empty-block guard
  if (!heading && !subheading && ctaLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background asset (only if present)
  const bgCell = [];
  if (bgVideo) bgCell.push(bgVideo);
  else if (bgImage) bgCell.push(bgImage);
  if (bgCell.length) cells.push([bgCell]);

  // Row 3: text content + CTA, all in the single cell
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
