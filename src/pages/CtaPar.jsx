import { Link } from 'react-router-dom'
import './CtaPar.css'

function CtaPar() {
  const registros = [
    {
      codigo: '11220',
      partida: '43110',
      descripcion: 'Equipo de oficina y muebles',
      tipo: 'Activo fijo',
      estado: 'Activo',
    },
    {
      codigo: '12310',
      partida: '43500',
      descripcion: 'Equipo de computacion',
      tipo: 'Activo fijo',
      estado: 'Activo',
    },
    {
      codigo: '12430',
      partida: '43700',
      descripcion: 'Maquinaria y herramientas',
      tipo: 'Activo fijo',
      estado: 'Inactivo',
    },
  ]

  return (
    <div className="cta-par-root">
      <div className="cta-par-titlebar">
        <span>&#9632; SISTEMA DE ACTIVOS FIJOS - CTA.PAR</span>
        <div className="cta-par-controls">
          <button aria-label="Minimizar">&#8211;</button>
          <button aria-label="Maximizar">&#9633;</button>
          <button className="cta-par-close" aria-label="Cerrar">&#x2715;</button>
        </div>
      </div>

      <header className="cta-par-header">
        <div>
          <p className="cta-par-kicker">Modulo de parametrizacion</p>
          <h1>Tabla cta.par</h1>
        </div>
        <Link to="/" className="cta-par-home">Volver al menu</Link>
      </header>

      <main className="cta-par-layout">
        <section className="cta-par-panel cta-par-form-panel" aria-labelledby="form-title">
          <h2 id="form-title">Registro de cuenta partida</h2>
          <form className="cta-par-form">
            <label>
              Codigo cuenta
              <input type="text" name="codigo" placeholder="Ej. 11220" />
            </label>
            <label>
              Partida
              <input type="text" name="partida" placeholder="Ej. 43110" />
            </label>
            <label className="cta-par-full">
              Descripcion
              <input type="text" name="descripcion" placeholder="Descripcion de la cuenta partida" />
            </label>
            <label>
              Tipo
              <select name="tipo" defaultValue="Activo fijo">
                <option>Activo fijo</option>
                <option>Gasto</option>
                <option>Auxiliar</option>
              </select>
            </label>
            <label>
              Estado
              <select name="estado" defaultValue="Activo">
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </label>
            <div className="cta-par-actions">
              <button type="button">Nuevo</button>
              <button type="submit">Guardar</button>
              <button type="button">Cancelar</button>
            </div>
          </form>
        </section>

        <section className="cta-par-panel" aria-labelledby="table-title">
          <div className="cta-par-table-head">
            <h2 id="table-title">Listado de cta.par</h2>
            <label className="cta-par-search">
              Buscar
              <input type="search" placeholder="Codigo, partida o descripcion" />
            </label>
          </div>

          <div className="cta-par-table-wrap">
            <table className="cta-par-table">
              <thead>
                <tr>
                  <th>Codigo cuenta</th>
                  <th>Partida</th>
                  <th>Descripcion</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={`${registro.codigo}-${registro.partida}`}>
                    <td>{registro.codigo}</td>
                    <td>{registro.partida}</td>
                    <td>{registro.descripcion}</td>
                    <td>{registro.tipo}</td>
                    <td>
                      <span className={`cta-par-status ${registro.estado === 'Activo' ? 'is-active' : 'is-inactive'}`}>
                        {registro.estado}
                      </span>
                    </td>
                    <td>
                      <div className="cta-par-row-actions">
                        <button type="button">Editar</button>
                        <button type="button">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default CtaPar
