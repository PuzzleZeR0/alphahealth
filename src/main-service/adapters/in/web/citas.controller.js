// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/in/web/citas.controller.js
const { createCitaUseCase, getCitasUseCase } = require('../../../application/use-cases/citas.use-case.js');

const createCita = async (req, res) => {
    try {
        // Obtenemos el ID del usuario del token (gracias al auth.middleware)
        const userId = req.user.id;
        const { fecha, hora, tratamiento } = req.body;

        const cita = await createCitaUseCase(userId, fecha, hora, tratamiento);
        res.status(201).json({ message: 'Cita creada exitosamente', citaId: cita.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCitas = async (req, res) => {
    try {
        const userId = req.user.id;
        const citas = await getCitasUseCase(userId);
        res.status(200).json(citas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createCita,
    getCitas
};