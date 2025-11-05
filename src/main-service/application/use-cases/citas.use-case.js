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

module.exports = {
    createCitaUseCase,
    getCitasUseCase,
    getAllCitasUseCase // <-- Y ASEGÚRATE DE QUE ESTÉ EXPORTADA AQUÍ
};