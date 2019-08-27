import React, { useLayoutEffect, useRef, useEffect, useCallback, useState } from 'react';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js';

import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands.js';
import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js';
import 'monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js';
import 'monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js';
import 'monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js';
import 'monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js';
import 'monaco-editor/esm/vs/editor/contrib/comment/comment.js';
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js';
import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import 'monaco-editor/esm/vs/editor/contrib/folding/folding.js';
import 'monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js';
import 'monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js';
import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js';
import 'monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js'

import { runJSTest } from '../sandbox/javascript';

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

const byExtension: { [ext: string]: string } = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  md: 'markdown', 
};

const getLanguage = (filename: string) => {
  const ext = filename.split('.').pop() || '';
  return byExtension[ext] || 'text';
};

export const useSandbox = (initialSources: { [p: string]: string}) => {
  const [filename, setFilename] = useState('index.test.js');
  const editorDiv = React.useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const subscriptionRef = useRef<monaco.IDisposable[]>([]);
  const [stdout, setStdout] = useState('');
  const [sources, setSources] = useState<{ [name: string]: string }>({});
  const modelsRef = useRef<{ [name: string]: monaco.editor.ITextModel }>({});
  const editorStatesRef = useRef<{
    [name: string]: monaco.editor.ICodeEditorViewState
  }>({});

  const run = useCallback(
    (name: string = 'index.test.js') => {
      console.log('run');
      setStdout('');
      runJSTest(sources, name, setStdout);
    },
    [sources, setStdout]
  );

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

  useEffect(() => {
    editorRef.current!.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
      () => {
        editorRef.current!.getAction('editor.action.formatDocument').run();
        run('index.test.js');
      }
    );
  }, [run]);

  useEffect(() => {
    console.log('create models');
    const newSources: { [name: string]: string } = {};
    Object.keys(initialSources).forEach(name => {
      const text = initialSources[name];
      if (name in modelsRef.current) {
        const model = modelsRef.current[name];
        if (text !== model.getValue()) {
          model.pushEditOperations(
            [],
            [{ range: model.getFullModelRange(), text }],
            () => null
          );
        }
      } else {
        const model = monaco.editor.createModel(text, getLanguage(name));
        model.updateOptions({
          tabSize: 2,
        });
        modelsRef.current[name] = model;
      }
      newSources[name] = modelsRef.current[name].getValue();
    });
    setSources(newSources);
  }, [initialSources]);

  useEffect(() => {
    console.log('setModel', filename);
    editorRef.current!.setModel(modelsRef.current[filename]);
    editorRef.current!.restoreViewState(editorStatesRef.current[filename]);
    editorRef.current!.focus();
  }, [filename]);

  useEffect(() => {
    console.log('subscription', filename);
    subscriptionRef.current.push(
      modelsRef.current[filename].onDidChangeContent(ev => {
        editorStatesRef.current[filename] = editorRef.current!.saveViewState()!;
        setSources(x => ({
          ...x,
          [filename]: modelsRef.current[filename].getValue()
        }));
      })
    );
    return () => {
      unsubscribe();
    };
  }, [filename]);

  const selectFilename = useCallback((s: string) => {
    editorStatesRef.current[filename] = editorRef.current!.saveViewState()!;
    setFilename(s);
  }, [filename]);

  const newFile = useCallback((s: string) => {
    const model = monaco.editor.createModel('', getLanguage(s));
    model.updateOptions({ tabSize: 2 });
    modelsRef.current[s] = model;
    setSources(x => {
      x[s] = x[s] || '';
      return x;
    });
    selectFilename(s);
  }, [selectFilename]);

  return { run, stdout, sources, editorDiv, selectFilename, newFile, filename };
};