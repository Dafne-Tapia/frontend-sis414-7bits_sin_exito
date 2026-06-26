import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CtaPar from './pages/CtaPar'

import Entidad from './pages/Entidad'
import UnidadAdmin from './pages/UnidadAdmin'

function App() {
  return (
    <BrowserRouter basename="/frontend-sis414-7bits_sin_exito/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cta-par" element={<CtaPar />} />
        <Route path="/entidad" element={<Entidad />} />
        <Route path="/unidad-administrativa" element={<UnidadAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
