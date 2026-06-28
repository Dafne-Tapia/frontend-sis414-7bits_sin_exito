import { useEffect, useState } from "react";
import "./Baja.css";

const API_URL = "https://proyectosis414-g-7bitssinexito-rwry.onrender.com/bajas";

function Baja() {
    const [bajas, setBajas] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [form, setForm] = useState({ codbaja: "", descbaja: "" });
    const [modo, setModo] = useState("");
    const [mensaje, setMensaje] = useState("Listo.");
    const [mensajeTipo, setMensajeTipo] = useState("info");

    const cargarBajas = async (mensajeExito = "Listo.", mensajeError = "Error al cargar datos.") => {
        setMensaje("Cargando bajas...");
        setMensajeTipo("info");

        try {
            const res = await fetch(API_URL);
            if (!res.ok) {
                setBajas([]);
                setMensaje(`${mensajeError} (HTTP ${res.status})`);
                setMensajeTipo("error");
                return false;
            }

            const data = await res.json();
            setBajas(Array.isArray(data) ? data : []);
            setMensaje(mensajeExito);
            setMensajeTipo("success");
            return true;
        } catch {
            setBajas([]);
            setMensaje(mensajeError);
            setMensajeTipo("error");
            return false;
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void cargarBajas();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const handleNuevo = () => {
        setForm({ codbaja: "", descbaja: "" });
        setSeleccionado(null);
        setModo("nuevo");
        setMensaje("Escribe el codigo y la descripcion.");
        setMensajeTipo("info");
    };

    const handleEditar = () => {
        if (!seleccionado) return;

        setForm({
            codbaja: seleccionado.codbaja ?? "",
            descbaja: seleccionado.descbaja ?? "",
        });
        setModo("editar");
        setMensaje("Edita la descripcion y guarda los cambios.");
        setMensajeTipo("info");
    };

    const handleEliminar = async () => {
        if (!seleccionado) return;
        if (!window.confirm("Eliminar esta baja?")) return;

        setMensaje("Eliminando baja...");
        setMensajeTipo("info");

        try {
            const res = await fetch(`${API_URL}/${seleccionado.codbaja}`, { method: "DELETE" });
            if (!res.ok) {
                setMensaje(`No se pudo eliminar la baja. (HTTP ${res.status})`);
                setMensajeTipo("error");
                return;
            }

            setSeleccionado(null);
            setModo("");
            setForm({ codbaja: "", descbaja: "" });
            await cargarBajas("Baja eliminada correctamente.");
        } catch {
            setMensaje("No se pudo eliminar la baja.");
            setMensajeTipo("error");
        }
    };

    const handleGuardar = async () => {
        const codbaja = String(form.codbaja).trim();
        const descbaja = String(form.descbaja).trim();

        if (modo === "nuevo" && !codbaja) {
            setMensaje("El codigo no puede estar vacio.");
            setMensajeTipo("error");
            return;
        }

        if (!descbaja) {
            setMensaje("La descripcion no puede estar vacia.");
            setMensajeTipo("error");
            return;
        }

        setMensaje("Guardando baja...");
        setMensajeTipo("info");

        try {
            const url = modo === "editar" && seleccionado
                ? `${API_URL}/${seleccionado.codbaja}`
                : API_URL;
            const method = modo === "editar" ? "PUT" : "POST";

            const payload = { descbaja };
            if (modo === "nuevo") {
                payload.codbaja = codbaja;
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                setMensaje(`No se pudo guardar la baja. (HTTP ${res.status})`);
                setMensajeTipo("error");
                return;
            }

            setModo("");
            setForm({ codbaja: "", descbaja: "" });
            setSeleccionado(null);
            await cargarBajas("Baja guardada correctamente.");
        } catch {
            setMensaje("No se pudo guardar la baja.");
            setMensajeTipo("error");
        }
    };

    const handleCancelar = () => {
        setModo("");
        setForm({ codbaja: "", descbaja: "" });
        setSeleccionado(null);
        setMensaje("Listo.");
        setMensajeTipo("info");
    };

    const mostrarFormulario = modo === "nuevo" || modo === "editar";

    return (
        <div className="baja-wrapper">
            <div className="baja-brand-bar">
                <div className="baja-brand-mark" aria-hidden="true">
                    <span className="mark-red" />
                    <span className="mark-yellow" />
                    <span className="mark-green" />
                    <span className="mark-white" />
                </div>
                <div className="baja-brand-copy">
                    <div className="baja-brand-title">V.S.I.A.F</div>
                    <div className="baja-brand-subtitle">Sistema de Activos Fijos</div>
                </div>
            </div>
            <div className="baja-header">
                <span className="baja-header-icon">#</span>
                <span className="baja-header-title">Baja</span>
                <div className="baja-header-controls" aria-hidden="true">
                    <span>-</span>
                    <span>[]</span>
                    <span>x</span>
                </div>
            </div>
            <div className="baja-container">
                <h2 className="baja-titulo">GESTION DE BAJAS</h2>
                {mostrarFormulario && (
                    <div className="baja-form">
                        <div className="baja-form-row">
                            <label>CODIGO:</label>
                            <input
                                type="text"
                                value={form.codbaja}
                                onChange={(e) => setForm({ ...form, codbaja: e.target.value })}
                                placeholder="Ingrese codigo de baja"
                                readOnly={modo === "editar"}
                            />
                        </div>
                        <div className="baja-form-row">
                            <label>DESCRIPCION:</label>
                            <input
                                type="text"
                                value={form.descbaja}
                                onChange={(e) => setForm({ ...form, descbaja: e.target.value })}
                                placeholder="Ingrese descripcion de baja"
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
                                <th>COD.</th>
                                <th>DESCRIPCION DE BAJA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bajas.length === 0 ? (
                                <tr className="baja-empty-row">
                                    <td colSpan="2">No hay bajas registradas.</td>
                                </tr>
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

                <div className={`baja-status baja-status-${mensajeTipo}`}>
                    <span className="baja-status-dot">*</span>
                    <span>{mensaje}</span>
                </div>
            </div>
            <div className="baja-footer" aria-hidden="true">
                <div className="baja-footer-text">
                    <div>VSIAF version 2.0</div>
                    <div>Copyright © 1999-2012 DGSGIF</div>
                    <div>Todos los derechos reservados</div>
                </div>
            </div>
        </div>
    );
}

export default Baja;
