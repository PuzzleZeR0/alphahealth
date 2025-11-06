//           Asegúrate de que esté aquí VVV
const { createCitaUseCase, getCitasUseCase, getAllCitasUseCase, updateCitaUseCase } = require('../../../application/use-cases/citas.use-case.js');

const createCita = async (req, res) => {
    try {
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

// --- Y que la función se llame aquí ---
const getAllCitas = async (req, res) => {
    try {
        // Esta es la línea que falla si la importación no funcionó
        const citas = await getAllCitasUseCase();
        res.status(200).json(citas);
    } catch (error) {
        // El error "is not defined" se captura aquí y se envía al navegador
        res.status(400).json({ error: error.message });
    }
};

const updateCita = async (req, res) => {
    try {
        const userId = req.user.id;
        const citaId = req.params.id;
        const data = req.body; // Esto será { fecha, hora, ... } o { estado: 'Cancelada' }

        // Pasamos userId para verificar que el usuario es dueño de la cita
        const updatedCita = await updateCitaUseCase(citaId, userId, data); 
        res.status(200).json({ message: 'Cita actualizada exitosamente', cita: updatedCita });
    } catch (error) {
        // Si el use case lanza error por "no autorizado"
        if (error.message === 'No autorizado') {
            return res.status(403).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createCita,
    getCitas,
    getAllCitas,
    updateCita
};