import { useState, useEffect } from "react";
import "./Baja.css";

const API_URL = "https://proyectosis414-g-7bitssinexito-rh8p.onrender.com/bajas";

function Baja() {
    const [bajas, setBajas] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [form, setForm] = useState({ codbaja: "", descbaja: "" });
    const [modo, setModo] = useState("");
    const [mensaje, setMensaje] = useState("Listo.");

    useEffect(() => {
        cargarBajas();
    }, []);

    const cargarBajas = async () => {
        setMensaje("Cargando...");
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setBajas(data);
            setMensaje("Listo.");
        } catch {
            setMensaje("Error al cargar datos.");
        }
    };

    const handleNuevo = () => {
        setForm({ codbaja: "", descbaja: "" });
        setSeleccionado(null);
        setModo("nuevo");
    };

    const handleEditar = () => {
        if (!seleccionado) return;
        setForm({ codbaja: seleccionado.codbaja, descbaja: seleccionado.descbaja });
        setModo("editar");
    };

    const handleEliminar = async () => {
        if (!seleccionado) return;
        if (!window.confirm("¿Eliminar esta baja?")) return;
        setMensaje("Eliminando...");
        try {
            await fetch(`${API_URL}/${seleccionado.codbaja}`, { method: "DELETE" });
            setSeleccionado(null);
            setModo("");
            await cargarBajas();
        } catch {
            setMensaje("Error al eliminar.");
        }
    };

    const handleGuardar = async () => {
        if (!form.descbaja.trim()) {
            setMensaje("La descripción no puede estar vacía.");
            return;
        }
        setMensaje("Guardando...");
        try {
            if (modo === "nuevo") {
                await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ descbaja: form.descbaja }),
                });
            } else if (modo === "editar") {
                await fetch(`${API_URL}/${seleccionado.codbaja}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ descbaja: form.descbaja }),
                });
            }
            setModo("");
            setForm({ codbaja: "", descbaja: "" });
            setSeleccionado(null);
            await cargarBajas();
        } catch {
            setMensaje("Error al guardar.");
        }
    };

    const handleCancelar = () => {
        setModo("");
        setForm({ codbaja: "", descbaja: "" });
        setSeleccionado(null);
        setMensaje("Listo.");
    };

    return (
        <div className="baja-wrapper">
            <div className="baja-header">
                <span className="baja-header-icon">■</span>
                <span className="baja-header-title">Baja</span>
                <div className="baja-header-controls">
                    <span>–</span><span>□</span><span>✕</span>
                </div>
            </div>
            <div className="baja-container">
                <h2 className="baja-titulo">GESTIÓN DE BAJAS</h2>
                {(modo === "nuevo" || modo === "editar") && (
                    <div className="baja-form">
                        <div className="baja-form-row">
                            <label>DESCRIPCIÓN:</label>
                            <input
                                type="text"
                                value={form.descbaja}
                                onChange={(e) => setForm({ ...form, descbaja: e.target.value })}
                                placeholder="Ingrese descripción de baja"
                            />
                        </div>
                        <div className="baja-form-btns">
                            <button className="btn-vsiaf" onClick={handleGuardar}>Guardar</button>
                            <button className="btn-vsiaf" onClick={handleCancelar}>Cancelar</button>
                        </div>
                    </div>
                )}
                <div className="baja-tabla-wrapper">
                    <table className="baja-tabla">
                        <thead>
                        <tr>
                            <th>CÓD.</th>
                            <th>DESCRIPCIÓN DE BAJA</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bajas.length === 0 ? (
                            [...Array(8)].map((_, i) => (
                                <tr key={i}><td>&nbsp;</td><td>&nbsp;</td></tr>
                            ))
                        ) : (
                            bajas.map((b) => (
                                <tr
                                    key={b.codbaja}
                                    className={seleccionado?.codbaja === b.codbaja ? "fila-seleccionada" : ""}
                                    onClick={() => setSeleccionado(b)}
                                >
                                    <td>{b.codbaja}</td>
                                    <td>{b.descbaja}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="baja-botones">
                    <button className="btn-vsiaf" onClick={handleNuevo}>Nuevo</button>
                    <button className="btn-vsiaf" onClick={handleEditar} disabled={!seleccionado}>Editar</button>
                    <button className="btn-vsiaf" onClick={handleEliminar} disabled={!seleccionado}>Eliminar</button>
                    <button className="btn-vsiaf" onClick={() => window.history.back()}>Salir</button>
                </div>
                <div className="baja-status">🔄 {mensaje}</div>
            </div>
        </div>
    );
}

export default Baja;