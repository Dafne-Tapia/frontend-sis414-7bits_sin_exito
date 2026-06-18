import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Entidad from './pages/Entidad'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entidad" element={<Entidad />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
