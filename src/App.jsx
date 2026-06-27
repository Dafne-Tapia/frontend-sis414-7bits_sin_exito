import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Estado from './pages/Estado/Estado'
import CtaPar from './pages/CtaPar'
import Entidad from './pages/Entidad'
import UnidadAdmin from './pages/UnidadAdmin'
import Baja from './pages/Baja'
import ObjGasto from './pages/ObjGasto'
import Mes from './pages/Mes'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cta-par" element={<CtaPar />} />
        <Route path="/entidad" element={<Entidad />} />
        <Route path="/unidad-administrativa" element={<UnidadAdmin />} />
        <Route path="/baja" element={<Baja />} />
        <Route path="/estado" element={<Estado />} />
        <Route path="/obj-gasto" element={<ObjGasto />} />
        <Route path="/mes" element={<Mes />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App