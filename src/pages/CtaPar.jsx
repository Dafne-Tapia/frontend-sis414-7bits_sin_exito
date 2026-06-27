import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './CtaPar.css'

const API_BASE_URL = 'https://proyectosis414-g-7bitssinexito-rwry.onrender.com/cta-par'
const API_URL = `${API_BASE_URL}/cta-par`

const emptyForm = {
  codigo: '',
  partida: '',
  descripcion: '',
  tipo: 'Activo fijo',
  estado: 'Activo',
}

function getRegistroId(registro) {
  return (
      registro.id ??
      registro.idCtaPar ??
      registro.ctaParId ??
      registro.id_cta_par ??
      registro.codigo ??
      registro.cuenta ??
      registro.codCuenta ??
      ''
  )
}

function normalizeEstado(value) {
  if (value === true || value === 1 || value === '1') return 'Activo'
  if (value === false || value === 0 || value === '0') return 'Inactivo'
  return value || 'Activo'
}

function normalizeRegistro(registro) {
  return {
    ...registro,
    id: getRegistroId(registro),
    codigo: String(registro.codigo ?? registro.cuenta ?? registro.codCuenta ?? registro.codigoCuenta ?? registro.cod_cta ?? ''),
    partida: String(registro.partida ?? registro.codPartida ?? registro.codigoPartida ?? registro.cod_partida ?? ''),
    descripcion: registro.descripcion ?? registro.descrip ?? registro.nombre ?? '',
    tipo: registro.tipo ?? registro.clase ?? 'Activo fijo',
    estado: normalizeEstado(registro.estado ?? registro.estadoregistro ?? registro.activo),
  }
}

function extractRows(data) {
  if (Array.isArray(data)) return data
  return data?.content || data?.data || data?.rows || data?.registros || []
}

async function readResponse(response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback
  if (typeof data === 'string') return data
  return data.message || data.error || data.detail || fallback
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
  const [deletingId, setDeletingId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function fetchRegistros() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL)
      const data = await readResponse(response)

      if (!response.ok) {
        throw new Error(getErrorMessage(data, `Error HTTP ${response.status}`))
      }

      setRegistros(extractRows(data).map(normalizeRegistro))
    } catch (err) {
      setRegistros([])
      setError(err.message || 'No se pudo cargar la tabla cta.par')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistros()
  }, [])

  const filteredRegistros = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return registros

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

    if (!form.codigo.trim() || !form.partida.trim() || !form.descripcion.trim()) {
      setMessage('')
      setError('Complete codigo cuenta, partida y descripcion.')
      return
    }

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
      const data = await readResponse(response)

      if (!response.ok) {
        throw new Error(getErrorMessage(data, `Error HTTP ${response.status}`))
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
    const id = registro.id || registro.codigo
    const ok = window.confirm(`Eliminar cuenta ${registro.codigo} con partida ${registro.partida}?`)
    if (!ok) return

    setDeletingId(id)
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' })
      const data = await readResponse(response)

      if (!response.ok) {
        throw new Error(getErrorMessage(data, `Error HTTP ${response.status}`))
      }

      setRegistros((current) => current.filter((item) => (item.id || item.codigo) !== id))
      if ((selectedRegistro?.id || selectedRegistro?.codigo) === id) handleNuevo()
      setMessage('Registro eliminado correctamente')
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el registro')
    } finally {
      setDeletingId('')
    }
  }

  return (
      <div className="cta-par-root">
        <div className="cta-par-titlebar">
          <span>SISTEMA DE ACTIVOS FIJOS - CTA.PAR</span>
          <div className="cta-par-controls" aria-hidden="true">
            <span></span>
            <span></span>
            <span className="is-close"></span>
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
                />
              </label>
              <label>
                Tipo
                <select name="tipo" value={form.tipo} onChange={handleInputChange} disabled={saving}>
                  <option>Activo fijo</option>
                  <option>Gasto</option>
                  <option>Auxiliar</option>
                </select>
              </label>
              <label>
                Estado
                <select name="estado" value={form.estado} onChange={handleInputChange} disabled={saving}>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </label>
              <div className="cta-par-actions">
                <button type="button" onClick={handleNuevo} disabled={saving}>Nuevo</button>
                <button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : selectedRegistro ? 'Actualizar' : 'Guardar'}
                </button>
                <button type="button" onClick={handleNuevo} disabled={saving}>Cancelar</button>
              </div>
            </form>
          </section>

          <section className="cta-par-panel cta-par-list-panel" aria-labelledby="table-title">
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
                  const isDeleting = deletingId === rowId

                  return (
                      <tr
                          key={`${registro.codigo}-${registro.partida}-${rowId}`}
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
                            <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleEdit(registro)
                                }}
                            >
                              Editar
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleDelete(registro)
                                }}
                                disabled={Boolean(deletingId)}
                            >
                              {isDeleting ? 'Eliminando...' : 'Eliminar'}
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