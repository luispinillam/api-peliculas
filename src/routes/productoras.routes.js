const express = require("express");
const router = express.Router();
const conexion = require("../config/database");

// Consultar todas las productoras
router.get("/", async (req, res) => {
    try {
        const [productoras] = await conexion.query(
            "SELECT * FROM productoras"
        );

        res.json(productoras);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al consultar las productoras",
            error: error.message
        });
    }
});

// Registrar una productora
router.post("/", async (req, res) => {
    try {
        const { nombre, slogan, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre de la productora es obligatorio"
            });
        }

        const [resultado] = await conexion.query(
            "INSERT INTO productoras (nombre, slogan, descripcion) VALUES (?, ?, ?)",
            [nombre, slogan || null, descripcion || null]
        );

        res.status(201).json({
            mensaje: "Productora registrada correctamente",
            id: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar la productora",
            error: error.message
        });
    }
});

// Actualizar una productora
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado, slogan, descripcion } = req.body;

        if (!nombre || !estado) {
            return res.status(400).json({
                mensaje: "El nombre y el estado son obligatorios"
            });
        }

        const [resultado] = await conexion.query(
            `UPDATE productoras
             SET nombre = ?, estado = ?, slogan = ?, descripcion = ?
             WHERE id = ?`,
            [nombre, estado, slogan || null, descripcion || null, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Productora no encontrada"
            });
        }

        res.json({
            mensaje: "Productora actualizada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la productora",
            error: error.message
        });
    }
});

// Eliminar una productora
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            "DELETE FROM productoras WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Productora no encontrada"
            });
        }

        res.json({
            mensaje: "Productora eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la productora",
            error: error.message
        });
    }
});

module.exports = router;