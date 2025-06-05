// let socket = null;
// let reconnectAttempts = 0;
// const maxReconnectAttempts = 5;
// const reconnectDelay = 3000;

// export const connectWebSocket = (dispatch, getState) => {
//   if (socket) return;

//   const wsUrl = `wss://api/v1/ws?token=${localStorage.getItem('token')}`;
//   socket = new WebSocket(wsUrl);

//   socket.onopen = () => {
//     reconnectAttempts = 0;
//     dispatch(socketConnected(socket));
//     console.log('WebSocket connected');
//   };

//   socket.onmessage = (event) => {
//     const message = JSON.parse(event.data);
//     if (message.type === 'NEW_MESSAGE') {
//       dispatch(addMessage({
//         channelId: message.channelId,
//         message: message.data
//       }));
//     }
//   };

//   socket.onclose = () => {
//     dispatch(socketDisconnected());
//     console.log('WebSocket disconnected');
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         console.log(`Reconnecting attempt ${reconnectAttempts}`);
//         connectWebSocket(dispatch, getState);
//       }, reconnectDelay);
//     }
//   };

//   socket.onerror = (error) => {
//     console.error('WebSocket error:', error);
//   };
// };

// export const sendWebSocketMessage = (channelId, text) => {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify({
//       type: 'SEND_MESSAGE',
//       channelId,
//       text
//     }));
//     return true;
//   }
//   return false;
// };

























//  let socket = null;
// // const WS_URL = import.meta.env.VITE_WS_URL;

// import { io } from 'socket.io-client';



// export const initSocket = (dispatch, token) => {
//   if (socket) return socket;

//   //socket = new WebSocket(`ws://app/v1/?token=${token}`);
//   //socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/v1/ws?token=${token}`);

//   // const fullUrl = `${WS_URL}?token=${token}`;  // <-- обязательно без undefined
//   // socket = new WebSocket(fullUrl);
//   socket = io('http://localhost:5001', {
//     auth: { token } // или query: { token }, если сервер ожидает токен в query-параметрах
//   });


//   socket.onopen = () => {
//     console.log('WebSocket connected');
//     dispatch({ type: 'socket/socketConnected' });
//   };

//   socket.onmessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       switch (data.event) {
//         case 'newMessage':
//           dispatch({
//             type: 'chat/addMessage',
//             payload: {
//               channelId: data.payload.channelId,
//               message: data.payload
//             }
//           });
//           break;
//         case 'newChannel':
//           dispatch({
//             type: 'chat/addChannel',
//             payload: data.payload
//           });
//           break;
//         case 'removeChannel':
//           dispatch({
//             type: 'chat/removeChannel',
//             payload: data.payload
//           });
//           break;
//         case 'renameChannel':
//           dispatch({
//             type: 'chat/renameChannel',
//             payload: data.payload
//           });
//           break;
//         default:
//           console.warn('Unknown event type:', data.event);
//       }
//     } catch (error) {
//       console.error('Error parsing WebSocket message:', error);
//     }
//   };

//   socket.onclose = () => {
//     console.log('WebSocket disconnected');
//     dispatch({ type: 'socket/socketDisconnected' });
//   };

//   socket.onerror = (error) => {
//     console.error('WebSocket error:', error);
//   };

//   return socket;
// };

// export const sendSocketMessage = (message) => {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(message));
//     return true;
//   }
//   return false;
// };

// export const closeSocket = () => {
//   if (socket) {
//     socket.close();
//     socket = null;
//   }
// };



















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

  // socket.on('newMessage', (payload) => {
  //   dispatch({
  //     type: 'chat/addMessage',
  //     payload: {
  //       channelId: payload.channelId,
  //       message: payload,
  //     },
  //   });
  // });

  socket.on('newMessage', (payload) => {
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
