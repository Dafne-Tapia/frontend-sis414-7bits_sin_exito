import { useEffect, useState } from 'react'
import './UnidadAdmin.css'

const API_URL = 'https://proyectosis414-g-7bitssinexito-2.onrender.com/unidadadmin'

function UnidadAdmin() {
  const [unidades, setUnidades] = useState([])
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [modo, setModo] = useState('nuevo')
  const [form, setForm] = useState({
    entidad: '',
    unidad: '',
    descripcion: '',
    ciudad: ''
  })
  const [mensaje, setMensaje] = useState('Listo.')
  const [cargando, setCargando] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    cargarUnidades()
  }, [])

 const cargarUnidades = async () => {
   setCargando(true)
   try {
     const res = await fetch(API_URL)
     if (!res.ok) throw new Error(`Error del servidor (${res.status})`)
     const data = await res.json()
     setUnidades(data)
     setMensaje(`${data.length} registro(s) cargado(s).`)
   } catch (error) {
     setMensaje(`Error al cargar datos: ${error.message}`)
   } finally {
     setCargando(false)
   }
 }

  const handleNuevo = () => {
    setModo('nuevo')
    setForm({
      entidad: '',
      unidad: '',
      descripcion: '',
      ciudad: ''
    })
    setShowForm(true)
  }

  const handleEditar = () => {
    if (!selected) {
      setMensaje('Seleccione una fila para editar.')
      return
    }

    setModo('editar')
    setForm({
      entidad: selected.entidad,
      unidad: selected.unidad,
      descripcion: selected.descripcion,
      ciudad: selected.ciudad
    })
    setShowForm(true)
  }

  const handleGuardar = async () => {
    if (!form.entidad.trim() || !form.unidad.trim()) {
      setMensaje('Complete al menos Entidad y Unidad antes de guardar.')
      return
    }

    try {
      if (modo === 'nuevo') {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        })
        if (!res.ok) throw new Error(`Error del servidor (${res.status})`)
        setMensaje('Unidad guardada correctamente.')
      } else {
        const res = await fetch(`${API_URL}/${selected.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        })
        if (!res.ok) throw new Error(`Error del servidor (${res.status})`)
        setMensaje('Unidad actualizada correctamente.')
      }

      setShowForm(false)
      setSelected(null)
      cargarUnidades()
    } catch (error) {
      setMensaje(`Error al guardar: ${error.message}`)
    }
  }

  const handleEliminar = async () => {
    if (!selected) {
      setMensaje('Seleccione una fila para eliminar.')
      return
    }

    const confirmar = confirm(`¿Eliminar la unidad ${selected.unidad}?`)

    if (!confirmar) {
      return
    }

    try {
      const res = await fetch(`${API_URL}/${selected.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error(`Error del servidor (${res.status})`)

      setMensaje('Unidad eliminada correctamente.')
      setSelected(null)
      cargarUnidades()
    } catch (error) {
      setMensaje(`Error al eliminar: ${error.message}`)
    }
  }

  const handleSeleccionar = () => {
    if (!selected) {
      setMensaje('Seleccione una fila primero.')
      return
    }

    setMensaje(
      `Seleccionado: ${selected.entidad} - ${selected.unidad} - ${selected.ciudad}`
    )
  }

 const unidadesFiltradas = unidades.filter((u) =>
   u.entidad?.toLowerCase().includes(busqueda.toLowerCase()) ||
   u.ciudad?.toLowerCase().includes(busqueda.toLowerCase())
 )

 const filas = Math.max(unidadesFiltradas.length, 8)
 const rows = Array.from({ length: filas }, (_, index) => unidadesFiltradas[index] || null)

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
          <button onClick={() => window.location.href = '/entidad'}>Entidad</button>
          <button onClick={() => window.location.href = '/obj-gasto'}>Objeto de Gasto</button>
          <button className="activo" onClick={() => window.location.href = '/unidad-administrativa'}>
            Unidad Administrativa
          </button>
          <button onClick={() => window.location.href = '/mes'}>Mes</button>
          <button onClick={() => window.location.href = '/estado'}>Estado</button>
          <button onClick={() => window.location.href = '/baja'}>Baja</button>
          <button onClick={() => window.location.href = '/cta-par'}>Cta Par</button>
        </aside>

        <main className="unidad-content">
          <div className="unidad-info">
            <p><b>ENTIDAD:</b> 0025 Ministerio de la Presidencia</p>
            <p><b>UNIDAD:</b> 0</p>
          </div>

          <section className="unidad-panel">
            <div className="panel-small-title">Unidad Administrativa</div>
            <div className="panel-title">ADMINISTRACION UNIDAD ADMINISTRATIVA</div>
            {cargando && <p className="unidad-mensaje">Cargando datos...</p>}

            <input
              type="text"
              placeholder="Buscar por entidad o ciudad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="unidad-buscador"
            />

            <table className="unidad-table">
              <thead>
                <tr>
                  <th>ENTIDAD</th>
                  <th>UNIDAD</th>
                  <th>DESCRIPCION</th>
                  <th>CIUDAD</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item, index) => (
                  <tr
                    key={index}
                    className={selected?.id === item?.id ? 'fila-seleccionada' : ''}
                    onClick={() => item && setSelected(item)}
                  >
                    <td>{item?.entidad || ''}</td>
                    <td>{item?.unidad || ''}</td>
                    <td>{item?.descripcion || ''}</td>
                    <td>{item?.ciudad || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="unidad-buttons">
              <button onClick={handleNuevo}>Nuevo</button>
              <button onClick={handleEditar}>Editar</button>
              <button onClick={handleEliminar}>Eliminar</button>
              <button onClick={handleSeleccionar}>Seleccionar</button>
              <button onClick={() => window.location.href = '/'}>Salir</button>
            </div>

            <p className="unidad-mensaje">{mensaje}</p>
          </section>
        </main>
      </div>

      {showForm && (
        <div className="unidad-modal">
          <div className="unidad-modal-content">
            <h2>{modo === 'nuevo' ? 'Nueva Unidad Administrativa' : 'Editar Unidad Administrativa'}</h2>

            <label>Entidad</label>
            <input
              type="text"
              value={form.entidad}
              onChange={(e) => setForm({ ...form, entidad: e.target.value })}
            />

            <label>Unidad</label>
            <input
              type="text"
              value={form.unidad}
              onChange={(e) => setForm({ ...form, unidad: e.target.value })}
            />

            <label>Descripción</label>
            <input
              type="text"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />

            <label>Ciudad</label>
            <input
              type="text"
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
            />

            <div className="modal-buttons">
              <button onClick={handleGuardar}>Guardar</button>
              <button onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UnidadAdmin