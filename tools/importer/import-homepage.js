/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import cardsBenefitParser from './parsers/cards-benefit.js';
import tabsConditionParser from './parsers/tabs-condition.js';
import testimonialCarouselParser from './parsers/testimonial-carousel.js';
import videoEmbedParser from './parsers/video-embed.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroCtaParser from './parsers/hero-cta.js';

// TRANSFORMER IMPORTS
import omadaCleanupTransformer from './transformers/omada-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'cards-benefit': cardsBenefitParser,
  'tabs-condition': tabsConditionParser,
  'testimonial-carousel': testimonialCarouselParser,
  'video-embed': videoEmbedParser,
  'accordion-faq': accordionFaqParser,
  'hero-cta': heroCtaParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  omadaCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Omada Health homepage: hero banner with video, platform benefit cards, tabbed condition feature slider, FAQ accordion, and a closing CTA section.',
  urls: [
    'https://www.omadahealth.com/',
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['section.hero-banner.banner-video', '.hero-banner'],
    },
    {
      name: 'cards-benefit',
      instances: ['section.cards__card.platform-card', '.platform-cards'],
    },
    {
      name: 'section-conditions-tabs',
      instances: ['section.features-tab-slider.module'],
      section: 'light',
    },
    {
      name: 'tabs-condition',
      instances: ['section.features-tab-slider.module', '.features-tab-slider'],
    },
    {
      name: 'testimonial-carousel',
      instances: ['section.testimonial-slider-section'],
    },
    {
      name: 'section-testimonial-video',
      instances: ['#main-content > div.row-fluid-wrapper.row-depth-1.row-number-6.dnd_area-row-2-padding.dnd-section'],
      section: 'light',
    },
    {
      name: 'video-embed',
      instances: ['#main-content > div.row-fluid-wrapper.row-depth-1.row-number-6.dnd_area-row-2-padding.dnd-section'],
    },
    {
      name: 'section-faq-accordion',
      instances: ['#main-content > div.row-fluid-wrapper.row-depth-1.row-number-11.dnd-section.dnd_area-row-5-padding'],
      section: 'light',
    },
    {
      name: 'accordion-faq',
      instances: ['section.faq-accordion', '.faq-accordion__content'],
    },
    {
      name: 'hero-cta',
      instances: ['section.we-put-healthcare'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * Skips section-* entries (those carry section styling, not a parser).
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    if (blockDef.name.startsWith('section-')) return;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (root "/" collapses to empty → use "/index")
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
