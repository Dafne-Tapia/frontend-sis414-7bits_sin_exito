import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CtaPar from './pages/CtaPar'

import Entidad from './pages/Entidad'
import UnidadAdmin from './pages/UnidadAdmin'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cta-par" element={<CtaPar />} />
        <Route path="/entidad" element={<Entidad />} />
        <Route path="/unidad-administrativa" element={<UnidadAdmin />} />
      </Routes>
    </HashRouter>
  )
}
export default App
