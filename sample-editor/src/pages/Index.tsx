import React, { useContext, useState, useEffect } from 'react';
import uuidv4 from 'uuidv4';
import { History } from 'history';

import { firebase, FirebaseContext } from '../Firebase';

type IndexProps = { history : History };

const IndexPage: React.FC<IndexProps> = ({ history }) => {
  const [documents, setDocuments] = useState<any>({});
  const { userId } = useContext(FirebaseContext);
  const ref = firebase.database().ref(`users/${userId}/documents`);
  useEffect(() => {
    ref.on('value', snapshot => {
      if (snapshot && snapshot.val()) {
        setDocuments(snapshot.val());
      }
    });
    return () => ref.off();
  }, [ref]);

  const list = Object.keys(documents).map(textId => {
    const title = documents[textId].split('\n')[0];
    return <li key={textId}>{title}</li>;
  });

  return <ul>{list}</ul>;
};

export default IndexPage;