export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      return true;
    } catch (err) {
      console.log(err);
      localStorage.removeItem('token');
      return false;
    }
  }
  return false;
};
