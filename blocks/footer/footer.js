const FOOTER_PATH = '/content/footer.plain.html';

async function fetchFooter() {
  let resp = await fetch(FOOTER_PATH);
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

export default async function decorate(footer) {
  const content = await fetchFooter();
  if (!content) return;

  const sections = [...content.children].filter((el) => el.tagName === 'DIV');
  // Last section is the bottom bar (logo, legal, copyright, social); the rest are link columns.
  const bottom = sections.pop();

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-wrapper';

  const columns = document.createElement('div');
  columns.className = 'footer-columns';
  sections.forEach((sec) => {
    const col = document.createElement('div');
    col.className = 'footer-column';
    while (sec.firstElementChild) col.append(sec.firstElementChild);
    columns.append(col);
  });
  wrapper.append(columns);

  // Bottom bar
  const bottomBar = document.createElement('div');
  bottomBar.className = 'footer-bottom';

  [...bottom.children].forEach((el) => {
    if (el.tagName === 'P' && el.querySelector('img')) {
      el.className = 'footer-logo';
      bottomBar.append(el);
    } else if (el.tagName === 'UL' && el.querySelector('a img')) {
      el.className = 'footer-social';
      el.querySelectorAll('a').forEach((a) => {
        a.target = '_blank';
        a.rel = 'noopener';
      });
      bottomBar.append(el);
    } else if (el.tagName === 'UL') {
      el.className = 'footer-legal';
      bottomBar.append(el);
    } else if (el.tagName === 'P') {
      el.className = 'footer-note';
      bottomBar.append(el);
    }
  });

  wrapper.append(bottomBar);
  footer.append(wrapper);
}
