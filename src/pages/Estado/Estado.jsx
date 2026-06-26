import { useEffect, useState } from "react";
import {
  listarEstados,
  buscarEstadoPorId,
  guardarEstado,
  actualizarEstado,
  eliminarEstado,
} from "../../services/estadoService";
import "./estado.css";

function Estado() {
  const [estados, setEstados] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [idBuscar, setIdBuscar] = useState("");
  const [nomestado, setNomestado] = useState("");
  const [idEditar, setIdEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("");
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const cargarEstados = async () => {
  const datos = await listarEstados();
  setEstados(datos);
  setEstadoSeleccionado(null);
};

useEffect(() => {
  cargarEstados();
}, []);

  const buscarPorId = () => {
    if (idBuscar === "") { alert("Ingrese un código para buscar"); return; }
    const encontrado = estados.find((e) => e.codestado === parseInt(idBuscar));
    if (encontrado) { setEstados([encontrado]); setEstadoSeleccionado(encontrado); }
    else alert("No se encontró un estado con ese ID");
  };

  const nuevo = () => {
    setModoFormulario("nuevo");
    setIdEditar(null);
    setNomestado("");
    setMostrarFormulario(true);
  };

  const editarSeleccionado = () => {
    if (!estadoSeleccionado) { alert("Seleccione un estado"); return; }
    setModoFormulario("editar");
    setIdEditar(estadoSeleccionado.codestado);
    setNomestado(estadoSeleccionado.nomestado);
    setMostrarFormulario(true);
  };

  const guardar = async (e) => {
  e.preventDefault();
  if (nomestado.trim() === "") { alert("Ingrese el nombre del estado"); return; }
  try {
    if (modoFormulario === "nuevo") {
      await guardarEstado({ nomestado });
    } else {
      await actualizarEstado(idEditar, { codestado: idEditar, nomestado });
    }
    await cargarEstados();
    setMostrarFormulario(false);
    setNomestado("");
    setIdEditar(null);
  } catch (error) {
    alert("Error al guardar: " + error.message);
  }
};

  const eliminarSeleccionado = () => {
    if (!estadoSeleccionado) { alert("Seleccione un estado"); return; }
    setMostrarEliminar(true);
  };

  const confirmarEliminar = async () => {
  try {
    await eliminarEstado(estadoSeleccionado.codestado);
    await cargarEstados();
    setMostrarEliminar(false);
    setEstadoSeleccionado(null);
  } catch (error) {
    alert("Error al eliminar: " + error.message);
  }
};

  const seleccionarEstado = () => {
    if (!estadoSeleccionado) { alert("Seleccione un estado"); return; }
    alert("Estado seleccionado: " + estadoSeleccionado.codestado + " - " + estadoSeleccionado.nomestado);
  };

  const salir = () => alert("Saliendo de la administración de Estado");

  return (
    <div className="estado-page">
      <div className="estado-ventana">

        <div className="estado-titlebar">
          <span className="estado-titlebar-icon">▦</span>
          Estado
          <div className="titlebar-botones">
            <button className="titlebar-btn">─</button>
            <button className="titlebar-btn">□</button>
            <button className="titlebar-btn">✕</button>
          </div>
        </div>

        <div className="tabla-contenedor">
          <table className="estado-tabla">
            <thead>
              <tr>
                <th className="fila-indicador"></th>
                <th className="col-codigo">Codestado</th>
                <th className="col-nombre">Nomestado</th>
              </tr>
            </thead>
            <tbody>
              {estados.map((estado) => (
                <tr
                  key={estado.codestado}
                  onClick={() => setEstadoSeleccionado(estado)}
                  className={estadoSeleccionado?.codestado === estado.codestado ? "fila-seleccionada" : ""}
                >
                  <td className="fila-indicador">
                    {estadoSeleccionado?.codestado === estado.codestado ? "▶" : ""}
                  </td>
                  <td>{estado.codestado}</td>
                  <td>{estado.nomestado}</td>
                </tr>
              ))}
              {Array.from({ length: 50 }).map((_, i) => (
                <tr key={`vacio-${i}`} className="filas-vacias">
                  <td></td><td></td><td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="botones-panel">
          <button type="button" onClick={nuevo}>Nuevo</button>
          <button type="button" onClick={editarSeleccionado}>Editar</button>
          <button type="button" onClick={eliminarSeleccionado}>Eliminar</button>
          <button type="button" onClick={seleccionarEstado}>Seleccionar</button>
          <button type="button" onClick={salir}>Salir</button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="modal-fondo">
          <div className="modal-caja">
            <div className="modal-header">
              {modoFormulario === "nuevo" ? "NUEVO ESTADO" : "EDITAR ESTADO"}
            </div>
            <form onSubmit={guardar} className="modal-formulario">
              <label>Nombre del estado:</label>
              <input
                type="text"
                placeholder="Ingrese nombre"
                value={nomestado}
                onChange={(e) => setNomestado(e.target.value)}
                autoFocus
              />
              <div className="modal-botones">
                <button type="submit">{modoFormulario === "nuevo" ? "Guardar" : "Actualizar"}</button>
                <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarEliminar && (
        <div className="modal-fondo">
          <div className="modal-caja">
            <div className="modal-header">ELIMINAR ESTADO</div>
            <p className="modal-texto">¿Eliminar <b>{estadoSeleccionado?.nomestado}</b>?</p>
            <div className="modal-botones">
              <button type="button" onClick={confirmarEliminar}>Sí, eliminar</button>
              <button type="button" onClick={() => setMostrarEliminar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estado;