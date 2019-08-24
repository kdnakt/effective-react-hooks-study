import React, { useLayoutEffect, useRef } from 'react';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

monaco.languages.registerDocumentFormattingEditProvider('javascript', {
  async provideDocumentFormattingEdits(model) {
    const prettier = await import('prettier/standalone');
    const babylon = await import('prettier/parser-babylon');
    const text = prettier.format(model.getValue(), {
      parser: 'babel',
      plugins: [babylon],
      singleQuote: true,
      tabWidth: 2,
    });
    console.log('format');

    return [
      { range: model.getFullModelRange(), text }
    ];
  }
});

export const useSandbox = () => {
  const editorDiv = React.useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const subscriptionRef = useRef<monaco.IDisposable[]>([]);

  const unsubscribe = () => {
    subscriptionRef.current.forEach(subscription => {
      subscription.dispose();
    });
    subscriptionRef.current = [];
  };

  useLayoutEffect(() => {
    console.log('useLayoutEffect', editorDiv.current);
    const height = editorDiv.current!.parentElement!.clientHeight
        - editorDiv.current!.offsetTop;
    editorDiv.current!.style.height = `${height}px`;

    editorRef.current = monaco.editor.create(editorDiv.current!, {
      minimap: {
        enabled: true,
      },
      fontSize: 16,
      lineNumbers: 'on',
      wordWrap: 'on',
      automaticLayout: true,
    });
    editorRef.current.focus();

    return () => {
      console.log('useLayoutEffect disposed');
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = undefined;
      }
      unsubscribe();
    };
  }, []);

  return { editorDiv };
};