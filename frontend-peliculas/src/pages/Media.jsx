import { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Media() {
  const [medias, setMedias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [formulario, setFormulario] = useState({
    serial: "",
    titulo: "",
    sinopsis: "",
    url: "",
    imagen: "",
    anio_lanzamiento: "",
    genero_id: "",
    director_id: "",
    productora_id: "",
    tipo_id: ""
  });

  const [editando, setEditando] = useState(null);

  const cargarDatos = async () => {
    try {
      const [respuestaMedia, respuestaGeneros, respuestaDirectores,
        respuestaProductoras, respuestaTipos] = await Promise.all([
        api.get("/media"),
        api.get("/generos"),
        api.get("/directores"),
        api.get("/productoras"),
        api.get("/tipos")
      ]);

      setMedias(respuestaMedia.data);
      setGeneros(respuestaGeneros.data.filter(g => g.estado === "Activo"));
      setDirectores(respuestaDirectores.data.filter(d => d.estado === "Activo"));
      setProductoras(respuestaProductoras.data.filter(p => p.estado === "Activo"));
      setTipos(respuestaTipos.data);

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los datos. Verifica la API.", "error");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setFormulario({
      serial: "",
      titulo: "",
      sinopsis: "",
      url: "",
      imagen: "",
      anio_lanzamiento: "",
      genero_id: "",
      director_id: "",
      productora_id: "",
      tipo_id: ""
    });

    setEditando(null);
  };

  const cambiarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const guardarMedia = async (e) => {
    e.preventDefault();

    const datos = {
      ...formulario,
      anio_lanzamiento: Number(formulario.anio_lanzamiento),
      genero_id: Number(formulario.genero_id),
      director_id: Number(formulario.director_id),
      productora_id: Number(formulario.productora_id),
      tipo_id: Number(formulario.tipo_id)
    };

    try {
      if (editando !== null) {
        await api.put(`/media/${editando}`, datos);
        Swal.fire("Actualizada", "Producción actualizada correctamente.", "success");
      } else {
        await api.post("/media", datos);
        Swal.fire("Registrada", "Producción registrada correctamente.", "success");
      }

      limpiarFormulario();
      cargarDatos();

    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error.response?.data?.mensaje || "No fue posible guardar la producción.",
        "error"
      );
    }
  };

  const editarMedia = (media) => {
    setEditando(media.id);

    setFormulario({
      serial: media.serial || "",
      titulo: media.titulo || "",
      sinopsis: media.sinopsis || "",
      url: media.url || "",
      imagen: media.imagen || "",
      anio_lanzamiento: media.anio_lanzamiento || "",
      genero_id: String(media.genero_id || ""),
      director_id: String(media.director_id || ""),
      productora_id: String(media.productora_id || ""),
      tipo_id: String(media.tipo_id || "")
    });
  };

  const eliminarMedia = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar producción?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (resultado.isConfirmed) {
      try {
        await api.delete(`/media/${id}`);
        Swal.fire("Eliminada", "Producción eliminada correctamente.", "success");
        cargarDatos();

      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No fue posible eliminar la producción.", "error");
      }
    }
  };

  return (
    <div>
      <h2 className="fw-bold">Gestión de Películas y Series</h2>
      <p className="text-secondary">
        Registra y administra las producciones audiovisuales.
      </p>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            {editando !== null ? "Editar producción" : "Registrar nueva producción"}
          </h5>

          <form onSubmit={guardarMedia}>
            <div className="row g-3">

              <div className="col-md-3">
                <label className="form-label">Serial</label>
                <input
                  type="text"
                  name="serial"
                  className="form-control"
                  placeholder="Ejemplo: PEL-003"
                  value={formulario.serial}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  name="titulo"
                  className="form-control"
                  placeholder="Nombre de la producción"
                  value={formulario.titulo}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Año de lanzamiento</label>
                <input
                  type="number"
                  name="anio_lanzamiento"
                  className="form-control"
                  placeholder="2026"
                  min="1888"
                  max="2100"
                  value={formulario.anio_lanzamiento}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Sinopsis</label>
                <textarea
                  name="sinopsis"
                  className="form-control"
                  rows="2"
                  placeholder="Resumen de la película o serie"
                  value={formulario.sinopsis}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">URL</label>
                <input
                  type="url"
                  name="url"
                  className="form-control"
                  placeholder="https://ejemplo.com"
                  value={formulario.url}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">URL de la imagen</label>
                <input
                  type="url"
                  name="imagen"
                  className="form-control"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formulario.imagen}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Género</label>
                <select
                  name="genero_id"
                  className="form-select"
                  value={formulario.genero_id}
                  onChange={cambiarCampo}
                  required
                >
                  <option value="">Seleccionar género</option>
                  {generos.map(g => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Director</label>
                <select
                  name="director_id"
                  className="form-select"
                  value={formulario.director_id}
                  onChange={cambiarCampo}
                  required
                >
                  <option value="">Seleccionar director</option>
                  {directores.map(d => (
                    <option key={d.id} value={d.id}>{d.nombres}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Productora</label>
                <select
                  name="productora_id"
                  className="form-select"
                  value={formulario.productora_id}
                  onChange={cambiarCampo}
                  required
                >
                  <option value="">Seleccionar productora</option>
                  {productoras.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Tipo</label>
                <select
                  name="tipo_id"
                  className="form-select"
                  value={formulario.tipo_id}
                  onChange={cambiarCampo}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {tipos.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editando !== null ? "Guardar cambios" : "Registrar producción"}
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
          <h5 className="fw-bold mb-3">Producciones registradas</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
  <thead className="table-dark">
    <tr>
      <th>ID</th>
      <th>Serial</th>
      <th>Carátula</th>
      <th>Título</th>
      <th>Año</th>
      <th>Género</th>
      <th>Director</th>
      <th>Productora</th>
      <th>Tipo</th>
      <th>Acciones</th>
    </tr>
  </thead>

  <tbody>
    {medias.length > 0 ? (
      medias.map(media => (
        <tr key={media.id}>
          <td>{media.id}</td>
          <td>{media.serial}</td>
          <td>
            {media.imagen ? (
              <img
                src={media.imagen}
                alt={media.titulo}
                className="media-poster"
              />
            ) : (
              <span className="text-secondary">Sin imagen</span>
            )}
          </td>
          <td className="fw-semibold">{media.titulo}</td>
          <td>{media.anio_lanzamiento}</td>
          <td>{media.genero}</td>
          <td>{media.director}</td>
          <td>{media.productora}</td>
          <td>{media.tipo}</td>
          <td>
            <button
              className="btn btn-sm btn-warning me-2 mb-1"
              onClick={() => editarMedia(media)}
            >
              Editar
            </button>

            <button
              className="btn btn-sm btn-danger mb-1"
              onClick={() => eliminarMedia(media.id)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="10" className="text-center text-secondary py-4">
          No hay producciones registradas.
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

export default Media;