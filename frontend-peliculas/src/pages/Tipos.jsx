import { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Tipos() {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarTipos = async () => {
    try {
      const respuesta = await api.get("/tipos");
      setTipos(respuesta.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los tipos.", "error");
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setEditando(null);
  };

  const guardarTipo = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Swal.fire("Atención", "Debes ingresar el nombre del tipo.", "warning");
      return;
    }

    try {
      if (editando !== null) {
        await api.put(`/tipos/${editando}`, {
          nombre,
          descripcion
        });

        Swal.fire("Actualizado", "Tipo actualizado correctamente.", "success");
      } else {
        await api.post("/tipos", {
          nombre,
          descripcion
        });

        Swal.fire("Registrado", "Tipo registrado correctamente.", "success");
      }

      limpiarFormulario();
      cargarTipos();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No fue posible guardar el tipo.", "error");
    }
  };

  const editarTipo = (tipo) => {
    setEditando(tipo.id);
    setNombre(tipo.nombre);
    setDescripcion(tipo.descripcion || "");
  };

  const eliminarTipo = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar tipo?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (resultado.isConfirmed) {
      try {
        await api.delete(`/tipos/${id}`);

        Swal.fire("Eliminado", "Tipo eliminado correctamente.", "success");
        cargarTipos();

      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No fue posible eliminar el tipo.", "error");
      }
    }
  };

  return (
    <div>
      <h2 className="fw-bold">Gestión de Tipos</h2>
      <p className="text-secondary">
        Registra y administra los tipos de producciones audiovisuales.
      </p>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            {editando !== null ? "Editar tipo" : "Registrar nuevo tipo"}
          </h5>

          <form onSubmit={guardarTipo}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Nombre del tipo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ejemplo: Película"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-7">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descripción del tipo"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editando !== null ? "Guardar cambios" : "Registrar tipo"}
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
          <h5 className="fw-bold mb-3">Tipos registrados</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {tipos.length > 0 ? (
                  tipos.map((tipo) => (
                    <tr key={tipo.id}>
                      <td>{tipo.id}</td>
                      <td>{tipo.nombre}</td>
                      <td>{tipo.descripcion || "—"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => editarTipo(tipo)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarTipo(tipo.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary py-4">
                      No hay tipos registrados.
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

export default Tipos;