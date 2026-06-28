import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './UnidadAdmin.css'
import logoGrupo from '../assets/logo_grupo.jpeg'

const API_URL = 'https://proyectosis414-g-7bitssinexito-2.onrender.com/unidadadmin'

function UnidadAdmin() {
  const navigate = useNavigate()
  const [unidades, setUnidades] = useState([])
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modo, setModo] = useState('nuevo')
  const [form, setForm] = useState({ entidad: '', unidad: '', descripcion: '', ciudad: '' })
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

  useEffect(() => { cargarUnidades() }, [])

  const setStatusMsg = (msg, tipo = '') => setStatus({ msg, tipo })

  const cargarUnidades = async () => {
    setStatusMsg('Cargando...', 'loading')
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      const data = await res.json()
      setUnidades(data)
      setStatusMsg(`${data.length} registro(s) cargado(s).`, 'ok')
    } catch (e) {
      setUnidades([])
      setStatusMsg(`Error al cargar: ${e.message}`, 'error')
    }
  }

  const handleNuevo = () => {
    setForm({ entidad: '', unidad: '', descripcion: '', ciudad: '' })
    setModo('nuevo')
    setModalError('')
    setShowModal(true)
  }

  const handleEditar = () => {
    if (!selected) return setStatusMsg('Seleccione una fila para editar.', 'error')
    setForm({ entidad: selected.entidad, unidad: selected.unidad, descripcion: selected.descripcion, ciudad: selected.ciudad })
    setModo('editar')
    setModalError('')
    setShowModal(true)
  }

  const handleEliminar = async () => {
    if (!selected) return setStatusMsg('Seleccione una fila para eliminar.', 'error')
    if (!confirm(`¿Eliminar la unidad ${selected.unidad}?`)) return
    try {
      const res = await fetch(`${API_URL}/${selected.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      await cargarUnidades()
      setStatusMsg('Unidad eliminada correctamente.', 'ok')
    } catch (e) {
      setStatusMsg(`Error al eliminar: ${e.message}`, 'error')
    }
  }

  const handleSeleccionar = () => {
    if (!selected) return setStatusMsg('Seleccione una fila primero.', 'error')
    setStatusMsg(`Seleccionado: ${selected.entidad} - ${selected.unidad} - ${selected.ciudad}`, 'ok')
  }

  const handleGuardar = async () => {
    try {
      if (modo === 'nuevo') {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        if (!res.ok) throw new Error('Error al guardar')
      } else {
        const res = await fetch(`${API_URL}/${selected.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        if (!res.ok) throw new Error('Error al actualizar')
      }
      setShowModal(false)
      await cargarUnidades()
      setStatusMsg('Operacion realizada correctamente.', 'ok')
    } catch (e) {
      setModalError(e.message)
    }
  }

  const filas = Math.max(unidades.length, 9)
  const rows = Array.from({ length: filas }, (_, i) => unidades[i] || null)

  return (
    <div className="vsiaf-root">
      <div className="win-titlebar">
        <span>&#9632; SISTEMA DE ACTIVOS FIJOS - UNIDAD ADMINISTRATIVA</span>
      </div>

      <header className="encabezado-marca">
        <div className="contenido-marca">
          <div className="bandera" />
          <div className="texto-marca">
            <h1 className="titulo-marca">V.S.I.A.F</h1>
            <p className="subtitulo-marca">Sistema de Activos Fijos</p>
          </div>
          <img src={logoGrupo} alt="Logo 7 Bits Sin Exito" className="logo-grupo" />
        </div>
      </header>

      <div className="app-layout">
        <nav className="sidebar">
          <h2 className="menu-title">MENU PRINCIPAL</h2>
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="menu-btn">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="content-area">
          <div className="window-frame">
            <div className="window-titlebar">
              <span>&#9632; Unidad Administrativa</span>
            </div>
            <div className="window-body">
              <h2 className="section-title">ADMINISTRACION UNIDAD ADMINISTRATIVA</h2>
              <div className="panel">
                <div className="table-wrapper">
                  <div className="table-scroll-area">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ENTIDAD</th>
                          <th>UNIDAD</th>
                          <th>DESCRIPCION</th>
                          <th>CIUDAD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((e, i) => (
                          <tr
                            key={i}
                            className={selected?.id === e?.id ? 'selected' : ''}
                            onClick={() => e && setSelected(e)}
                            style={{ cursor: e ? 'pointer' : 'default' }}
                          >
                            <td>{e?.entidad ?? ''}</td>
                            <td>{e?.unidad ?? ''}</td>
                            <td>{e?.descripcion ?? ''}</td>
                            <td>{e?.ciudad ?? ''}</td>
                          </tr>
                        ))}
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
                <button className="btn" onClick={() => navigate('/')}>Salir</button>
              </nav>
            </div>
            <footer className={`status-bar ${status.tipo}`}>
              {status.msg}
            </footer>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window">
            <header className="modal-titlebar">
              <span>{modo === 'nuevo' ? 'Nueva Unidad' : 'Editar Unidad'}</span>
              <button onClick={() => setShowModal(false)}>✕</button>
            </header>
            <div className="modal-body">
              {modalError && <p className="modal-error">{modalError}</p>}
              <label className="modal-field">
                <span>ENTIDAD</span>
                <input type="text" value={form.entidad} onChange={(e) => setForm({ ...form, entidad: e.target.value })} />
              </label>
              <label className="modal-field">
                <span>UNIDAD</span>
                <input type="text" value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })} />
              </label>
              <label className="modal-field">
                <span>DESCRIPCION</span>
                <input type="text" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
              </label>
              <label className="modal-field">
                <span>CIUDAD</span>
                <input type="text" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
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

export default UnidadAdmin