const citasRepository = require('../../adapters/out/citas.repository.js');

const createCitaUseCase = async (userId, fecha, hora, tratamiento) => {
    if (!fecha || !hora || !tratamiento) {
        throw new Error('Todos los campos (fecha, hora y tratamiento) son obligatorios.');
    }
    return await citasRepository.create(userId, fecha, hora, tratamiento);
};

const getCitasUseCase = async (userId) => {
    if (!userId) {
        throw new Error('ID de usuario no proporcionado.');
    }
    return await citasRepository.findByUserId(userId);
};

// --- ASEGÚRATE DE QUE ESTA FUNCIÓN EXISTA ---
const getAllCitasUseCase = async () => {
    return await citasRepository.findAllWithPatientName();
};

const updateCitaUseCase = async (citaId, userId, data) => {
    if (!citaId || !userId || !data) {
        throw new Error('Datos incompletos para actualizar.');
    }
    
    // 1. Verificar que el usuario es dueño de la cita
    // (Necesitamos añadir findCitaByIdAndUser al repositorio)
    const cita = await citasRepository.findCitaByIdAndUser(citaId, userId);
    if (!cita) {
        // O la cita no existe, o no pertenece a este usuario
        throw new Error('No autorizado');
    }
    
    // 2. Si todo OK, actualizar
    // (Necesitamos añadir updateCitaById al repositorio)
    return await citasRepository.updateCitaById(citaId, data);
};

module.exports = {
    createCitaUseCase,
    getCitasUseCase,
    getAllCitasUseCase,
    updateCitaUseCase
};