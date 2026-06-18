import { Link } from "react-router-dom";

function NavBar() {
    return (
      <nav className="top-nav">
        <Link to="/">Home</Link> | {" "}
        <Link to="/entidad">Entidad</Link> | {" "}
        <Link to="/about">About</Link>
      </nav>
    );
}

export default NavBar;