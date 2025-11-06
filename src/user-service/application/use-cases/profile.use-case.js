// src/user-service/application/use-cases/profile.use-case.js
const userRepository = require('../../adapters/out/user.repository.js');

/**
 * Obtiene el perfil completo de un usuario (datos de users y user_profiles).
 */
const getUserProfileUseCase = async (userId) => {
    if (!userId) {
        throw new Error('ID de usuario no proporcionado.');
    }
    // Podríamos buscar primero en la tabla users si necesitamos el email/nombre también
    // const user = await userRepository.findById(userId); // Necesitarías crear esta función en el repo
    // if (!user) throw new Error('Usuario no encontrado.');

    const user = await userRepository.findUserById(userId);
    if (!user) {
         // Si el usuario no existe (raro si está autenticado), devolver vacío o error
         return {};
         // Opcional: throw new Error('Usuario no encontrado.');
    }

    const profile = await userRepository.findProfileByUserId(userId);
    
    // Aquí podrías combinar datos del usuario y del perfil si fuera necesario
    // Por ahora, solo devolvemos el perfil o un objeto vacío si no existe
    return {
        ...user,    // Incluye id, nombre, email de la tabla users
        ...(profile || {}) // Incluye todos los campos de user_profiles si existen, si no, no añade nada
    };
};

/**
 * Crea o actualiza el perfil de un usuario.
 */
const updateUserProfileUseCase = async (userId, profileData) => {
    if (!userId) {
        throw new Error('ID de usuario no proporcionado.');
    }
    if (!profileData || Object.keys(profileData).length === 0) {
        throw new Error('No se proporcionaron datos para actualizar el perfil.');
    }

    const { nombre, ...restOfProfileData } = profileData;

    // 1. Actualizar el nombre en la tabla 'users' si se proporcionó
    if (nombre !== undefined && nombre !== null && nombre.trim() !== '') {
         // Opcional: Podrías verificar si el nombre es diferente al actual antes de actualizar
         await userRepository.updateUserName(userId, nombre.trim());
    }

    if (Object.keys(restOfProfileData).length > 0) {
        await userRepository.upsertProfile(userId, restOfProfileData);
    }

    // Devolver un mensaje genérico o los datos actualizados si se quiere

    // Aquí podrías añadir validaciones más complejas si fuera necesario
    // (ej: validar formato de fecha, teléfono, etc.)

    const result = await userRepository.upsertProfile(userId, profileData);
    return result;
};

const getAllUserProfilesUseCase = async () => {
    return await userRepository.findAllUserProfiles();
};

module.exports = {
    getUserProfileUseCase,
    updateUserProfileUseCase,
    getAllUserProfilesUseCase // <-- Exportar el nuevo caso de uso
};