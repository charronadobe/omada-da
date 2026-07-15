export default function decorate(block) {
  const rows = [...block.children];
  // First row holds the media reference: an <a> pointing at a video file,
  // a <picture>, or an <img>. Convert it into a background media layer.
  const mediaRow = rows[0];
  const mediaLink = mediaRow?.querySelector('a');
  const picture = mediaRow?.querySelector('picture');

  if (mediaLink && /\.(mp4|webm|ogg)(\?|$)/i.test(mediaLink.getAttribute('href') || '')) {
    const src = mediaLink.getAttribute('href');
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.muted = true;
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.append(source);
    mediaRow.classList.add('hero-video-media');
    mediaRow.replaceChildren(video);
  } else if (picture) {
    mediaRow.classList.add('hero-video-media');
  } else {
    // No background media at all -> light variant with dark text.
    block.classList.add('no-image');
  }

  // Remaining rows carry the text content.
  rows.slice(1).forEach((row) => row.classList.add('hero-video-content'));
}
