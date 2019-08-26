import React, { useState } from 'react';
import styled from 'styled-components';

import { useSandbox } from './SandboxHooks';

const SandboxDiv = styled.div`
  width: 100vw;
  height: 100vw;
  display: grid;
  grid-template-columns: 50% 50%;
`;

const EditorDiv = styled.div`
  width: 50vw;
  height: 100vw;
`;

const Sandbox: React.FC = () => {
  const { run, stdout, sources, editorDiv, selectFilename, newFile, filename } = useSandbox();
  
  const [newFilename, setNewFilename] = useState('');
  const sourceList = Object.keys(sources).map(name => ({
    name,
    size: sources[name].length
  }));
  
  return (
    <SandboxDiv>
      <EditorDiv style={{ gridColumn: '1/2' }} ref={editorDiv}/>
      <div style={{ gridColumn: '2/2' }}>
        <button onClick={() => run()}>RUN</button>
        <form onSubmit={ev => {
          ev.preventDefault();
          newFile(newFilename);
          setNewFilename('');
        }} >
          <input type='text' value={newFilename}
            onChange={e => setNewFilename(e.target.value)}
          />
          <button type='submit'>Create New File</button>
        </form>
        <div>
          {sourceList.map(({name, size}: any) => {
            const isCurrent = name === filename;
            const style = isCurrent ? { background: '#aacccc' } : {};
            return (
              <div
                key={name}
                onClick={() => selectFilename(name)}
                style={style}
              >
                {name}: {size} bytes
              </div>
            );
          })}
        </div>
        <code>
          <pre>{stdout}</pre>
        </code>
      </div>
    </SandboxDiv>
  );
};

export default Sandbox;
