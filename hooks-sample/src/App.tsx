import React, {
  useState, useEffect, createContext, useContext,
} from 'react';

const App: React.FC = () => {
  // useState
  const [name, setName] = useState('');

  // useEffect
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCounter(prev => prev + 1);
    }, 500);
    return () => {
      clearInterval(id);
    }
  }, [counter]);

  // useContext
  const context = createContext("");
  const ConsumerSample = () => {
    const text = useContext(context);
    return <b>{text}</b>;
  };

  return (
    <div>
      <div>Hello react hooks</div>
      <label htmlFor="myname">Name: </label>
      <input value={name} name="myname" onChange={(e) => setName(e.target.value)} />
      <hr />
      <h5>Your name is {name}</h5>
      <hr />
      <h5>{counter}</h5>
      <hr />
      <context.Provider value={name}>
        <ConsumerSample />
      </context.Provider>
    </div>
  );
}

export default App;
