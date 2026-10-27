// CardImage.jsx — the screenshot (or gradient) filling a project card's visual.
//
// Screenshots used to be CSS backgrounds, so the archive downloaded every one
// up front and assistive tech got nothing. A real <img> lazy-loads and can
// carry alt text; gradient placeholders stay backgrounds.

import React from 'react';
import { projectImageBackground, projectImageSource } from '../lib/project-image';

export function CardImage({ project, alt = '', style }) {
  const src = projectImageSource(project.img);
  const fill = { position: 'absolute', inset: 0, ...style };
  if (!src) return <div data-img style={{ ...fill, background: projectImageBackground(project.img) }} />;
  return (
    <img
      data-img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ ...fill, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}

export default CardImage;
