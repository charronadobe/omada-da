const NAV_PATH = '/content/nav.plain.html';
const DESKTOP_MQ = window.matchMedia('(min-width: 900px)');

async function fetchNav() {
  let resp = await fetch(NAV_PATH);
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

function closeAllMenus(scope) {
  scope.querySelectorAll('.nav-item.is-open').forEach((el) => el.classList.remove('is-open'));
}

function buildUtilityRow(section) {
  const row = document.createElement('div');
  row.className = 'nav-utility';

  const brand = document.createElement('a');
  brand.className = 'nav-brand';
  const logoLink = section.querySelector('a');
  const logoImg = section.querySelector('img');
  brand.href = logoLink ? logoLink.getAttribute('href') : '/';
  if (logoImg) brand.append(logoImg);
  row.append(brand);

  const tools = document.createElement('div');
  tools.className = 'nav-utility-tools';

  const list = section.querySelector('ul');
  if (list) {
    const ul = document.createElement('ul');
    ul.className = 'nav-utility-links';
    [...list.querySelectorAll(':scope > li')].forEach((li) => {
      const a = li.querySelector('a');
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      item.append(link);
      ul.append(item);
    });
    tools.append(ul);
  }

  const search = document.createElement('button');
  search.className = 'nav-search-toggle';
  search.type = 'button';
  search.setAttribute('aria-label', 'Search');
  tools.append(search);

  row.append(tools);
  return row;
}

function buildMegaMenu(li) {
  // Promo block = leading h6 + following <p>s until the sub-<ul>
  const subList = li.querySelector(':scope > ul');
  if (!subList) return null;

  const panel = document.createElement('div');
  panel.className = 'nav-mega megamenu-panel';

  const promo = document.createElement('div');
  promo.className = 'nav-mega-promo';
  const heading = li.querySelector(':scope > h6');
  if (heading) {
    const h = document.createElement('a');
    const hLink = heading.querySelector('a');
    h.className = 'nav-mega-promo-title';
    h.href = hLink ? hLink.getAttribute('href') : '#';
    h.textContent = heading.textContent.trim();
    promo.append(h);
  }
  // paragraphs between heading and sublist: description + Learn More link
  li.querySelectorAll(':scope > p').forEach((p, idx) => {
    if (idx === 0) return; // first <p> is the trigger label itself
    const a = p.querySelector('a');
    if (a) {
      const link = document.createElement('a');
      link.className = 'nav-mega-promo-cta';
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      promo.append(link);
    } else {
      const desc = document.createElement('p');
      desc.className = 'nav-mega-promo-desc';
      desc.textContent = p.textContent.trim();
      promo.append(desc);
    }
  });
  panel.append(promo);

  const grid = document.createElement('ul');
  grid.className = 'nav-mega-list';
  [...subList.querySelectorAll(':scope > li')].forEach((sub) => {
    const a = sub.querySelector('a');
    const img = sub.querySelector('img');
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    if (img) link.append(img);
    const span = document.createElement('span');
    span.textContent = a.textContent.trim();
    link.append(span);
    item.append(link);
    grid.append(item);
  });
  panel.append(grid);
  return panel;
}

function buildMainNav(section) {
  const nav = document.createElement('nav');
  nav.className = 'nav-main';
  const list = section.querySelector('ul');
  const ul = document.createElement('ul');
  ul.className = 'nav-main-list';

  [...list.querySelectorAll(':scope > li')].forEach((li) => {
    const item = document.createElement('li');
    item.className = 'nav-item';
    const triggerLink = li.querySelector(':scope > p > a');
    const link = document.createElement('a');
    link.className = 'nav-main-link';
    link.href = triggerLink ? triggerLink.getAttribute('href') : '#';
    link.textContent = triggerLink ? triggerLink.textContent.trim() : '';

    const mega = buildMegaMenu(li);
    if (mega) {
      item.classList.add('has-mega');
      const caret = document.createElement('span');
      caret.className = 'nav-caret';
      link.append(caret);
      item.append(link, mega);
      item.addEventListener('mouseenter', () => {
        if (DESKTOP_MQ.matches) item.classList.add('is-open');
      });
      item.addEventListener('mouseleave', () => {
        if (DESKTOP_MQ.matches) item.classList.remove('is-open');
      });
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const open = item.classList.contains('is-open');
        closeAllMenus(ul);
        if (!open) item.classList.add('is-open');
      });
    } else {
      item.append(link);
    }
    ul.append(item);
  });

  nav.append(ul);
  return nav;
}

function buildActions(section) {
  const wrap = document.createElement('div');
  wrap.className = 'nav-actions';
  const list = section.querySelector('ul');
  [...list.querySelectorAll(':scope > li')].forEach((li, idx) => {
    const a = li.querySelector('a');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    // Last action is the primary CTA
    link.className = idx === list.children.length - 1 ? 'nav-cta' : 'nav-login';
    wrap.append(link);
  });
  return wrap;
}

function onResize(header) {
  if (DESKTOP_MQ.matches) {
    header.classList.remove('is-mobile-open');
    closeAllMenus(header);
  }
}

export default async function decorate(header) {
  const nav = await fetchNav();
  if (!nav) return;
  const sections = [...nav.children].filter((el) => el.tagName === 'DIV');

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';

  // Row 1: utility bar (logo + For Individuals/Organizations + search)
  if (sections[0]) wrapper.append(buildUtilityRow(sections[0]));

  // Row 2: main nav (megamenus) + actions (Member Login + CTA)
  const mainRow = document.createElement('div');
  mainRow.className = 'nav-main-row';
  if (sections[1]) mainRow.append(buildMainNav(sections[1]));

  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.type = 'button';
  hamburger.setAttribute('aria-label', 'Menu');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  hamburger.addEventListener('click', () => {
    header.classList.toggle('is-mobile-open');
    hamburger.classList.toggle('is-active');
  });

  if (sections[2]) mainRow.append(buildActions(sections[2]));
  wrapper.append(mainRow);
  wrapper.append(hamburger);

  header.append(wrapper);

  DESKTOP_MQ.addEventListener('change', () => onResize(header));
}
