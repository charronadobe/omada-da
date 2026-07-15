// Collapses the page's "Disclaimer" block behind its heading (click to reveal),
// matching the source site where the disclaimer text is hidden by default.
export default function decorateDisclaimer() {
  const heading = document.querySelector('main h6#disclaimer');
  if (!heading || heading.dataset.disclosure) return;
  heading.dataset.disclosure = 'true';
  heading.classList.add('disclaimer-toggle');
  heading.setAttribute('role', 'button');
  heading.setAttribute('tabindex', '0');
  heading.setAttribute('aria-expanded', 'false');

  const body = [];
  let sib = heading.nextElementSibling;
  while (sib && sib.tagName === 'P') {
    body.push(sib);
    sib = sib.nextElementSibling;
  }

  const panel = document.createElement('div');
  panel.className = 'disclaimer-body';
  heading.after(panel);
  body.forEach((p) => panel.append(p));

  const toggle = () => {
    const open = heading.getAttribute('aria-expanded') === 'true';
    heading.setAttribute('aria-expanded', open ? 'false' : 'true');
  };
  heading.addEventListener('click', toggle);
  heading.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
}
