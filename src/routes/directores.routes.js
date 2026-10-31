const express = require("express");
const router = express.Router();
const conexion = require("../config/database");

// Consultar todos los directores
router.get("/", async (req, res) => {
    try {
        const [directores] = await conexion.query(
            "SELECT * FROM directores"
        );

        res.json(directores);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al consultar los directores",
            error: error.message
        });
    }
});

// Registrar un director
router.post("/", async (req, res) => {
    try {
        const { nombres } = req.body;

        if (!nombres) {
            return res.status(400).json({
                mensaje: "El nombre del director es obligatorio"
            });
        }

        const [resultado] = await conexion.query(
            "INSERT INTO directores (nombres) VALUES (?)",
            [nombres]
        );

        res.status(201).json({
            mensaje: "Director registrado correctamente",
            id: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar el director",
            error: error.message
        });
    }
});

// Actualizar un director
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, estado } = req.body;

        if (!nombres || !estado) {
            return res.status(400).json({
                mensaje: "El nombre y el estado son obligatorios"
            });
        }

        const [resultado] = await conexion.query(
            "UPDATE directores SET nombres = ?, estado = ? WHERE id = ?",
            [nombres, estado, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Director no encontrado"
            });
        }

        res.json({
            mensaje: "Director actualizado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el director",
            error: error.message
        });
    }
});

// Eliminar un director
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            "DELETE FROM directores WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Director no encontrado"
            });
        }

        res.json({
            mensaje: "Director eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el director",
            error: error.message
        });
    }
});

module.exports = router;