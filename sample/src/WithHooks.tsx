import React, { useState, useEffect } from 'react'

const App: React.FC = () => {
  const [name, setName] = useState('serval')
  const [type, setType] = useState('friends')
  const [title, setTitle] = useState(`${name} is ${type}`)

  useEffect(() => {
    setTitle(`${name} is ${type}`)
  }, [name, type])

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  function handleChangeType(e: React.ChangeEvent<HTMLInputElement>) {
    setType(e.target.value)
  }

  return (
    <div>
      <input value={name} onChange={handleChangeName} />
      <input value={type} onChange={handleChangeType} />
      <h2>{title}</h2>
    </div>
  )
}

export default App