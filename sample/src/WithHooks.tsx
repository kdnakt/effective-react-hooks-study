import React, { useState, useEffect } from 'react'

const useInput = (defaultValue: string) => {
  const [value, setValue] = useState(defaultValue);
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }
  return { value, onChange };
}

const App: React.FC = () => {
  const name = useInput('serval')
  const type = useInput('friends')
  const [title, setTitle] = useState(`${name.value} is ${type.value}`)

  useEffect(() => {
    setTitle(`${name.value} is ${type.value}`)
  }, [name, type])

  return (
    <div>
      <input {...name} />
      <input {...type} />
      <h2>{title}</h2>
    </div>
  )
}

export default App