import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

const modulos = [
  { nombre: "Géneros", ruta: "/generos", icono: "🎭" },
  { nombre: "Directores", ruta: "/directores", icono: "🎬" },
  { nombre: "Productoras", ruta: "/productoras", icono: "🏢" },
  { nombre: "Tipos", ruta: "/tipos", icono: "📺" },
  { nombre: "Media", ruta: "/media", icono: "🍿" }
];

function Inicio() {
  return (
    <div>
      <h2 className="fw-bold">Bienvenido a Películas & Series</h2>
      <p className="text-secondary">
        Administra tus películas y series desde una sola plataforma.
      </p>

      <div className="row g-3 mt-3">
        {modulos.map((modulo) => (
          <div className="col-md-4" key={modulo.ruta}>
            <NavLink
              to={modulo.ruta}
              className="card h-100 text-decoration-none shadow-sm border-0"
            >
              <div className="card-body p-4">
                <div className="fs-1">{modulo.icono}</div>
                <h5 className="fw-bold text-dark mt-3">
                  {modulo.nombre}
                </h5>
                <p className="text-secondary mb-0">
                  Administrar {modulo.nombre.toLowerCase()}
                </p>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

function Modulo({ nombre }) {
  return (
    <div className="card border-0 shadow-sm p-4">
      <h2 className="fw-bold">{nombre}</h2>
      <p className="text-secondary mb-0">
        En esta sección construiremos las funciones para administrar {nombre.toLowerCase()}.
      </p>
    </div>
  );
}

function Aplicacion() {
  return (
    <BrowserRouter>
      <div className="d-flex min-vh-100">
        <aside className="sidebar bg-dark text-white p-3">
          <h4 className="fw-bold mb-1">🎬 CineApp</h4>
          <small className="text-secondary">Panel de administración</small>

          <hr className="border-secondary" />

          <NavLink to="/" end className={({ isActive }) =>
            `nav-link text-white rounded p-3 mb-2 ${isActive ? "active-menu" : ""}`
          }>
            🏠 Inicio
          </NavLink>

          <p className="text-secondary small mt-4 mb-2">
            ADMINISTRACIÓN
          </p>

          {modulos.map((modulo) => (
            <NavLink
              key={modulo.ruta}
              to={modulo.ruta}
              className={({ isActive }) =>
                `nav-link text-white rounded p-3 mb-2 ${isActive ? "active-menu" : ""}`
              }
            >
              {modulo.icono} {modulo.nombre}
            </NavLink>
          ))}
        </aside>

        <main className="flex-grow-1">
          <nav className="navbar bg-white shadow-sm px-4 py-3">
            <span className="fw-semibold">Sistema de gestión audiovisual</span>
            <span className="text-secondary">React + Node.js</span>
          </nav>

          <div className="container-fluid p-4">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/generos" element={<Modulo nombre="Géneros" />} />
              <Route path="/directores" element={<Modulo nombre="Directores" />} />
              <Route path="/productoras" element={<Modulo nombre="Productoras" />} />
              <Route path="/tipos" element={<Modulo nombre="Tipos" />} />
              <Route path="/media" element={<Modulo nombre="Media (Películas y series)" />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default Aplicacion;