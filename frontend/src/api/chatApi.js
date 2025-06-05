// import axios from 'axios';

// const api = axios.create({
//   baseURL: '/api/v1/',
// });

// // Добавляем интерцептор для JWT
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default {
//   getChannels: () => api.get('/channels'),
//   getMessages: (channelId) => api.get(`/channels/${channelId}/messages`),
//   sendMessage: (channelId, text) => 
//     api.post(`/channels/${channelId}/messages`, { text }),
// };













import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
});

export default {
  getChannels: (token) => api.get('/channels', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  
  getMessages: (token) => api.get('/messages', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  
  sendMessage: (token, message) => api.post('/messages', message, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  
  addChannel: (token, channel) => api.post('/channels', channel, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  
  removeChannel: (token, channelId) => api.delete(`/channels/${channelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  
  renameChannel: (token, channelId, name) => api.patch(`/channels/${channelId}`, { name }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
};
