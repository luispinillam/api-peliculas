import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./services/api";
import Generos from "./pages/Generos";
import Directores from "./pages/Directores";
import Productoras from "./pages/Productoras";
import Tipos from "./pages/Tipos";
import Media from "./pages/Media";

const modulos = [
  { nombre: "Géneros", ruta: "/generos", icono: "🎭" },
  { nombre: "Directores", ruta: "/directores", icono: "🎬" },
  { nombre: "Productoras", ruta: "/productoras", icono: "🏢" },
  { nombre: "Tipos", ruta: "/tipos", icono: "📺" },
  { nombre: "Media", ruta: "/media", icono: "🍿" }
];

function Inicio() {
  const [estadisticas, setEstadisticas] = useState({
    producciones: 0,
    peliculas: 0,
    series: 0,
    generos: 0
  });

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [mediaRes, generosRes] = await Promise.all([
          api.get("/media"),
          api.get("/generos")
        ]);

        const producciones = mediaRes.data;

        setEstadisticas({
          producciones: producciones.length,
          peliculas: producciones.filter(
            m => m.tipo?.toLowerCase() === "película"
          ).length,
          series: producciones.filter(
            m => m.tipo?.toLowerCase() === "serie"
          ).length,
          generos: generosRes.data.length
        });
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    cargarEstadisticas();
  }, []);

  const tarjetas = [
    {
      nombre: "Total de producciones",
      valor: estadisticas.producciones,
      icono: "🎬"
    },
    {
      nombre: "Películas",
      valor: estadisticas.peliculas,
      icono: "🎥"
    },
    {
      nombre: "Series",
      valor: estadisticas.series,
      icono: "📺"
    },
    {
      nombre: "Géneros registrados",
      valor: estadisticas.generos,
      icono: "🎭"
    }
  ];

  return (
    <div>
      <h2 className="fw-bold">Bienvenido a CineApp</h2>
      <p className="text-secondary">
        Administra tus películas y series desde una sola plataforma.
      </p>

      <div className="row g-3 mt-3 mb-4">
        {tarjetas.map((tarjeta, index) => (
          <div className="col-md-6 col-xl-3" key={index}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-secondary mb-2">
                      {tarjeta.nombre}
                    </p>
                    <h2 className="fw-bold mb-0">
                      {tarjeta.valor}
                    </h2>
                  </div>
                  <span className="fs-1">{tarjeta.icono}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h5 className="fw-bold mt-4 mb-3">Módulos de administración</h5>

      <div className="row g-3">
        {modulos.map((modulo) => (
          <div className="col-md-4" key={modulo.ruta}>
            <NavLink
              to={modulo.ruta}
              className="card h-100 text-decoration-none border-0 dashboard-card"
            >
              <div className="card-body p-4">
                <div className="fs-1 dashboard-icon">
                  {modulo.icono}
                </div>
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

function Aplicacion() {
  return (
    <BrowserRouter>
      <div className="d-flex min-vh-100">
        <aside className="sidebar p-3">
          <h4 className="fw-bold mb-1">🎬 CineApp</h4>
          <small className="text-secondary">Panel de administración</small>

          <hr className="border-secondary" />

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link text-white rounded p-3 mb-2 ${isActive ? "active-menu" : ""}`
            }
          >
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
          <nav className="navbar bg-white shadow-sm px-4 py-3 border-bottom">
            <span className="fw-bold text-dark">
              🎬 Sistema de gestión audiovisual
            </span>
            <span className="text-secondary">React + Node.js</span>
          </nav>

          <div className="container-fluid p-4">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/generos" element={<Generos />} />
              <Route path="/directores" element={<Directores />} />
              <Route path="/productoras" element={<Productoras />} />
              <Route path="/tipos" element={<Tipos />} />
              <Route path="/media" element={<Media />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default Aplicacion;