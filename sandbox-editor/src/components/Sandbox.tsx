import React from 'react';
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
  const { editorDiv } = useSandbox();
  return (
    <SandboxDiv>
      <EditorDiv style={{ gridColumn: '1/2' }} ref={editorDiv}/>
      <div style={{ gridColumn: '2/2' }}>
        <button>RUN</button>
      </div>
    </SandboxDiv>
  );
};

export default Sandbox;
