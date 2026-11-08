import { Routes, Route, Navigate } from 'react-router-dom'

function Home() {
  return (
    <main>
      <h1>Butaca</h1>
      <p>Frontend en configuración.</p>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App