/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Omada Health (HubSpot CMS) site-wide cleanup.
 *
 * All selectors below were verified against migration-work/cleaned.html.
 * Removes non-authorable HubSpot chrome (cookie banner, header/nav, footer,
 * web-interactives anchors/overlays, tracking beacons) plus leftover
 * embed/link elements and tracking attributes.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent banner (cleaned.html:4-27) and HubSpot web-interactives /
    // modal overlays (cleaned.html:2 and 2761-2776). Removed before parsing so
    // overlays cannot interfere with block matching.
    WebImporter.DOMUtils.remove(element, [
      '#hs-banner-parent',
      '#hs-eu-cookie-confirmation',
      '#hs-web-interactives-top-push-anchor',
      '#hs-web-interactives-top-anchor',
      '#hs-web-interactives-bottom-anchor',
      '#hs-web-interactives-floating-container',
      '#hs-interactives-modal-overlay',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome: header/nav (cleaned.html:30-33, incl.
    // #logo-bar and #hs_cos_wrapper_top-notification) and footer
    // (cleaned.html:2409). Tracking beacons (cleaned.html:2758-2759) and any
    // leftover non-authorable elements.
    WebImporter.DOMUtils.remove(element, [
      'header.fixed-top',
      '#hs_cos_wrapper_top-notification',
      '#logo-bar',
      'footer.footer',
      '[id^="batBeacon"]',
      'iframe',
      'noscript',
      'script',
      'style',
      'link',
    ]);

    // Strip HubSpot / analytics tracking attributes left on remaining nodes.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-hs-cos-general-type');
      el.removeAttribute('data-hs-cos-type');
    });
  }
}
