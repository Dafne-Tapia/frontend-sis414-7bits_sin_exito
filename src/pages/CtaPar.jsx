import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './CtaPar.css'

const emptyForm = {
  codigo: '',
  partida: '',
  descripcion: '',
  tipo: 'Activo fijo',
  estado: 'Activo',
}

function buildApiUrl() {
  if (import.meta.env.VITE_CTA_PAR_API_URL) {
    return import.meta.env.VITE_CTA_PAR_API_URL
  }

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  return `${normalizedBaseUrl}${normalizedBaseUrl.endsWith('/api') ? '' : '/api'}/cta-par`
}

const API_URL = buildApiUrl()

function normalizeRegistro(registro) {
  return {
    ...registro,
    id: registro.id ?? registro.idCtaPar ?? registro.ctaParId ?? registro.codigo ?? registro.cuenta ?? '',
    codigo: String(registro.codigo ?? registro.cuenta ?? registro.codCuenta ?? registro.cod_cta ?? ''),
    partida: String(registro.partida ?? registro.codPartida ?? registro.cod_partida ?? ''),
    descripcion: registro.descripcion ?? registro.descrip ?? registro.nombre ?? '',
    tipo: registro.tipo ?? registro.clase ?? 'Activo fijo',
    estado:
      registro.estado === true
        ? 'Activo'
        : registro.estado === false
          ? 'Inactivo'
          : registro.estado || 'Activo',
  }
}

function toPayload(form) {
  return {
    codigo: form.codigo.trim(),
    partida: form.partida.trim(),
    descripcion: form.descripcion.trim(),
    tipo: form.tipo,
    estado: form.estado,
  }
}

function CtaPar() {
  const [registros, setRegistros] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [selectedRegistro, setSelectedRegistro] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function fetchRegistros() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Error HTTP ${response.status}`)
      }

      const data = await response.json()
      const rows = Array.isArray(data) ? data : data.content || data.data || []
      setRegistros(rows.map(normalizeRegistro))
    } catch (err) {
      setError(err.message || 'No se pudo cargar la tabla cta.par')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // The screen must load the remote table as soon as the module opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRegistros()
  }, [])

  const filteredRegistros = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) {
      return registros
    }

    return registros.filter((registro) =>
      [registro.codigo, registro.partida, registro.descripcion, registro.tipo, registro.estado]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [registros, search])

  function handleInputChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleNuevo() {
    setForm(emptyForm)
    setSelectedRegistro(null)
    setMessage('')
    setError('')
  }

  function handleEdit(registro) {
    setSelectedRegistro(registro)
    setForm({
      codigo: registro.codigo,
      partida: registro.partida,
      descripcion: registro.descripcion,
      tipo: registro.tipo,
      estado: registro.estado,
    })
    setMessage('Registro cargado para editar')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const payload = toPayload(form)
      const editingId = selectedRegistro?.id || selectedRegistro?.codigo
      const url = editingId ? `${API_URL}/${encodeURIComponent(editingId)}` : API_URL
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Error HTTP ${response.status}`)
      }

      handleNuevo()
      setMessage(editingId ? 'Registro actualizado correctamente' : 'Registro creado correctamente')
      await fetchRegistros()
    } catch (err) {
      setError(err.message || 'No se pudo guardar el registro')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(registro) {
    const ok = window.confirm(`Eliminar cuenta ${registro.codigo} con partida ${registro.partida}?`)

    if (!ok) {
      return
    }

    setDeleting(true)
    setMessage('')
    setError('')

    try {
      const id = registro.id || registro.codigo
      const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Error HTTP ${response.status}`)
      }

      setRegistros((current) => current.filter((item) => (item.id || item.codigo) !== id))
      if ((selectedRegistro?.id || selectedRegistro?.codigo) === id) {
        handleNuevo()
      }
      setMessage('Registro eliminado correctamente')
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el registro')
    } finally {
      setDeleting(false)
    }
  }

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
        <div className="cta-par-header-actions">
          <button type="button" onClick={fetchRegistros} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
          <Link to="/" className="cta-par-home">Volver al menu</Link>
        </div>
      </header>

      <main className="cta-par-layout">
        <section className="cta-par-panel cta-par-form-panel" aria-labelledby="form-title">
          <h2 id="form-title">{selectedRegistro ? 'Editar cuenta partida' : 'Registro de cuenta partida'}</h2>

          {(error || message) && (
            <div className={`cta-par-alert ${error ? 'is-error' : 'is-success'}`}>
              {error || message}
            </div>
          )}

          <form className="cta-par-form" onSubmit={handleSubmit}>
            <label>
              Codigo cuenta
              <input
                type="text"
                name="codigo"
                placeholder="Ej. 11220"
                value={form.codigo}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Partida
              <input
                type="text"
                name="partida"
                placeholder="Ej. 43110"
                value={form.partida}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="cta-par-full">
              Descripcion
              <input
                type="text"
                name="descripcion"
                placeholder="Descripcion de la cuenta partida"
                value={form.descripcion}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Tipo
              <select name="tipo" value={form.tipo} onChange={handleInputChange}>
                <option>Activo fijo</option>
                <option>Gasto</option>
                <option>Auxiliar</option>
              </select>
            </label>
            <label>
              Estado
              <select name="estado" value={form.estado} onChange={handleInputChange}>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </label>
            <div className="cta-par-actions">
              <button type="button" onClick={handleNuevo}>Nuevo</button>
              <button type="submit" disabled={saving}>
                {saving ? 'Guardando...' : selectedRegistro ? 'Actualizar' : 'Guardar'}
              </button>
              <button type="button" onClick={handleNuevo}>Cancelar</button>
            </div>
          </form>
        </section>

        <section className="cta-par-panel" aria-labelledby="table-title">
          <div className="cta-par-table-head">
            <h2 id="table-title">Listado de cta.par</h2>
            <label className="cta-par-search">
              Buscar
              <input
                type="search"
                placeholder="Codigo, partida o descripcion"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
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
                {loading && (
                  <tr>
                    <td colSpan="6" className="cta-par-empty">Cargando registros...</td>
                  </tr>
                )}

                {!loading && filteredRegistros.length === 0 && (
                  <tr>
                    <td colSpan="6" className="cta-par-empty">No hay registros para mostrar</td>
                  </tr>
                )}

                {!loading && filteredRegistros.map((registro) => {
                  const rowId = registro.id || registro.codigo
                  const selectedId = selectedRegistro?.id || selectedRegistro?.codigo

                  return (
                    <tr
                      key={`${registro.codigo}-${registro.partida}`}
                      className={rowId === selectedId ? 'is-selected' : ''}
                      onClick={() => handleEdit(registro)}
                    >
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
                          <button type="button" onClick={() => handleEdit(registro)}>Editar</button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleDelete(registro)
                            }}
                            disabled={deleting}
                          >
                            {deleting ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default CtaPar
