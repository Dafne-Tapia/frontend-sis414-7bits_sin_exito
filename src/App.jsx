import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </BrowserRouter>
  )
}
export default App
