import React, { useState, useEffect, useContext, useReducer, useRef } from 'react';

import MyContext from './../../lib/my-context';

function countReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + 1;
    case 'minus':
      return state - 1;
    default:
      return state;
  }
}

const MyCountFunc = function () {
  // const [count, setCount] = useState(0);

  const [count, dispatchCount] = useReducer(countReducer, 0);
  const [name, setName] = useState('jocky');

  const myContext = useContext(MyContext);

  const inputRef = useRef()

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // setCount((c) => c + 1);
  //     dispatchCount({ type: 'add' });
  //   }, 1000)
  //   return () => clearInterval(interval);
  // }, [])

  useEffect(() => {
    console.log('effect invoked');
    console.log(inputRef);
    return () => console.log('effect detached');
  })

  return (
    <>
      <span>{count}</span>
      <input ref={inputRef} type="text" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => dispatchCount({ type: 'add' })}>{count}</button>
      <p>{myContext}</p>

    </>
  )
}


export default MyCountFunc;