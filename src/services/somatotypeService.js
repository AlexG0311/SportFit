// src/services/somatotypeService.js
import api from './api'; // tu instancia de axios configurada

/**
 * Calcula el somatotipo dominante a partir de las respuestas
 * @param {Array<string>} answers - array de valores 'ecto', 'meso', 'endo'
 * @returns {string} 'Ectomorfo', 'Mesomorfo' o 'Endomorfo'
 */
export const calculateSomatotypeScores = (answers) => {
  let ecto = 0;
  let meso = 0;
  let endo = 0;
  answers.forEach((val) => {
    if (val === 'ecto') ecto++;
    else if (val === 'meso') meso++;
    else if (val === 'endo') endo++;
  });
  const total = answers.length || 1;
  let dominant = 'Endomorfo';
  if (ecto >= meso && ecto >= endo) dominant = 'Ectomorfo';
  else if (meso >= ecto && meso >= endo) dominant = 'Mesomorfo';
  return {
    ecto: Math.round((ecto / total) * 100),
    meso: Math.round((meso / total) * 100),
    endo: Math.round((endo / total) * 100),
    dominant,
  };
};

export const calculateDominantSomatotype = (answers) => {
  return calculateSomatotypeScores(answers).dominant;
};

/**
 * Envía el somatotipo y datos del usuario a Gemini para obtener recomendaciones
 */
export const fetchRecommendations = async (somatotype, userData) => {
  try {
    const response = await api.post('/recommendations-by-quiz', {
      somatotype,
      height_m: userData.height,
      weight_kg: userData.weight,
      age: userData.age,
      gender: userData.gender,
    });
    return response.data.recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('No se pudieron obtener las recomendaciones');
  }
};