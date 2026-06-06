const CSS_IMAGE_PATTERN = /^(?:linear-gradient|radial-gradient|repeating-linear-gradient|url\()/i;
const ABSOLUTE_IMAGE_PATTERN = /^(?:https?:|data:)/i;

export function projectImageBackground(image, fallback = 'linear-gradient(135deg,#1a1a1a,#0a0a0a)') {
  if (!image) return fallback;
  if (CSS_IMAGE_PATTERN.test(image)) return image;

  const source = ABSOLUTE_IMAGE_PATTERN.test(image)
    ? image
    : `${import.meta.env.BASE_URL}${String(image).replace(/^\/+/, '')}`;

  return `url("${source}") center / cover no-repeat`;
}
