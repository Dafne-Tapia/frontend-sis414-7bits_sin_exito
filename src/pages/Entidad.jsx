import { useEffect, useState } from 'react'
import './Entidad.css'

const API_URL = 'https://proyectosis414-g-7bitssinexito-rwry.onrender.com/entidades'

function Entidad() {
  const [entidades, setEntidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('nuevo')
  const [form, setForm] = useState({ gestion: '', entidad: '', descEnt: '', siglaEnt: '' })
  const [status, setStatus] = useState({ msg: 'Listo.', tipo: '' })
  const [modalError, setModalError] = useState('')

  const menuItems = [
    { label: 'Entidad', path: '/entidad' },
    { label: 'Objeto de Gasto', path: '/obj-gasto' },
    { label: 'Unidad Administrativa', path: '/unidad-administrativa' },
    { label: 'Mes', path: '/mes' },
    { label: 'Estado', path: '/estado' },
    { label: 'Baja', path: '/baja' },
    { label: 'Cta Par', path: '/cta-par' },
  ]

  useEffect(() => { cargarLista() }, [])

  const setStatusMsg = (msg, tipo = '') => setStatus({ msg, tipo })

  const cargarLista = async () => {
    setStatusMsg('Cargando...', 'loading')
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      const data = await res.json()
      setEntidades(data)
      setStatusMsg(`${data.length} registro(s) cargado(s).`, 'ok')
    } catch (e) {
      setEntidades([])
      setStatusMsg(`Error al cargar: ${e.message}`, 'error')
    } finally {
      setLoading(false)
      setSelected(null)
    }
  }

  const handleNuevo = () => {
    setForm({ gestion: '', entidad: '', descEnt: '', siglaEnt: '' })
    setModalMode('nuevo')
    setModalError('')
    setShowModal(true)
  }

  const handleEditar = () => {
    if (!selected) return setStatusMsg('Seleccione una fila para editar.', 'error')
    setForm({ gestion: selected.gestion, entidad: selected.entidad, descEnt: selected.descEnt, siglaEnt: selected.siglaEnt })
    setModalMode('editar')
    setModalError('')
    setShowModal(true)
  }

  const handleEliminar = async () => {
    if (!selected) return setStatusMsg('Seleccione una fila para eliminar.', 'error')
    if (!confirm(`¿Eliminar entidad ${selected.entidad}?`)) return
    try {
      const res = await fetch(`${API_URL}/${selected.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      await cargarLista()
      setStatusMsg('Entidad eliminada correctamente.', 'ok')
    } catch (e) {
      setStatusMsg(`Error al eliminar: ${e.message}`, 'error')
    }
  }

  const handleSeleccionar = async () => {
    if (!selected) return setStatusMsg('Seleccione una fila primero.', 'error')
    setStatusMsg(`Gestión: ${selected.gestion} | Entidad: ${selected.entidad} | ${selected.descEnt} | ${selected.siglaEnt}`, 'ok')
  }

  const handleGuardar = async () => {
    const body = {
      gestion: Number(form.gestion),
      entidad: Number(form.entidad),
      descEnt: form.descEnt.trim(),
      siglaEnt: form.siglaEnt.trim()
    }
    try {
      if (modalMode === 'nuevo') {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (!res.ok) throw new Error('Error al guardar')
      } else {
        const res = await fetch(`${API_URL}/${selected.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (!res.ok) throw new Error('Error al actualizar')
      }
      setShowModal(false)
      await cargarLista()
      setStatusMsg('Operación realizada correctamente.', 'ok')
    } catch (e) {
      setModalError(e.message)
    }
  }

  const filas = Math.max(entidades.length, 9)
  const rows = Array.from({ length: filas }, (_, i) => entidades[i] || null)

  return (
    <div className="vsiaf-root">
      {/* Barra título Windows */}
      <div className="win-titlebar">
        <span>&#9632; SISTEMA DE ACTIVOS FIJOS</span>
        <div className="win-controls">
          <button>&#8211;</button>
          <button>&#9633;</button>
          <button className="cerrar">&#x2715;</button>
        </div>
      </div>

      {/* Header */}
      <header className="encabezado-marca">
        <div className="contenido-marca">
          <div className="bandera" />
          <div className="texto-marca">
            <h1 className="titulo-marca">V.S.I.A.F</h1>
            <p className="subtitulo-marca">Sistema de Activos Fijos</p>
          </div>
          {/* aqui agregar logo grupal */}
            <img
               src="/src/assets/logo_grupo.jpeg"
               alt="Logo 7 Bits Sin Éxito"
               className="logo-grupo"
            />
        </div>
      </header>

      {/* Layout */}
      <div className="app-layout">
        {/* Sidebar */}
        <nav className="sidebar">
          <h2 className="menu-title">MENU PRINCIPAL</h2>
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.path}>
                <a href={item.path} className="menu-btn">{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenido */}
        <main className="content-area">
          <div className="window-frame">
            <div className="window-titlebar">
              <span>&#9632; Entidades</span>
            </div>

            <div className="window-body">
              <h2 className="section-title">GESTIÓN DE ENTIDADES</h2>

              <div className="panel">
                <div className="table-wrapper">
                  <div className="table-scroll-area">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '14%' }}>GESTIÓN</th>
                          <th style={{ width: '14%' }}>ENTIDAD</th>
                          <th style={{ width: '54%' }}>DESCRIPCIÓN</th>
                          <th style={{ width: '18%' }}>SIGLA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="4" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                        ) : (
                          rows.map((e, i) => (
                            <tr
                              key={i}
                              className={selected?.id === e?.id ? 'selected' : ''}
                              onClick={() => e && setSelected(e)}
                              style={{ cursor: e ? 'pointer' : 'default' }}
                            >
                              <td>{e?.gestion ?? ''}</td>
                              <td>{e?.entidad ?? ''}</td>
                              <td>{e?.descEnt ?? ''}</td>
                              <td>{e?.siglaEnt ?? ''}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <aside className="vscrollbar">
                    <button className="vscroll-btn">&#9650;</button>
                    <div className="vscroll-track"></div>
                    <button className="vscroll-btn">&#9660;</button>
                  </aside>
                </div>
                <div className="hscroll-bar">
                  <button className="hscroll-btn">&#9664;</button>
                  <div className="hscroll-track"></div>
                  <button className="hscroll-btn">&#9654;</button>
                </div>
              </div>

              <nav className="button-bar">
                <button className="btn" onClick={handleNuevo}>Nuevo</button>
                <button className="btn" onClick={handleEditar}>Editar</button>
                <button className="btn" onClick={handleEliminar}>Eliminar</button>
                <button className="btn" onClick={handleSeleccionar}>Seleccionar</button>
                <button className="btn" onClick={() => window.location.href = '/'}>Salir</button>
              </nav>
            </div>

            <footer className={`status-bar ${status.tipo}`}>
              {status.tipo === 'loading' && <span className="spinner"></span>}
              {status.msg}
            </footer>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window">
            <header className="modal-titlebar">
              <span>{modalMode === 'nuevo' ? 'Nueva Entidad' : 'Editar Entidad'}</span>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </header>
            <div className="modal-body">
              {modalError && <p className="modal-error">{modalError}</p>}
              <label className="modal-field">
                <span>GESTIÓN</span>
                <input type="number" value={form.gestion} disabled={modalMode === 'editar'} onChange={(e) => setForm({ ...form, gestion: e.target.value })} placeholder="Ej: 2024" />
              </label>
              <label className="modal-field">
                <span>ENTIDAD</span>
                <input type="number" value={form.entidad} disabled={modalMode === 'editar'} onChange={(e) => setForm({ ...form, entidad: e.target.value })} placeholder="Ej: 10" />
              </label>
              <label className="modal-field">
                <span>DESCRIPCIÓN</span>
                <input type="text" value={form.descEnt} onChange={(e) => setForm({ ...form, descEnt: e.target.value })} placeholder="Nombre de la entidad" />
              </label>
              <label className="modal-field">
                <span>SIGLA</span>
                <input type="text" value={form.siglaEnt} onChange={(e) => setForm({ ...form, siglaEnt: e.target.value })} placeholder="Ej: MIN-EDU" />
              </label>
            </div>
            <footer className="modal-footer">
              <button className="btn" onClick={handleGuardar}>Aceptar</button>
              <button className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
export default Entidad