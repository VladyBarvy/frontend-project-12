import { io } from 'socket.io-client';
import { socketConnected, socketDisconnected } from '../store/chatSlice';
import { addMessage } from '../store/chatSlice';

let socket = null;

export const initSocket = (dispatch, token) => {
  if (socket) return socket;

  socket = io('/', {
    path: '/socket.io',
    transports: ['websocket'],
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('Socket.IO connected');
    //dispatch({ type: 'socket/socketConnected' });
    dispatch(socketConnected());
  });

  socket.on('disconnect', () => {
    console.log('Socket.IO disconnected');
    //dispatch({ type: 'socket/socketDisconnected' });
    dispatch(socketDisconnected());
  });

  socket.on('connect_error', (err) => {
    console.error('Socket.IO connection error:', err.message);
  });


  socket.on('newMessage', (payload) => {

    if (!payload.username) {
      const username = localStorage.getItem('username');
      payload = { ...payload, username };
    }
  
    console.log('Received message from socket:', payload);
    dispatch(addMessage(payload));
  });

  socket.on('newChannel', (payload) => {
    dispatch({
      type: 'chat/addChannel',
      payload,
    });
  });

  socket.on('removeChannel', (payload) => {
    dispatch({
      type: 'chat/removeChannel',
      payload,
    });
  });

  socket.on('renameChannel', (payload) => {
    dispatch({
      type: 'chat/renameChannel',
      payload,
    });
  });



  return socket;
};

export const sendSocketMessage = (event, data) => {

  console.log('Attempting to send socket message:', { event, data, connected: socket?.connected });


  
  if (socket?.connected) {
    socket.emit(event, data);
    return true;
  }
  return false;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
