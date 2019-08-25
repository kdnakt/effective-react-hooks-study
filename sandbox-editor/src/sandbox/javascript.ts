import expect from 'expect';
const { SaferEval } = require('safer-eval');

const runInJSSandbox = (
  sources: {[name: string]: string},
  filename: string,
  setStdout: (s: string | ((s: string) => string)) => void
) => { 
  console.log('run JS', filename);
  const consoleInSandbox = (...args: any[]) =>
      setStdout(s => s + args.map(arg => arg.toString()).join(' '));
  
  const tests: { [ d: string]: { [ t: string ]: Function } } = { '': {} };
  let current = '';
  const module = { exports: {} };

  const describe = (label: string, cb: Function) => {
    console.log('describe', label);
    tests[label] = tests[label] || {};
    current = label;
    cb();
  };

  const test = (label: string, cb: Function) => {
    console.log('test', current, label);
    tests[current][label] = cb;
  }

  const sandbox = new SaferEval({
    expect,
    console: {
      log: consoleInSandbox,
      dir: consoleInSandbox,
    },
    describe,
    test,
    it: test,
    module,
    require: (s: string) => {
      const { exports } = runInJSSandbox(sources, s, setStdout);
      console.log('exports', s, exports);
      return exports;
    },
  });

  const code = `function() {${sources[filename]}}`;
  sandbox.runInContext(code);
  return {
    exports: module.exports,
    tests,
  };
};

export const runJSTest = async (
  sources: {[name: string]: string},
  entrypoint: string,
  setStdout: (s: string | ((s: string) => string)) => void
) => {
  setStdout('');

  try {
    const { tests } = runInJSSandbox(sources, entrypoint, setStdout);
    console.dir('test results', tests);

    Object.keys(tests).forEach(testDesc => {
      setStdout(s => s + testDesc + '\n');
      Object.keys(tests[testDesc]).forEach(testSubj => {
        setStdout(s => s + 'test: ' + testSubj + '\n');
        tests[testDesc][testSubj]();
        setStdout(s => s + '.');
      });
      setStdout(s => s + '\n');
    });

    setStdout(s => s + '\n\nOK.\n');
  } catch (e) {
    console.dir(e.matcherResult);
    setStdout(s => s + e.toString());
  }
}