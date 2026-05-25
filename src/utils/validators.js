export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateHeight = (height) => {
  const h = parseFloat(height);
  return !isNaN(h) && h >= 100 && h <= 250;
};

export const validateWeight = (weight) => {
  const w = parseFloat(weight);
  return !isNaN(w) && w >= 30 && w <= 300;
};

export const validateAge = (age) => {
  const a = parseInt(age, 10);
  return !isNaN(a) && a >= 10 && a <= 120;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const getEmailError = (email) => {
  if (!email) return 'El email es requerido';
  if (!validateEmail(email)) return 'Email no válido';
  return null;
};

export const getPasswordError = (password) => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) return 'Mínimo 6 caracteres';
  return null;
};

export const getNameError = (name) => {
  if (!name) return 'El nombre es requerido';
  if (name.trim().length < 2) return 'Mínimo 2 caracteres';
  return null;
};
