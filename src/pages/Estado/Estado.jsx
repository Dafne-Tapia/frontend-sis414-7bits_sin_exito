import { useEffect, useState } from 'react'
import { listarEstados, guardarEstado, actualizarEstado, eliminarEstado } from '../../services/estadoService'
import './estado.css'
import { Link, useNavigate } from 'react-router-dom'
import banderaBol from '../../assets/banderaBol.png';
import logoGrupo from '../../assets/logo_grupo.jpeg'

function Estado() {
  const navigate = useNavigate()
  const [estados, setEstados] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('nuevo')
  const [form, setForm] = useState({ nomestado: '' })
  const [status, setStatus] = useState({ msg: 'Listo.', tipo: '' })
  const [modalError, setModalError] = useState('')
  const [showEliminar, setShowEliminar] = useState(false)

  const menuItems = [
    { label: 'Entidad', path: '/entidad' },
    { label: 'Objeto de Gasto', path: '/obj-gasto' },
    { label: 'Unidad Administrativa', path: '/unidad-administrativa' },
    { label: 'Mes', path: '/mes' },
    { label: 'Estado', path: '/estado' },
    { label: 'Baja', path: '/baja' },
    { label: 'Cta Par', path: '/cta-par' },
  ]

  const setStatusMsg = (msg, tipo = '') => setStatus({ msg, tipo })

  const cargarLista = async () => {
    setStatusMsg('Cargando...', 'loading')
    try {
      const data = await listarEstados()
      setEstados(data)
      setStatusMsg(`${data.length} registro(s) cargado(s).`, 'ok')
    } catch (e) {
      setEstados([])
      setStatusMsg(`Error al cargar: ${e.message}`, 'error')
    } finally {
      setLoading(false)
      setSelected(null)
    }
  }

  useEffect(() => { cargarLista() }, [])

  const handleNuevo = () => {
    setForm({ nomestado: '' })
    setModalMode('nuevo')
    setModalError('')
    setShowModal(true)
  }

  const handleEditar = () => {
    if (!selected) return setStatusMsg('Seleccione una fila para editar.', 'error')
    setForm({ nomestado: selected.nomestado })
    setModalMode('editar')
    setModalError('')
    setShowModal(true)
  }

  const handleEliminar = () => {
    if (!selected) return setStatusMsg('Seleccione una fila para eliminar.', 'error')
    setShowEliminar(true)
  }

  const confirmarEliminar = async () => {
    try {
      await eliminarEstado(selected.codestado)
      await cargarLista()
      setShowEliminar(false)
      setStatusMsg('Estado eliminado correctamente.', 'ok')
    } catch (e) {
      setStatusMsg(`Error al eliminar: ${e.message}`, 'error')
    }
  }

  const handleSeleccionar = () => {
    if (!selected) return setStatusMsg('Seleccione una fila primero.', 'error')
    setStatusMsg(`Código: ${selected.codestado} | Nombre: ${selected.nomestado}`, 'ok')
  }

  const handleGuardar = async () => {
    if (form.nomestado.trim() === '') return setModalError('Ingrese el nombre del estado')
    try {
      if (modalMode === 'nuevo') {
        await guardarEstado({ nomestado: form.nomestado.trim() })
      } else {
        await actualizarEstado(selected.codestado, { codestado: selected.codestado, nomestado: form.nomestado.trim() })
      }
      setShowModal(false)
      await cargarLista()
      setStatusMsg('Operación realizada correctamente.', 'ok')
    } catch (e) {
      setModalError(e.message)
    }
  }

  const filas = Math.max(estados.length, 9)
  const rows = Array.from({ length: filas }, (_, i) => estados[i] || null)

  return (
    <div className="vsiaf-root">
      <div className="win-titlebar">
        <span>&#9632; SISTEMA DE ACTIVOS FIJOS - ESTADO</span>
      </div>

      <header className="encabezado-marca">
        <div className="contenido-marca">
          <img 
            src={banderaBol} 
            alt="Bandera de Bolivia" 
            className="bandera"
          /> 
          <div className="texto-marca">
            <h1 className="titulo-marca">V.S.I.A.F</h1>
            <p className="subtitulo-marca">Sistema de Activos Fijos</p>
          </div>
        </div>
        <img src={logoGrupo} alt="7 bit sin éxito" className="logo-grupo" />
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
              <span>&#9632; Estados</span>
            </div>
            <div className="window-body">
              <h2 className="section-title">GESTIÓN DE ESTADOS</h2>
              <div className="panel">
                <div className="table-wrapper">
                  <div className="table-scroll-area">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '30%' }}>Codestado</th>
                          <th style={{ width: '70%' }}>Nomestado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="2" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                        ) : (
                          rows.map((e, i) => (
                            <tr
                              key={i}
                              className={selected?.codestado === e?.codestado ? 'selected' : ''}
                              onClick={() => e && setSelected(e)}
                              style={{ cursor: e ? 'pointer' : 'default' }}
                            >
                              <td>{e?.codestado ?? ''}</td>
                              <td>{e?.nomestado ?? ''}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
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
              {status.tipo === 'loading' && <span className="spinner"></span>}
              {status.msg}
            </footer>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window">
            <header className="modal-titlebar">
              <span>{modalMode === 'nuevo' ? 'Nuevo Estado' : 'Editar Estado'}</span>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </header>
            <div className="modal-body">
              {modalError && <p className="modal-error">{modalError}</p>}
              <label className="modal-field">
                <span>NOMBRE DEL ESTADO</span>
                <input
                  type="text"
                  value={form.nomestado}
                  onChange={(e) => setForm({ ...form, nomestado: e.target.value })}
                  placeholder="Ingrese nombre"
                  autoFocus
                />
              </label>
            </div>
            <footer className="modal-footer">
              <button className="btn" onClick={handleGuardar}>Aceptar</button>
              <button className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
            </footer>
          </div>
        </div>
      )}

      {showEliminar && (
        <div className="modal-overlay">
          <div className="modal-window">
            <header className="modal-titlebar">
              <span>Eliminar Estado</span>
              <button className="close-btn" onClick={() => setShowEliminar(false)}>✕</button>
            </header>
            <div className="modal-body">
              <p style={{ fontSize: '13px' }}>¿Eliminar el estado <b>{selected?.nomestado}</b>?</p>
            </div>
            <footer className="modal-footer">
              <button className="btn" onClick={confirmarEliminar}>Sí, eliminar</button>
              <button className="btn" onClick={() => setShowEliminar(false)}>Cancelar</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

export default Estado