import React from 'react';

import WithHooks from './WithHooks';
import WithoutHooks from './WithoutHooks';

const App: React.FC = () => {
  return (
    <div style={{ display: 'grid' }}>
      <div style={{ gridColumn: '1/2' }}>
        <div>Class Component version</div>
        <WithoutHooks />
      </div>
      <div style={{ gridColumn: '2/2' }}>
        <div>React Hooks version</div>
        <WithHooks />
      </div>
    </div>
  );
};

export default App;
