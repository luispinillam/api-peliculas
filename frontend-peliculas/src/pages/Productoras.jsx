import { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Productoras() {
  const [productoras, setProductoras] = useState([]);
  const [nombre, setNombre] = useState("");
  const [slogan, setSlogan] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [editando, setEditando] = useState(null);

  const cargarProductoras = async () => {
    try {
      const respuesta = await api.get("/productoras");
      setProductoras(respuesta.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las productoras.", "error");
    }
  };

  useEffect(() => {
    cargarProductoras();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setSlogan("");
    setDescripcion("");
    setEstado("Activo");
    setEditando(null);
  };

  const guardarProductora = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Swal.fire("Atención", "Debes ingresar el nombre de la productora.", "warning");
      return;
    }

    try {
      if (editando !== null) {
        await api.put(`/productoras/${editando}`, {
          nombre,
          slogan,
          descripcion,
          estado
        });

        Swal.fire("Actualizada", "Productora actualizada correctamente.", "success");
      } else {
        await api.post("/productoras", {
          nombre,
          slogan,
          descripcion
        });

        Swal.fire("Registrada", "Productora registrada correctamente.", "success");
      }

      limpiarFormulario();
      cargarProductoras();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No fue posible guardar la productora.", "error");
    }
  };

  const editarProductora = (productora) => {
    setEditando(productora.id);
    setNombre(productora.nombre);
    setSlogan(productora.slogan || "");
    setDescripcion(productora.descripcion || "");
    setEstado(productora.estado || "Activo");
  };

  const eliminarProductora = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar productora?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (resultado.isConfirmed) {
      try {
        await api.delete(`/productoras/${id}`);

        Swal.fire("Eliminada", "Productora eliminada correctamente.", "success");
        cargarProductoras();

      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No fue posible eliminar la productora.", "error");
      }
    }
  };

  return (
    <div>
      <h2 className="fw-bold">Gestión de Productoras</h2>
      <p className="text-secondary">
        Registra y administra las productoras de películas y series.
      </p>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            {editando !== null ? "Editar productora" : "Registrar nueva productora"}
          </h5>

          <form onSubmit={guardarProductora}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ejemplo: Warner Bros."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Slogan</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Lema de la productora"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descripción de la productora"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
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
                {editando !== null ? "Guardar cambios" : "Registrar productora"}
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
          <h5 className="fw-bold mb-3">Productoras registradas</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Slogan</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productoras.length > 0 ? (
                  productoras.map((productora) => (
                    <tr key={productora.id}>
                      <td>{productora.id}</td>
                      <td>{productora.nombre}</td>
                      <td>{productora.slogan || "—"}</td>
                      <td>{productora.descripcion || "—"}</td>
                      <td>
                        <span className={`badge ${
                          productora.estado === "Inactivo"
                            ? "bg-secondary"
                            : "bg-success"
                        }`}>
                          {productora.estado || "Activo"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => editarProductora(productora)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarProductora(productora.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-secondary py-4">
                      No hay productoras registradas.
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

export default Productoras;