import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Mes.css'

function Mes() {
  const [registros, setRegistros] = useState([])
  const [nuevoMes, setNuevoMes] = useState({ mes: '', nommes: '' })
  const [editandoId, setEditandoId] = useState(null)
  const [cargando, setCargando] = useState(true)

  const API_URL = 'https://proyectosis414-g-7bitssinexito-ewht.onrender.com/meses'

  // ===== MENÚ COMPLETO (IGUAL QUE ENTIDAD) =====
  const menuItems = [
    { label: 'Entidad', path: '/entidad' },
    { label: 'Objeto de Gasto', path: '/obj-gasto' },
    { label: 'Unidad Administrativa', path: '/unidad-administrativa' },
    { label: 'Mes', path: '/mes' },
    { label: 'Estado', path: '/estado' },
    { label: 'Baja', path: '/baja' },
    { label: 'Cta Par', path: '/cta-par' },
  ]
  // ===== FIN MENÚ =====

  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta')
        }
        return response.json()
      })
      .then(data => {
        setRegistros(data)
        setCargando(false)
      })
      .catch(() => {
        setCargando(false)
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const numero = parseInt(nuevoMes.mes)
    if (numero < 1 || numero > 12) {
      alert('El número de mes debe estar entre 1 y 12')
      return
    }

    if (!nuevoMes.nommes.trim()) {
      alert('Debes escribir un nombre de mes')
      return
    }

    const nuevoRegistro = {
      mes: numero,
      nommes: nuevoMes.nommes.trim()
    }

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoRegistro)
    })
    .then(response => response.json())
    .then(data => {
      setRegistros([...registros, data])
      setNuevoMes({ mes: '', nommes: '' })
    })
    .catch(error => {
      alert('Error al guardar en la base de datos')
    })
  }

  const handleDelete = (id) => {
    if (confirm('¿Seguro que quieres eliminar este mes?')) {
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        const filtrados = registros.filter(item => item.id !== id)
        setRegistros(filtrados)
      })
      .catch(error => {
        alert('Error al eliminar')
      })
    }
  }

  const handleEdit = (registro) => {
    setNuevoMes({ mes: registro.mes.toString(), nommes: registro.nommes })
    setEditandoId(registro.id)
  }

  const handleCancelEdit = () => {
    setNuevoMes({ mes: '', nommes: '' })
    setEditandoId(null)
  }

  if (cargando) {
    return <div className="mes-root"><div className="mes-panel">Cargando...</div></div>
  }

  return (
    <div className="mes-root">
      <div className="mes-titlebar">
        <span>■ SISTEMA DE ACTIVOS FIJOS - MES</span>
        <div className="mes-controls">
          <button aria-label="Minimizar">–</button>
          <button aria-label="Maximizar">□</button>
          <button className="mes-close" aria-label="Cerrar">✕</button>
        </div>
      </div>

      <header className="mes-header">
        <div>
          <p className="mes-kicker">Módulo de parametrización</p>
          <h1>Tabla Mes</h1>
        </div>
        <Link to="/" className="mes-home">Volver al menú</Link>
      </header>

      {/* ===== LAYOUT CON SIDEBAR (EXACTAMENTE IGUAL QUE ENTIDAD) ===== */}
      <div className="app-layout">
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
                  onChange={(e) => setNuevoMes({...nuevoMes, mes: e.target.value})}
                  required
                />
              </label>
              <label>
                Nombre del Mes
                <input 
                  type="text" 
                  placeholder="Ej. Enero" 
                  value={nuevoMes.nommes}
                  onChange={(e) => setNuevoMes({...nuevoMes, nommes: e.target.value})}
                  required
                />
              </label>
              <div className="mes-actions">
                <button type="submit">{editandoId !== null ? 'Actualizar' : 'Guardar'}</button>
                {editandoId !== null && (
                  <button type="button" onClick={handleCancelEdit}>Cancelar</button>
                )}
              </div>
            </form>
          </div>

          <div className="mes-panel">
            <div className="mes-table-head">
              <h2>Listado de Meses</h2>
            </div>

            <div className="mes-table-wrap">
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
                      <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>
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
            </div>
          </div>
        </main>
      </div>
      {/* ===== FIN LAYOUT ===== */}
    </div>
  )
}

export default Mes