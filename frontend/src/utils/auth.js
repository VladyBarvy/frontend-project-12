export const checkAuth = () => {
  const token = localStorage.getItem('token')
  return Boolean(token)
}
