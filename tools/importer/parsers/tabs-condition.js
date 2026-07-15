/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-condition. Base: tabs.
 * Source: https://www.omadahealth.com/
 * Generated: 2026-07-15
 *
 * Structure (from tabs library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name (added by createBlock)
 *   Each tab row: [ tab label, tab content ]
 *     - label: from the .nav-link header
 *     - content: image + text (subtitle/list + CTA) from the matching .tab-pane
 */
export default function parse(element, { document }) {
  // Tab labels from the header nav
  const navLinks = Array.from(
    element.querySelectorAll('.features-tab-slider__tab-headers .nav-link, ul.nav .nav-link')
  );
  // Content panels
  const panes = Array.from(element.querySelectorAll('.tab-pane'));

  // Empty-block guard
  if (navLinks.length === 0 && panes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  const rowCount = Math.max(navLinks.length, panes.length);

  for (let i = 0; i < rowCount; i += 1) {
    const link = navLinks[i];
    const pane = panes[i];

    // --- Label cell ---
    // Prefer the nav-link text; fall back to the pane's own tab title.
    let labelCell = '';
    if (link) {
      labelCell = link;
    } else if (pane) {
      const paneTitle = pane.querySelector('.slide-content-tab-title');
      if (paneTitle) labelCell = paneTitle;
    }

    // --- Content cell ---
    const contentCell = [];
    if (pane) {
      const image = pane.querySelector(
        '.features-tab-slider__sliders--slide-image img, figure img, img'
      );
      const subtitle = pane.querySelector(
        '.slide-content-subtitle, [class*="subtitle"]'
      );
      const footer = pane.querySelector('.slide-content-footer, [class*="footer"]');

      if (image) contentCell.push(image);
      if (subtitle) contentCell.push(subtitle);
      if (footer) {
        // Pull just the CTA link(s) out of the footer wrapper.
        const ctas = Array.from(footer.querySelectorAll('a'));
        if (ctas.length) contentCell.push(...ctas);
        else contentCell.push(footer);
      }
    }

    cells.push([labelCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-condition', cells });
  element.replaceWith(block);
}
