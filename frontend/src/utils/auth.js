export const checkAuth = () => {
  const token = localStorage.getItem('token');
  return Boolean(token); // true, если токен есть; false, если нет
};
