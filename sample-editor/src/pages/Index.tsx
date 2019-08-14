import React, { useContext, useState, useEffect } from 'react';

import { firebase, FirebaseContext } from '../Firebase';

const IndexPage = () => {
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