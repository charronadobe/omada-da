export default function decorate(block) {
  const slides = [...block.children].map((row) => {
    const slide = document.createElement('div');
    slide.className = 'testimonial-carousel-slide';
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        cell.className = 'testimonial-carousel-logo';
      } else {
        cell.className = 'testimonial-carousel-body';
      }
      slide.append(cell);
    });
    return slide;
  });

  block.textContent = '';

  const track = document.createElement('div');
  track.className = 'testimonial-carousel-track';
  slides.forEach((s, i) => {
    s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    track.append(s);
  });
  block.append(track);

  if (slides.length <= 1) return;

  let current = 0;
  const dots = document.createElement('div');
  dots.className = 'testimonial-carousel-dots';

  const show = (idx) => {
    current = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i === current ? 'false' : 'true'));
    [...dots.children].forEach((d, i) => d.setAttribute('aria-selected', i === current ? 'true' : 'false'));
  };

  const nav = document.createElement('div');
  nav.className = 'testimonial-carousel-nav';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'testimonial-carousel-prev';
  prev.setAttribute('aria-label', 'Previous testimonial');
  prev.addEventListener('click', () => show(current - 1));
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'testimonial-carousel-next';
  next.setAttribute('aria-label', 'Next testimonial');
  next.addEventListener('click', () => show(current + 1));

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => show(i));
    dots.append(dot);
  });

  nav.append(prev, dots, next);
  block.append(nav);
}
