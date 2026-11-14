import { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Directores() {
  const [directores, setDirectores] = useState([]);
  const [nombres, setNombres] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [editando, setEditando] = useState(null);

  const cargarDirectores = async () => {
    try {
      const respuesta = await api.get("/directores");
      setDirectores(respuesta.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los directores.", "error");
    }
  };

  useEffect(() => {
    cargarDirectores();
  }, []);

  const limpiarFormulario = () => {
    setNombres("");
    setEstado("Activo");
    setEditando(null);
  };

  const guardarDirector = async (e) => {
    e.preventDefault();

    if (!nombres.trim()) {
      Swal.fire("Atención", "Debes ingresar el nombre del director.", "warning");
      return;
    }

    try {
      if (editando !== null) {
        await api.put(`/directores/${editando}`, {
          nombres,
          estado
        });

        Swal.fire("Actualizado", "Director actualizado correctamente.", "success");
      } else {
        await api.post("/directores", { nombres });

        Swal.fire("Registrado", "Director registrado correctamente.", "success");
      }

      limpiarFormulario();
      cargarDirectores();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No fue posible guardar el director.", "error");
    }
  };

  const editarDirector = (director) => {
    setEditando(director.id);
    setNombres(director.nombres);
    setEstado(director.estado || "Activo");
  };

  const eliminarDirector = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar director?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (resultado.isConfirmed) {
      try {
        await api.delete(`/directores/${id}`);

        Swal.fire("Eliminado", "Director eliminado correctamente.", "success");
        cargarDirectores();

      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No fue posible eliminar el director.", "error");
      }
    }
  };

  return (
    <div>
      <h2 className="fw-bold">Gestión de Directores</h2>
      <p className="text-secondary">
        Registra y administra los directores de películas y series.
      </p>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            {editando !== null ? "Editar director" : "Registrar nuevo director"}
          </h5>

          <form onSubmit={guardarDirector}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Nombre del director</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ejemplo: Christopher Nolan"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  required
                />
              </div>

              {editando !== null && (
                <div className="col-md-4">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editando !== null ? "Guardar cambios" : "Registrar director"}
              </button>

              {editando !== null && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Directores registrados</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {directores.length > 0 ? (
                  directores.map((director) => (
                    <tr key={director.id}>
                      <td>{director.id}</td>
                      <td>{director.nombres}</td>
                      <td>
                        <span className={`badge ${
                          director.estado === "Inactivo"
                            ? "bg-secondary"
                            : "bg-success"
                        }`}>
                          {director.estado || "Activo"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => editarDirector(director)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarDirector(director.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary py-4">
                      No hay directores registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Directores;