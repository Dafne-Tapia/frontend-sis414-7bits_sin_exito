import { useState } from "react";
import UnidadAdmin from "./UnidadAdmin";
import "./Home.css";

function Home() {
  const [mostrarUnidadAdmin, setMostrarUnidadAdmin] = useState(false);

  if (mostrarUnidadAdmin) {
    return <UnidadAdmin />;
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>V.S.I.A.F</h1>
        <p className="home-subtitle">Sistema de Activos Fijos</p>
      </div>

      <div className="home-cards">
        <div className="home-card">
          <h2>Entidad</h2>
          <p>Gestión de entidades del sistema de activos fijos.</p>
        </div>

        <div className="home-card">
          <h2>Objeto de Gasto</h2>
          <p>Administración de objetos de gasto.</p>
        </div>

        <div
          className="home-card"
          onClick={() => setMostrarUnidadAdmin(true)}
        >
          <h2>Unidad Administrativa</h2>
          <p>Gestión de unidades administrativas.</p>
        </div>

        <div className="home-card">
          <h2>Mes</h2>
          <p>Control de meses del sistema.</p>
        </div>

        <div className="home-card">
          <h2>Estado</h2>
          <p>Gestión de estados de activos.</p>
        </div>

        <div className="home-card">
          <h2>Baja</h2>
          <p>Registro de bajas de activos.</p>
        </div>

        <div className="home-card">
          <h2>Cta Par</h2>
          <p>Gestión de cuentas par.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;