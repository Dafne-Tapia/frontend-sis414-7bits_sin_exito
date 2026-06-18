import './UnidadAdmin.css'

function UnidadAdmin() {
  return (
    <div className="unidad-root">
      <div className="unidad-titlebar">SISTEMA DE ACTIVOS FIJOS</div>

      <header className="unidad-header">
        <div className="unidad-bandera"></div>
        <div>
          <h1>V.S.I.A.F</h1>
          <p>Sistema de Activos Fijos</p>
        </div>
      </header>

      <div className="unidad-layout">
        <aside className="unidad-menu">
          <h2>MENU PRINCIPAL</h2>
          <button>Activos Fijos</button>
          <button>Grupos y Auxiliares</button>
          <button>Oficinas y Responsables</button>
          <button>Generar Reportes</button>
          <button>Administradores</button>
          <button>Iniciar sesión</button>
          <button className="activo">Administrar Unidad</button>
          <button>Localización BD</button>
        </aside>

        <main className="unidad-content">
          <div className="unidad-info">
            <p><b>ENTIDAD:</b> 0025 Ministerio de la Presidencia</p>
            <p><b>UNIDAD:</b> 0</p>
          </div>

          <section className="unidad-panel">
            <div className="panel-small-title">Unidad Administrativa</div>
            <div className="panel-title">ADMINISTRACION UNIDAD ADMINISTRATIVA</div>

            <table className="unidad-table">
              <thead>
                <tr>
                  <th>UNIDAD</th>
                  <th>DESCRIPCION</th>
                  <th>CIUDAD</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index}>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="unidad-buttons">
              <button>Nuevo</button>
              <button>Editar</button>
              <button>Eliminar</button>
              <button>Seleccionar</button>
              <button>Salir</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default UnidadAdmin