import api from './api';

/**
 * Envía la imagen al backend con los datos del usuario.
 *
 * @param {string} imageUri   - URI local de la imagen (expo-image-picker)
 * @param {string} gender     - "Male" | "Female"
 * @param {number} heightM    - Altura en metros (ej: 1.75)
 * @param {number} weightKg   - Peso en kg (ej: 70)
 * @param {number|null} age   - Edad en años (opcional)
 * @returns {Promise<object>} - Respuesta del backend (AnalysisResponse)
 */
export const analyzeBody = async (imageUri, gender, heightM, weightKg, age = null) => {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  formData.append('gender', gender);
  formData.append('height_m', String(heightM));
  formData.append('weight_kg', String(weightKg));

  if (age != null) {
    formData.append('age', String(age));
  }

  const response = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // 60s — AI recommendations may take longer
  });

  return response.data;
};