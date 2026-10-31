const express = require("express");
const router = express.Router();
const conexion = require("../config/database");

// Consultar todas las producciones
router.get("/", async (req, res) => {
    try {
        const [media] = await conexion.query(`
            SELECT 
                m.*,
                g.nombre AS genero,
                d.nombres AS director,
                p.nombre AS productora,
                t.nombre AS tipo
            FROM media m
            INNER JOIN generos g ON m.genero_id = g.id
            INNER JOIN directores d ON m.director_id = d.id
            INNER JOIN productoras p ON m.productora_id = p.id
            INNER JOIN tipos t ON m.tipo_id = t.id
        `);

        res.json(media);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al consultar las producciones",
            error: error.message
        });
    }
});

// Registrar una producción
router.post("/", async (req, res) => {
    try {
        const {
            serial,
            titulo,
            sinopsis,
            url,
            imagen,
            anio_lanzamiento,
            genero_id,
            director_id,
            productora_id,
            tipo_id
        } = req.body;

        if (
            !serial || !titulo || !url ||
            !anio_lanzamiento || !genero_id ||
            !director_id || !productora_id || !tipo_id
        ) {
            return res.status(400).json({
                mensaje: "Faltan campos obligatorios para registrar la producción"
            });
        }

        // Verificar que género, director y productora estén activos
        const [generos] = await conexion.query(
            "SELECT id FROM generos WHERE id = ? AND estado = 'Activo'",
            [genero_id]
        );

        const [directores] = await conexion.query(
            "SELECT id FROM directores WHERE id = ? AND estado = 'Activo'",
            [director_id]
        );

        const [productoras] = await conexion.query(
            "SELECT id FROM productoras WHERE id = ? AND estado = 'Activo'",
            [productora_id]
        );

        if (!generos.length || !directores.length || !productoras.length) {
            return res.status(400).json({
                mensaje: "El género, director y productora deben existir y estar activos"
            });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO media
            (serial, titulo, sinopsis, url, imagen, anio_lanzamiento,
            genero_id, director_id, productora_id, tipo_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                serial,
                titulo,
                sinopsis || null,
                url,
                imagen || null,
                anio_lanzamiento,
                genero_id,
                director_id,
                productora_id,
                tipo_id
            ]
        );

        res.status(201).json({
            mensaje: "Producción registrada correctamente",
            id: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar la producción",
            error: error.message
        });
    }
});

// Actualizar una producción
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            serial,
            titulo,
            sinopsis,
            url,
            imagen,
            anio_lanzamiento,
            genero_id,
            director_id,
            productora_id,
            tipo_id
        } = req.body;

        if (
            !serial || !titulo || !url ||
            !anio_lanzamiento || !genero_id ||
            !director_id || !productora_id || !tipo_id
        ) {
            return res.status(400).json({
                mensaje: "Faltan campos obligatorios para actualizar la producción"
            });
        }

        // Verificar que el género, director y productora estén activos
        const [generos] = await conexion.query(
            "SELECT id FROM generos WHERE id = ? AND estado = 'Activo'",
            [genero_id]
        );

        const [directores] = await conexion.query(
            "SELECT id FROM directores WHERE id = ? AND estado = 'Activo'",
            [director_id]
        );

        const [productoras] = await conexion.query(
            "SELECT id FROM productoras WHERE id = ? AND estado = 'Activo'",
            [productora_id]
        );

        if (!generos.length || !directores.length || !productoras.length) {
            return res.status(400).json({
                mensaje: "El género, director y productora deben existir y estar activos"
            });
        }

        // Actualizar la producción
        const [resultado] = await conexion.query(
            `UPDATE media SET
                serial = ?,
                titulo = ?,
                sinopsis = ?,
                url = ?,
                imagen = ?,
                anio_lanzamiento = ?,
                genero_id = ?,
                director_id = ?,
                productora_id = ?,
                tipo_id = ?
            WHERE id = ?`,
            [
                serial,
                titulo,
                sinopsis || null,
                url,
                imagen || null,
                anio_lanzamiento,
                genero_id,
                director_id,
                productora_id,
                tipo_id,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producción no encontrada"
            });
        }

        res.json({
            mensaje: "Producción actualizada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la producción",
            error: error.message
        });
    }
});

// Eliminar una producción
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            "DELETE FROM media WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producción no encontrada"
            });
        }

        res.json({
            mensaje: "Producción eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la producción",
            error: error.message
        });
    }
});

module.exports = router;