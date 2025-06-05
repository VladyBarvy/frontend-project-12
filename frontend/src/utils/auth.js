export const checkAuth = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      // Здесь можно добавить проверку срока действия токена
      return true;
    } catch (err) {
      localStorage.removeItem('token');
      return false;
    }
  }
  
  return false;
};
