// use-page-meta.js — keep document.title and the description in step with the route.

import React from 'react';

export function usePageMeta({ title, description }) {
  React.useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}

export default usePageMeta;
