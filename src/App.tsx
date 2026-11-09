
import { Routes, Route, Navigate } from "react-router-dom"

import DesignSystem from "@/pages/DesignSystem"
import History from "@/pages/History"
import Dashboard from "@/pages/Dashboard/Dashboard"

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
      <Route path="/ui-preview" element={<DesignSystem />} />
      <Route path="/historial" element={<History />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
