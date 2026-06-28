import { Link } from 'react-router-dom'
import logoGrupo from '../assets/logo_grupo.jpeg'
import './Home.css'

function Home() {
  const menuItems = [
    { label: 'Entidad', path: '/entidad' },
    { label: 'Objeto de Gasto', path: '/obj-gasto' },
    { label: 'Unidad Administrativa', path: '/unidad-administrativa' },
    { label: 'Mes', path: '/mes' },
    { label: 'Estado', path: '/estado' },
    { label: 'Baja', path: '/baja' },
    { label: 'Cta Par', path: '/cta-par' },
  ]


  return (
    <div className="vsiaf-root">



      {/* Encabezado con logo */}
      <header className="encabezado-marca">
        <div className="contenido-marca">
          <div className="bandera" role="img" aria-label="Bandera de Bolivia" />
          <div className="texto-marca">
            <h1 className="titulo-marca">V.S.I.A.F</h1>
            <p className="subtitulo-marca">Sistema de Activos Fijos</p>
          </div>
          {/* aqui agregar logo grupal */}
            <img
                src={logoGrupo}
                alt="Logo 7 Bits Sin Exito"
                className="logo-grupo"
            />

        </div>
      </header>

      {/* Layout principal */}
      <div className="app-layout">

        {/* Sidebar */}
        <nav className="sidebar" aria-label="Menú principal">
          <h2 className="menu-title">MENU PRINCIPAL</h2>
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="menu-btn">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Área de contenido con tarjetas */}
        <main className="content-area">
            <figure className="hero-image" role="img" aria-label="Casa de la Moneda - Potosí">
              <span className="hero-watermark">Potosí</span>
            </figure>

        </main>

      </div>
    </div>
  )
}

export default Home