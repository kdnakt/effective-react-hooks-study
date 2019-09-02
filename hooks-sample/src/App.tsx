import React, {
  useState, useEffect,
} from 'react';

const App: React.FC = () => {
  const [name, setName] = useState('');

  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCounter(prev => prev + 1);
    }, 500);
    return () => {
      clearInterval(id);
    }
  }, [counter]);

  return (
    <div>
      <div>Hello react hooks</div>
      <label htmlFor="myname">Name: </label>
      <input value={name} name="myname" onChange={(e) => setName(e.target.value)} />
      <hr />
      <h5>Your name is {name}</h5>
      <hr />
      <h5>{counter}</h5>
    </div>
  );
}

export default App;
