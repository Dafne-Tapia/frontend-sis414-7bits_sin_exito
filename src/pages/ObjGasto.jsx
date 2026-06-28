import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ObjGasto.css'
import logoGrupo from '../assets/logo_grupo.jpeg'

const API_URL = 'https://proyectosis414-g-7bitssinexito-z8cq.onrender.com'

function ObjGasto() {
    const navigate = useNavigate()
    const [objgastos, setObjgastos] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('nuevo')
    const [form, setForm] = useState({ gestion: '', partida: '', descrip: '' })
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

    const setStatusMsg = (msg, tipo = '') => setStatus({ msg, tipo })

    useEffect(() => { cargarLista() }, [])

    async function cargarLista() {
        setStatusMsg('Cargando...', 'loading')
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/objgastos`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            const lista = Array.isArray(data) ? data : (data.content ?? [])
            setObjgastos(lista)
            setStatusMsg(`${lista.length} registro(s) cargado(s).`, 'ok')
        } catch (e) {
            setStatusMsg('Error al cargar: ' + e.message, 'error')
            setObjgastos([])
        }
        setLoading(false)
        setSelected(null)
    }

    function abrirModal(modo, d = {}) {
        setModalMode(modo)
        setForm({ gestion: d.gestion ?? '', partida: d.partida ?? '', descrip: d.descrip ?? '' })
        setModalError('')
        setShowModal(true)
    }

    function cerrarModal() { setShowModal(false) }

    async function confirmarModal() {
        const body = {
            gestion: parseInt(form.gestion) || null,
            partida: parseInt(form.partida) || null,
            descrip: form.descrip,
        }
        try {
            const url = modalMode === 'nuevo' ? `${API_URL}/objgastos` : `${API_URL}/objgastos/${selected.id}`
            const method = modalMode === 'nuevo' ? 'POST' : 'PUT'
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            cerrarModal()
            await cargarLista()
            setStatusMsg('Operacion exitosa.', 'ok')
        } catch (e) {
            setModalError('Error: ' + e.message)
        }
    }

    async function eliminar() {
        if (!selected) { setStatusMsg('Seleccione una fila para eliminar.', 'error'); return }
        if (!window.confirm(`¿Eliminar ID ${selected.id} — ${selected.descrip}?`)) return
        try {
            const res = await fetch(`${API_URL}/objgastos/${selected.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            await cargarLista()
            setStatusMsg('Registro eliminado.', 'ok')
        } catch (e) {
            setStatusMsg('Error al eliminar: ' + e.message, 'error')
        }
    }

    const filas = Math.max(objgastos.length, 9)
    const rows = Array.from({ length: filas }, (_, i) => objgastos[i] || null)

    return (
        <div className="vsiaf-root">
            <div className="win-titlebar">
                <span>&#9632; SISTEMA DE ACTIVOS FIJOS - OBJETO DE GASTO</span>
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
                            <span>&#9632; Objeto de Gasto</span>
                        </div>
                        <div className="window-body">
                            <h2 className="section-title">GESTION DE OBJETO DE GASTO</h2>
                            <div className="panel">
                                <div className="table-wrapper">
                                    <div className="table-scroll-area">
                                        <table className="data-table">
                                            <thead>
                                            <tr>
                                                <th style={{ width: '19%' }}>GESTION</th>
                                                <th style={{ width: '19%' }}>PARTIDA</th>
                                                <th style={{ width: '62%' }}>DESCRIPCION</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {rows.map((d, i) => (
                                                <tr
                                                    key={i}
                                                    className={selected && d && selected.id === d.id ? 'selected' : ''}
                                                    onClick={() => {
                                                        if (!d) return
                                                        setSelected(d)
                                                        setStatusMsg(`Seleccionado — ID: ${d.id} | Partida: ${d.partida} | ${d.descrip ?? ''}`, 'ok')
                                                    }}
                                                    style={{ cursor: d ? 'pointer' : 'default' }}
                                                >
                                                    <td>{d?.gestion ?? ''}</td>
                                                    <td>{d?.partida ?? ''}</td>
                                                    <td>{d?.descrip ?? ''}</td>
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
                                <button className="btn" onClick={() => abrirModal('nuevo')}>Nuevo</button>
                                <button className="btn" onClick={() => { if (!selected) { setStatusMsg('Seleccione una fila para editar.', 'error'); return } abrirModal('editar', selected) }}>Editar</button>
                                <button className="btn" onClick={eliminar}>Eliminar</button>
                                <button className="btn" onClick={() => navigate('/')}>Salir</button>
                            </nav>
                        </div>
                        <footer className={`status-bar ${status.tipo}`}>
                            {status.tipo === 'loading' && <span className="spinner" />}
                            {status.msg}
                        </footer>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-window">
                        <header className="modal-titlebar">
                            <span>{modalMode === 'nuevo' ? 'Nuevo Objeto de Gasto' : 'Editar Objeto de Gasto'}</span>
                            <button className="close-btn" onClick={cerrarModal}>✕</button>
                        </header>
                        <div className="modal-body">
                            {modalError && <p className="modal-error">{modalError}</p>}
                            <label className="modal-field">
                                <span>GESTION</span>
                                <input type="number" value={form.gestion} onChange={e => setForm({ ...form, gestion: e.target.value })} placeholder="Ej: 2024" />
                            </label>
                            <label className="modal-field">
                                <span>PARTIDA</span>
                                <input type="number" value={form.partida} onChange={e => setForm({ ...form, partida: e.target.value })} placeholder="Ej: 41100" />
                            </label>
                            <label className="modal-field">
                                <span>DESCRIPCION</span>
                                <input type="text" value={form.descrip} onChange={e => setForm({ ...form, descrip: e.target.value })} placeholder="Ej: Edificios" maxLength={100} />
                            </label>
                        </div>
                        <footer className="modal-footer">
                            <button className="btn" onClick={confirmarModal}>Aceptar</button>
                            <button className="btn" onClick={cerrarModal}>Cancelar</button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ObjGasto