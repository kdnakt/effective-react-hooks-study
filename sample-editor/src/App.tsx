import React from 'react';
import { History } from 'history';

import { FirebaseAuth, signInWithRedirect, signOut } from './FirebaseAuth';

import { Router } from './Router';

const Content: React.FC<{ history : History }> = ({ history }) => {
  return <Router history={history} />;
};

const App: React.FC<{ history: History }> = ({ history }) => {
  const NotSignedIn = React.useCallback(() => {
    return <button onClick={() => signInWithRedirect()}>Sign In</button>;
  }, []);
  const Loading = React.useCallback(() => {
    return <div>Loading Now ....</div>;
  }, []);

  return (
    <FirebaseAuth NotSignedIn={NotSignedIn} Loading={Loading}>
      <Content history={history} />
      <button onClick={signOut}>Sign Out</button>
    </FirebaseAuth>
  );
}

export default App;
