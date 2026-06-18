import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UnidadAdmin from './pages/UnidadAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unidad-administrativa" element={<UnidadAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App