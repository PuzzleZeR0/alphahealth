// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/application/use-cases/citas.use-case.js
const citasRepository = require('../../adapters/out/citas.repository.js');

const createCitaUseCase = async (userId, fecha, hora, tratamiento) => {
    if (!fecha || !hora || !tratamiento) {
        throw new Error('Todos los campos (fecha, hora y tratamiento) son obligatorios.');
    }
    // Aquí podrías añadir más lógica (ej. no agendar en el pasado)
    return await citasRepository.create(userId, fecha, hora, tratamiento);
};

const getCitasUseCase = async (userId) => {
    if (!userId) {
        throw new Error('ID de usuario no proporcionado.');
    }
    return await citasRepository.findByUserId(userId);
};

module.exports = {
    createCitaUseCase,
    getCitasUseCase
};