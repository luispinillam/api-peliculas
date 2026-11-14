import { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Generos() {
  const [generos, setGeneros] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [editando, setEditando] = useState(null);

  // Consultar géneros
  const cargarGeneros = async () => {
    try {
      const respuesta = await api.get("/generos");
      setGeneros(respuesta.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los géneros. Verifica que la API esté funcionando.", "error");
    }
  };

  useEffect(() => {
    cargarGeneros();
  }, []);

  // Limpiar formulario
  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setEstado("Activo");
    setEditando(null);
  };

  // Registrar o actualizar
  const guardarGenero = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Swal.fire("Atención", "Debes ingresar el nombre del género.", "warning");
      return;
    }

    try {
      if (editando !== null) {
        await api.put(`/generos/${editando}`, {
          nombre,
          estado,
          descripcion
        });

        Swal.fire("Actualizado", "Género actualizado correctamente.", "success");
      } else {
        await api.post("/generos", {
          nombre,
          descripcion
        });

        Swal.fire("Registrado", "Género registrado correctamente.", "success");
      }

      limpiarFormulario();
      cargarGeneros();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No fue posible guardar el género.", "error");
    }
  };

  // Preparar edición
  const editarGenero = (genero) => {
    setEditando(genero.id);
    setNombre(genero.nombre);
    setDescripcion(genero.descripcion || "");
    setEstado(genero.estado || "Activo");
  };

  // Eliminar género
  const eliminarGenero = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar género?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (resultado.isConfirmed) {
      try {
        await api.delete(`/generos/${id}`);

        Swal.fire("Eliminado", "Género eliminado correctamente.", "success");
        cargarGeneros();

      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No fue posible eliminar el género.", "error");
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Gestión de Géneros</h2>
          <p className="text-secondary">
            Registra y administra los géneros de películas y series.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            {editando !== null ? "Editar género" : "Registrar nuevo género"}
          </h5>

          <form onSubmit={guardarGenero}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Nombre del género</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ejemplo: Ciencia ficción"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-5">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descripción del género"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              {editando !== null && (
                <div className="col-md-2">
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
                {editando !== null ? "Guardar cambios" : "Registrar género"}
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

      {/* Tabla */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Géneros registrados</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {generos.length > 0 ? (
                  generos.map((genero) => (
                    <tr key={genero.id}>
                      <td>{genero.id}</td>
                      <td>{genero.nombre}</td>
                      <td>{genero.descripcion}</td>
                      <td>
                        <span className={`badge ${genero.estado === "Inactivo" ? "bg-secondary" : "bg-success"}`}>
                          {genero.estado || "Activo"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => editarGenero(genero)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarGenero(genero.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-secondary py-4">
                      No hay géneros registrados.
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

export default Generos;