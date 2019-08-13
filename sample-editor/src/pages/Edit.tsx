import React from 'react';
import styled from 'styled-components';

import { Link } from '../Router';
import { useDatabaseDocument } from '../FirebaseDatabase';

const Input = styled.textarea`
  width: 100%;
  height: 90vh;
  ::focus {
    outline: none;
  }
  font-size: 16px;
  font-family: 'monospace';
`;

const EditPage: React.FC<{ textId: string }> = props => {
  const { textId } = props;
  const { text, updateText, loaded, pending } = useDatabaseDocument(textId);

  if (!loaded) {
    return <div>Now Loading ...</div>;
  }

  return (
    <>
      <div>{ pending ? 'Please wait for a while' : ''  }</div>
      <Link as="button" href="/">
        Back to list
      </Link>
      <Input
        value={text}
        onChange={e => updateText(e.target.value)}
        autoFocus
      />
    </>
  );
};

export default EditPage;