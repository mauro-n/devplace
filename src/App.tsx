import { useState } from 'react'
import './App.css'
import MatrixEisen from './shared/components/MatrixEinsen'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MatrixEisen />
    </>
  )
}

export default App
