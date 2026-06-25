import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CtaPar from './pages/CtaPar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cta-par" element={<CtaPar />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
