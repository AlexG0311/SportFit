import api from './api';

export const analyzeBody = async (imageUri, gender) => {
  const formData = new FormData();
  
  // Añadir la imagen
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'body_analysis.jpg',
  });
  
  // Añadir el género (debe ser 'Male' o 'Female')
  formData.append('gender', gender);

  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  });

  return response.data;
};