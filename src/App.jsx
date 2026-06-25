import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UnidadAdmin from './pages/UnidadAdmin'
import Baja from './pages/Baja'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unidad-administrativa" element={<UnidadAdmin />} />
          <Route path="/baja" element={<Baja />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App