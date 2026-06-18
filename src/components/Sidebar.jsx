import { Link } from 'react-router-dom'
import './Sidebar.css'
function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/entidad">Entidad</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </aside>
  )
}
export default Sidebar