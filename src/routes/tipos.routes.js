const express = require("express");
const router = express.Router();
const conexion = require("../config/database");

// Consultar todos los tipos
router.get("/", async (req, res) => {
    try {
        const [tipos] = await conexion.query(
            "SELECT * FROM tipos"
        );

        res.json(tipos);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al consultar los tipos",
            error: error.message
        });
    }
});

// Registrar un tipo
router.post("/", async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre del tipo es obligatorio"
            });
        }

        const [resultado] = await conexion.query(
            "INSERT INTO tipos (nombre, descripcion) VALUES (?, ?)",
            [nombre, descripcion || null]
        );

        res.status(201).json({
            mensaje: "Tipo registrado correctamente",
            id: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar el tipo",
            error: error.message
        });
    }
});

// Actualizar un tipo
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre del tipo es obligatorio"
            });
        }

        const [resultado] = await conexion.query(
            "UPDATE tipos SET nombre = ?, descripcion = ? WHERE id = ?",
            [nombre, descripcion || null, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Tipo no encontrado"
            });
        }

        res.json({
            mensaje: "Tipo actualizado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el tipo",
            error: error.message
        });
    }
});

// Eliminar un tipo
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            "DELETE FROM tipos WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Tipo no encontrado"
            });
        }

        res.json({
            mensaje: "Tipo eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el tipo",
            error: error.message
        });
    }
});

module.exports = router;