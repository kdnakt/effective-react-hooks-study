import React, { useState, useContext, useEffect } from 'react';

import { firebase, FirebaseContext } from './Firebase';

export interface Document {
  texctId: string;
  title: string;
  text: string;
}

export interface UseDocument {
  loaded: boolean;
  pending: boolean;
  text?: string;
  updateText?: (newText: string) => void;
}

export const useDatabaseDocument = (textId: string) => {
  const [text, setText] = useState('');
  const { userId } = useContext(FirebaseContext);
  const [pending, setPending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = React.useRef<any>(undefined);
  useEffect(() => {
    const ref = firebase.database().ref(`users/${userId}/documents/${textId}`);
    ref.on('value', snapshot => {
      if (snapshot && snapshot.val()) {
        setText(snapshot.val().text);
      }
      setLoaded(true);
    });
    return () => ref.off();
  }, [userId, textId]);

  const updateText = (newText: string) => {
    setText(newText);

    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setPending(true);
      const title = newText.split('\n')[0];
      const ref = firebase
        .database()
        .ref(`users/${userId}/documents/${textId}`);
      ref.set({
        textId,
        text: newText,
        title,
        updatedAt: new Date(),
      }).then(() => setPending(false));
      timerRef.current = undefined;
    }, 2000);
  };

  return { text, updateText, loaded, pending };
};

export const useDatabaseAllDocuments = () => {
  const { userId } = useContext(FirebaseContext);
  const [documents, setDocuments] = useState<Document[]>([]);
  useEffect(() => {
    const ref = firebase.database().ref(`users/${userId}/documents`);
    ref.on('value', snapshots => {
      if (!snapshots) return;

      const data = snapshots.val();
      console.log('useDatabaseAllDocuments', data);
      setDocuments(Object.keys(data).map(textId => data[textId]));
    });
    return () => ref.off();
  }, [userId]);
  return documents;
};