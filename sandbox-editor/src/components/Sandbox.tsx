import React from 'react';
import styled from 'styled-components';

const SandboxDiv = styled.div`
  width: 100vw;
  height: 100vw;
  display: grid;
  grid-template-columns: 50% 50%;
`;

const Sandbox: React.FC = () => {
  return (
    <SandboxDiv>
      This is Sandbox
    </SandboxDiv>
  );
};

export default Sandbox;
