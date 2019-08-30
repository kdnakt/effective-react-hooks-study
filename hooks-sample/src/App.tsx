import React, {
  useState,
} from 'react';

const App: React.FC = () => {
  const [name, setName] = useState('');

  return (
    <div>
      <div>Hello react hooks</div>
      <label htmlFor="myname">Name: </label>
      <input value={name} name="myname" onChange={(e) => setName(e.target.value)} />
      <hr />
      <h5>Your name is {name}</h5>
    </div>
  );
}

export default App;
