import "./UnidadAdmin.css";

function UnidadAdmin() {
  return (
    <div className="unidad-admin-page">
      <h1>Administrar Unidad Administrativa</h1>

      <div className="unidad-admin-card">
        <h2>Unidad Administrativa</h2>

        <form>
          <input type="text" placeholder="Entidad" />
          <input type="text" placeholder="Unidad" />
          <input type="text" placeholder="Descripción" />
          <input type="text" placeholder="Ciudad" />

          <button type="button">Guardar</button>
        </form>
      </div>
    </div>
  );
}

export default UnidadAdmin;