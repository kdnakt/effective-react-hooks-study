import React from 'react';
import styled from 'styled-components';

const AppDiv = styled.div`
  width: 100vw;
  height: 100vw;
  overflow: hidden;
  margin: 0px;
  padding: 0px;
`;

const App: React.FC = () => {
  return (
    <AppDiv>
      hello
    </AppDiv>
  );
}

export default App;
