import './Home.css'

function Home() {
  const menuItems = [
    { label: 'Iniciar Sesión', path: '/login' },
    { label: 'Administrar Recursos', path: '/recursos' },
    { label: 'Entidad', path: '/entidad' },
    { label: 'Objeto de Gasto', path: '/obj-gasto' },
    { label: 'Unidad Administrativa', path: '/unidad-administrativa' },
    { label: 'Mes', path: '/mes' },
    { label: 'Estado', path: '/estado' },
    { label: 'Baja', path: '/baja' },
    { label: 'Cta Par', path: '/cta-par' },
  ]

  const cards = [
    { title: 'Entidad', desc: 'Gestión de entidades del sistema de activos fijos.' },
    { title: 'Objeto de Gasto', desc: 'Administración de objetos de gasto.' },
    { title: 'Unidad Administrativa', desc: 'Gestión de unidades administrativas.' },
    { title: 'Mes', desc: 'Control de meses del sistema.' },
    { title: 'Estado', desc: 'Gestión de estados de activos.' },
    { title: 'Baja', desc: 'Registro de bajas de activos.' },
    { title: 'Cta Par', desc: 'Gestión de cuentas par.' },
  ]

  return (
    <div className="vsiaf-root">

      {/* Barra de título estilo Windows */}
      <div className="win-titlebar">
        <span>&#9632; SISTEMA DE ACTIVOS FIJOS</span>
        <div className="win-controls">
          <button aria-label="Minimizar">&#8211;</button>
          <button aria-label="Maximizar">&#9633;</button>
          <button aria-label="Cerrar" className="cerrar">&#x2715;</button>
        </div>
      </div>

      {/* Encabezado con logo */}
      <header className="encabezado-marca">
        <div className="contenido-marca">
          <div className="bandera" role="img" aria-label="Bandera de Bolivia" />
          <div className="texto-marca">
            <h1 className="titulo-marca">V.S.I.A.F</h1>
            <p className="subtitulo-marca">Sistema de Activos Fijos</p>
          </div>
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
                <a href={item.path} className="menu-btn">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Área de contenido con tarjetas */}
        <main className="content-area">
            <figure className="hero-image" role="img" aria-label="Casa de la Moneda - Potosí">
              <span className="hero-watermark">Potosí</span>
            </figure>
          <div className="home-cards">
            {cards.map((card) => (
              <div className="home-card" key={card.title}>
                <h2>{card.title}</h2>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  )
}

export default Home