import React from 'react';

export const useSandbox = () => {
  const editorDiv = React.useRef<HTMLDivElement>(null);

  return { editorDiv };
};