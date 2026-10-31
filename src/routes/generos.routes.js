const express = require("express");
const router = express.Router();
const conexion = require("../config/database");

// Consultar todos los géneros
router.get("/", async (req, res) => {

    try {
        const [generos] = await conexion.query(
            "SELECT * FROM generos"
        );

        res.json(generos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al consultar los géneros",
            error: error.message
        });
    }
});

// Registrar un nuevo género
router.post("/", async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre del género es obligatorio"
            });
        }

        const [resultado] = await conexion.query(
            "INSERT INTO generos (nombre, descripcion) VALUES (?, ?)",
            [nombre, descripcion || null]
        );

        res.status(201).json({
            mensaje: "Género registrado correctamente",
            id: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar el género",
            error: error.message
        });
    }
});

// Actualizar un género
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado, descripcion } = req.body;

        const [resultado] = await conexion.query(
            `UPDATE generos
             SET nombre = ?, estado = ?, descripcion = ?
             WHERE id = ?`,
            [nombre, estado, descripcion, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "No se encontró el género"
            });
        }

        res.json({
            mensaje: "Género actualizado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el género",
            error: error.message
        });
    }
});

// Eliminar un género
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            "DELETE FROM generos WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "No se encontró el género"
            });
        }

        res.json({
            mensaje: "Género eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el género",
            error: error.message
        });
    }
});

module.exports = router;