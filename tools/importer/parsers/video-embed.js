/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video-embed. Base: video.
 * Source: https://www.omadahealth.com/
 * Generated: 2026-07-15
 *
 * Structure (from video library-description.txt): 1 column, 2 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: video source (e.g. streaming URL) in the single cell.
 *
 * Source embeds a Vimeo player via <iframe src="https://player.vimeo.com/video/...">.
 * The Video block expects a link/URL, so the iframe src is emitted as an anchor.
 * An optional heading above the embed is preserved in the same cell.
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h2, h3, .hs_cos_wrapper_type_rich_text h2');

  // Locate the embedded video. Prefer an iframe (Vimeo/YouTube), fall back to <video>/<source>.
  // Scope to the section first; if the embed lives in a sibling subtree that isn't a
  // descendant of the matched element, fall back to the whole document.
  const iframe = element.querySelector(
      'iframe[src*="vimeo"], iframe[src*="youtube"], .iframe_wrapper iframe, iframe',
    )
    || document.querySelector(
      '.embed_container iframe[src*="vimeo"], iframe[src*="vimeo"], iframe[src*="youtube"]',
    );
  const videoEl = element.querySelector('video source[src], video[src]')
    || document.querySelector('video source[src], video[src]');

  let videoUrl = '';
  if (iframe && iframe.getAttribute('src')) {
    videoUrl = iframe.getAttribute('src');
  } else if (videoEl) {
    videoUrl = videoEl.getAttribute('src');
  }

  // Empty-block guard
  if (!videoUrl && !heading) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);

  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    contentCell.push(link);
  }

  const cells = [];
  cells.push([contentCell]); // 1-column block: one row, one cell holding all content

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-embed', cells });
  element.replaceWith(block);
}
