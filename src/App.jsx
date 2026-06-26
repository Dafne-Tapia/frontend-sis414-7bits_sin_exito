import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Estado from './pages/Estado/Estado'
import CtaPar from './pages/CtaPar'
import Entidad from './pages/Entidad'
import UnidadAdmin from './pages/UnidadAdmin'

function App() {
  return (
    <BrowserRouter>
  
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cta-par" element={<CtaPar />} />
        <Route path="/entidad" element={<Entidad />} />
        <Route path="/unidad-administrativa" element={<UnidadAdmin />} />
        <Route path="/estado" element={<Estado />} />
    </Routes>
    </BrowserRouter>
  )
}
export default App
