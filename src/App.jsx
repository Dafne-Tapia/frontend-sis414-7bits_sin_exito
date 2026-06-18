import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
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
