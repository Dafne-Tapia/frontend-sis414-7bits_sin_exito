import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Estado from './pages/Estado/Estado'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/estado" element={<Estado />} />
    </Routes>
    </BrowserRouter>
  )
}
export default App