import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Mes.css'
import bandera from '../assets/banderaBol.png'
import logoGrupo from '../assets/logo_grupo.jpeg'


// Fuentes igual a la imagen original
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Dancing+Script:wght@600&display=swap'
document.head.appendChild(fontLink)

function Mes() {
  const [registros, setRegistros] = useState([])
  const [nuevoMes, setNuevoMes] = useState({ mes: '', nommes: '' })
  const [editandoId, setEditandoId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [status, setStatus] = useState({ msg: 'Listo.', tipo: '' })
  const navigate = useNavigate()

  const API_URL = 'https://proyectosis414-g-7bitssinexito-rwry.onrender.com/meses'

  const menuItems = [
    { label: 'Entidad', path: '/entidad' },
    { label: 'Objeto de Gasto', path: '/obj-gasto' },
    { label: 'Unidad Administrativa', path: '/unidad-administrativa' },
    { label: 'Mes', path: '/mes' },
    { label: 'Estado', path: '/estado' },
    { label: 'Baja', path: '/baja' },
    { label: 'Cta Par', path: '/cta-par' },
  ]

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setRegistros(data)
        setCargando(false)
        setStatus({ msg: `${data.length} registro(s) cargado(s).`, tipo: 'ok' })
      })
      .catch(error => {
        console.error('Error al cargar meses:', error)
        setCargando(false)
        setStatus({ msg: 'Error al cargar.', tipo: 'error' })
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const numero = parseInt(nuevoMes.mes)
    if (!nuevoMes.nommes.trim()) {
      alert('Debe escribir el nombre de un mes')
      return
    }
    if (editandoId !== null) {
      fetch(`${API_URL}/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes: numero, nommes: nuevoMes.nommes.trim() })
      })
        .then(response => response.json())
        .then(data => {
          setRegistros(registros.map(item => item.id === editandoId ? data : item))
          setNuevoMes({ mes: '', nommes: '' })
          setEditandoId(null)
          alert('Mes actualizado correctamente')
        })
        .catch(() => alert('Error al actualizar el mes'))
    } else {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes: numero, nommes: nuevoMes.nommes.trim() })
      })
        .then(response => response.json())
        .then(data => {
          setRegistros([...registros, data])
          setNuevoMes({ mes: '', nommes: '' })
          alert('Mes guardado correctamente')
        })
        .catch(() => alert('Error al guardar el mes'))
    }
  }

  const handleDelete = (id) => {
    if (confirm('¿Seguro que desea eliminar este mes?')) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => {
          const nuevos = registros.filter(item => item.id !== id)
          setRegistros(nuevos)
          setStatus({ msg: `${nuevos.length} registro(s) cargado(s).`, tipo: 'ok' })
          alert('Mes eliminado correctamente')
        })
        .catch(() => alert('Error al eliminar'))
    }
  }

  const handleEdit = (registro) => {
    setNuevoMes({ mes: registro.mes, nommes: registro.nommes })
    setEditandoId(registro.id)
  }

  const handleCancelEdit = () => {
    setNuevoMes({ mes: '', nommes: '' })
    setEditandoId(null)
  }

  // Igual que ObjGasto: mínimo 9 filas para que la tabla tenga altura fija
  const filas = Math.max(registros.length, 9)
  const rows = Array.from({ length: filas }, (_, i) => registros[i] || null)

  return (
    <div className="mes-root">
      <div className="mes-titlebar">
        <span>■ SISTEMA DE ACTIVOS FIJOS - MES</span>
      </div>

      <header className="mes-encabezado">
        <div className="bandera" />
        <div className="mes-encabezado-texto">
          <h1 className="mes-encabezado-titulo">V.S.I.A.F</h1>
          <p className="mes-encabezado-subtitulo">Sistema de Activos Fijos</p>
        </div>
        <img src={logoGrupo} alt="Logo 7 Bits Sin Exito" className="logo-grupo" />
        <div className="mes-encabezado-acciones">
          <Link to="/" className="mes-encabezado-btn">Volver al menú</Link>
        </div>

      </header>

      <div className="app-layout">
        <nav className="sidebar">
          <h2 className="menu-title">MENU PRINCIPAL</h2>
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button className="menu-btn" onClick={() => navigate(item.path)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="content-area">
          {/* Panel formulario */}
          <div className="mes-panel mes-form-panel">
            <h2>{editandoId !== null ? 'Editar Mes' : 'Registro de Mes'}</h2>
            <form className="mes-form" onSubmit={handleSubmit}>
              <label>
                Número de Mes (1-12)
                <input
                  type="number"
                  placeholder="Ej. 1"
                  min="1"
                  max="12"
                  value={nuevoMes.mes}
                  onChange={(e) => setNuevoMes({ ...nuevoMes, mes: e.target.value })}
                  required
                />
              </label>
              <label>
                Nombre del Mes
                <input
                  type="text"
                  placeholder="Ej. Enero"
                  value={nuevoMes.nommes}
                  onChange={(e) => setNuevoMes({ ...nuevoMes, nommes: e.target.value })}
                  required
                />
              </label>
              <div className="mes-actions">
                {editandoId !== null && (
                  <button type="button" onClick={handleCancelEdit}>Cancelar</button>
                )}
                <button type="submit">{editandoId !== null ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>

          {/* Panel tabla con scroll igual a ObjGasto */}
          <div className="mes-panel">
            <h2>Listado de Meses</h2>
            <div className="mes-table-wrapper">
              <div className="mes-table-scroll-area">
                {cargando ? (
                  <p style={{ textAlign: 'center', padding: '20px' }}>Cargando...</p>
                ) : (
                  <table className="mes-table">
                    <thead>
                      <tr>
                        <th style={{ width: '25%' }}>Número</th>
                        <th style={{ width: '45%' }}>Nombre</th>
                        <th style={{ width: '30%' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((registro, i) => (
                        <tr key={i}>
                          <td>{registro?.mes ?? ''}</td>
                          <td>{registro?.nommes ?? ''}</td>
                          <td>
                            {registro && (
                              <div className="mes-row-actions">
                                <button type="button" onClick={() => handleEdit(registro)}>Editar</button>
                                <button type="button" onClick={() => handleDelete(registro.id)}>Eliminar</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {/* Scrollbar lateral decorativa igual a ObjGasto */}
              <aside className="mes-vscrollbar">
                <button className="mes-vscroll-btn">▲</button>
                <div className="mes-vscroll-track"></div>
                <button className="mes-vscroll-btn">▼</button>
              </aside>
            </div>
            {/* Scrollbar horizontal decorativa */}
            <div className="mes-hscroll-bar">
              <button className="mes-hscroll-btn">◀</button>
              <div className="mes-hscroll-track"></div>
              <button className="mes-hscroll-btn">▶</button>
            </div>
            <footer className={`mes-status-bar ${status.tipo}`}>
              {status.msg}
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Mes
