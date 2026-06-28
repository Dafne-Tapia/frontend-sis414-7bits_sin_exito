import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Mes.css'

function Mes() {
  const [registros, setRegistros] = useState([])
  const [nuevoMes, setNuevoMes] = useState({ mes: '', nommes: '' })
  const [editandoId, setEditandoId] = useState(null)
  const [cargando, setCargando] = useState(true)
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
      })
      .catch(error => {
        console.error('Error al cargar meses:', error)
        setCargando(false)
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
          setRegistros(registros.filter(item => item.id !== id))
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

  return (
    <div className="mes-root">
      <div className="mes-titlebar">
        <span>■ SISTEMA DE ACTIVOS FIJOS - MES</span>
      </div>

      {/* Encabezado reducido con botón Volver al menú arriba a la derecha */}
      <div className="mes-encabezado">
        <div className="mes-encabezado-texto">
          <p className="mes-encabezado-modulo">MODULO DE PARAMETRIZACION</p>
          <h1 className="mes-encabezado-titulo">Mes</h1>
        </div>
        <div className="mes-encabezado-acciones">
          <Link to="/" className="mes-encabezado-btn">Volver al menú</Link>
        </div>
      </div>

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

          <div className="mes-panel">
            <div className="mes-table-head">
              <h2>Listado de Meses</h2>
            </div>
            {/* Scroll fijo en la tabla como obj-gasto */}
            <div className="mes-table-wrap">
              {cargando ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>Cargando...</p>
              ) : (
                <table className="mes-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Número</th>
                      <th>Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                          No hay meses registrados.
                        </td>
                      </tr>
                    ) : (
                      registros.map((registro) => (
                        <tr key={registro.id}>
                          <td>{registro.id}</td>
                          <td>{registro.mes}</td>
                          <td>{registro.nommes}</td>
                          <td>
                            <div className="mes-row-actions">
                              <button type="button" onClick={() => handleEdit(registro)}>Editar</button>
                              <button type="button" onClick={() => handleDelete(registro.id)}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="mes-table-footer">
              {registros.length} registro(s) cargado(s).
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Mes
