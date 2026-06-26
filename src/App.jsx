import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

import Entidad from './pages/Entidad'
import UnidadAdmin from './pages/UnidadAdmin'
import ObjGasto from './pages/ObjGasto'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/entidad" element={<Entidad />} />
          <Route path="/unidad-administrativa" element={<UnidadAdmin />} />
          <Route path="/obj-gasto" element={<ObjGasto />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
