import React, {
  useState, useEffect, createContext, useContext, useReducer, useMemo, useRef, useLayoutEffect,
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

  // useReducer
  interface State {
    count: number;
  }
  const initialState: State = { count: 0 };
  const add = (n: number) => ({ type: "ADD", payload: n } as const);
  const sub = (n: number) => ({ type: "SUB", payload: n } as const);
  type ReturnType<T extends (...args: any[]) => any> = T extends (
    ...args: any[]
  ) => infer R ? R : never;
  type Action = ReturnType<typeof add | typeof  sub>;
  const reducer: React.Reducer<State, Action> = (state, action) => {
    switch (action.type) {
      case "ADD":
        return { count: state.count + action.payload };
      case "SUB":
        return { count: state.count - action.payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  // useMemo
  const calculate = (count: number) => {
    console.log('useMemo called', count);
    return count + 10;
  };
  const memo = useMemo(() => calculate(state.count), [state.count < 10]);

  // useRef
  const myref = useRef<HTMLInputElement>(null);

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
      <hr />
      <div>
        <h5>useReducer</h5>
        <span>{state.count}</span>
        <button onClick={() => dispatch(add(1))}>add</button>
        <button onClick={() => dispatch(sub(1))}>sub</button>
      </div>
      <hr />
      <div>
        <h5>useMemo()</h5>
        <span>{memo}</span>
      </div>
      <hr />
      <div>
        <input type="text" ref={myref} />
        <button onClick={() => myref.current!.focus()}>focus</button>
      </div>
    </div>
  );
}

export default App;
