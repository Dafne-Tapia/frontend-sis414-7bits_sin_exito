import { Link } from 'react-router-dom'
import './Sidebar.css'
function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/entidad">Entidad</Link></li>
        <li><Link to="/obj-gasto">Objeto de Gasto</Link></li>
        <li><Link to="/unidad-administrativa">Unidad Administrativa</Link></li>
        <li><Link to="/mes">Mes</Link></li>
        <li><Link to="/estado">Estado</Link></li>
        <li><Link to="/baja">Baja</Link></li>
        <li><Link to="/cta-par">Cta Par</Link></li>
      </ul>
    </aside>
  )
}

export default Sidebar