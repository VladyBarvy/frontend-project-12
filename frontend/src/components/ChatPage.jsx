/*
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChannels,
  fetchMessages,
  setCurrentChannel,
  addMessage,
} from '../store/chatSlice';
import MessageForm from './MessageForm';

const ChatPage = () => {
  const dispatch = useDispatch();
  const {
    messages,
    currentChannelId,
    status,
    error,
  } = useSelector((state) => state.chat);

  const { channels = [] } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  useEffect(() => {
    if (currentChannelId) {
      dispatch(fetchMessages(currentChannelId));
    }
  }, [dispatch, currentChannelId]);

  const handleSendMessage = (text) => {
    if (currentChannelId) {
      dispatch(sendMessage({ channelId: currentChannelId, text }));
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chat-container">
      <div className="channels-sidebar">
        <h3>Channels</h3>
        <ul>
          {channels.map((channel) => (
            <li
              key={channel.id}
              className={channel.id === currentChannelId ? 'active' : ''}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
            >
              #{channel.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-area">
        {currentChannelId && (
          <>


            <div className="messages">
              {Array.isArray(messages[currentChannelId]) &&
                messages[currentChannelId].map((message) => (
                  <div key={message.id} className="message">
                    <strong>{message.user.username}:</strong> {message.text}
                  </div>
                ))
              }
            </div>


            <MessageForm onSubmit={handleSendMessage} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
*/
















// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   fetchChannels,
//   setCurrentChannel,
//   addMessage,
//   messageSending,
//   messageSent
// } from '../store/chatSlice';
// import { connectWebSocket, sendWebSocketMessage } from '../api/wsService';
// import MessageForm from './MessageForm';
// import './ChatPage.css';

// const ChatPage = () => {
//   const dispatch = useDispatch();
//   const {
//     channels,
//     messages,
//     currentChannelId,
//     status,
//     error,
//     isConnected
//   } = useSelector((state) => state.chat);

//   // Инициализация WebSocket и загрузка каналов
//   useEffect(() => {
//     dispatch(fetchChannels());
//     connectWebSocket(dispatch, useSelector);

//     return () => {
//       // Очистка при размонтировании
//       if (socket) {
//         socket.close();
//       }
//     };
//   }, [dispatch]);

//   const handleSendMessage = async (text) => {
//     if (!currentChannelId || !text.trim()) return;

//     dispatch(messageSending());

//     try {
//       // Попытка отправить через WebSocket
//       const wsSuccess = sendWebSocketMessage(currentChannelId, text);

//       if (!wsSuccess) {
//         // Fallback к HTTP, если WebSocket недоступен
//         const response = await api.sendMessage(currentChannelId, text);
//         dispatch(addMessage({
//           channelId: currentChannelId,
//           message: response.data
//         }));
//       }
//     } catch (err) {
//       console.error('Failed to send message:', err);
//     } finally {
//       dispatch(messageSent());
//     }
//   };

//   if (status === 'loading') return <div className="loading">Loading channels...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <div className="chat-container">
//       <div className="channels-sidebar">
//         <h3>Channels</h3>
//         <ul>
//           {channels.map((channel) => (
//             <li
//               key={channel.id}
//               className={channel.id === currentChannelId ? 'active' : ''}
//               onClick={() => dispatch(setCurrentChannel(channel.id))}
//             >
//               #{channel.name}
//             </li>
//           ))}
//         </ul>
//         {!isConnected && (
//           <div className="connection-status disconnected">
//             Connecting to chat...
//           </div>
//         )}
//       </div>

//       <div className="chat-area">
//         {currentChannelId && (
//           <>
//             <div className="messages">
//               {messages[currentChannelId]?.map((message) => (
//                 <div key={message.id} className="message">
//                   <strong>{message.user.username}:</strong> {message.text}
//                   <span className="message-time">
//                     {new Date(message.createdAt).toLocaleTimeString()}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <MessageForm 
//               onSubmit={handleSendMessage} 
//               isSubmitting={status === 'sending'}
//               isConnected={isConnected}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;





























// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { initSocket, sendSocketMessage } from '../api/wsService';
// import { fetchChannels, fetchMessages, setCurrentChannel } from '../store/chatSlice';
// import MessageForm from './MessageForm';
// import './ChatPage.css';

// const ChatPage = () => {
//   const dispatch = useDispatch();
//   const { token } = useSelector(state => state.auth);
//   const {
//     channels,
//     currentChannelId,
//     messages,
//     loading,
//     error,
//     socketConnected
//   } = useSelector(state => state.chat);

//   // Инициализация данных и WebSocket
//   useEffect(() => {
//     dispatch(fetchChannels());
//     dispatch(fetchMessages());
//     const socket = initSocket(dispatch, token);

//     return () => {
//       if (socket) {
//         socket.close();
//       }
//     };
//   }, [dispatch, token]);

//   const handleSendMessage = (text) => {
//     if (!text.trim() || !currentChannelId) return;

//     const message = {
//       event: 'sendMessage',
//       payload: {
//         body: text,
//         channelId: currentChannelId
//       }
//     };

//     if (!sendSocketMessage(message)) {
//       // Fallback to HTTP если WebSocket недоступен
//       dispatch(sendMessageViaHttp({ channelId: currentChannelId, text }));
//     }
//   };

//   const currentMessages = messages.filter(
//     msg => msg.channelId === currentChannelId
//   );

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="chat-container">
//       <div className="channels-sidebar">
//         <h3>Channels</h3>
//         <ul>
//           {channels.map(channel => (
//             <li
//               key={channel.id}
//               className={channel.id === currentChannelId ? 'active' : ''}
//               onClick={() => dispatch(setCurrentChannel(channel.id))}
//             >
//               #{channel.name}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="chat-area">
//         <div className="messages">
//           {currentMessages.map(message => (
//             <div key={message.id} className="message">
//               <strong>{message.username}:</strong> {message.body}
//             </div>
//           ))}
//         </div>

//         <MessageForm 
//           onSubmit={handleSendMessage} 
//           disabled={!socketConnected}
//         />

//         {!socketConnected && (
//           <div className="connection-warning">
//             Connecting to chat server...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;




























import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initSocket, sendSocketMessage, closeSocket } from '../api/wsService';
// import { fetchChannels, fetchMessages, setCurrentChannel } from '../store/chatSlice';
import {
  fetchChannels,
  fetchMessages,
  setCurrentChannel,
  addMessage,
  removeMessage,
  updateMessageStatus,
} from '../store/chatSlice';
import axios from 'axios';

import MessageForm from './MessageForm';
import './ChatPage.css';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const {
    channels,
    currentChannelId,
    messages,
    loading,
    error,
    socketConnected
  } = useSelector(state => state.chat);

  // Инициализация WebSocket и данных
  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
    initSocket(dispatch, token);

    return () => {
      closeSocket();
    };
  }, [dispatch, token]);

  // const handleSendMessage = (text) => {
  //   if (!text.trim() || !currentChannelId) return;


  //   const username = localStorage.getItem('username') || 'Anonymous';

  //   const payload = {
  //     body: text,
  //     channelId: currentChannelId,
  //     username, // добавь имя
  //   };

  //   // const payload = {
  //   //   body: text,
  //   //   channelId: currentChannelId,
  //   // };




  //   console.log('Sending message:', payload);
    

  //   const success = sendSocketMessage('sendMessage', payload);

  //   if (!success) {
  //     // TODO: Fallback via HTTP if нужно
  //     console.warn('Socket not connected, message not sent.');
  //   }
  // };






  const handleSendMessage = async (text) => {
    if (!text.trim() || !currentChannelId) return;
  
    const username = localStorage.getItem('username') || 'Anonymous';
    const tempId = `temp-${Date.now()}`;
  
    const tempMessage = {
      id: tempId,
      body: text,
      channelId: currentChannelId,
      username,
      pending: true,
    };
  
    // Добавляем временное сообщение
    dispatch(addMessage(tempMessage));
  
    try {
      const response = await axios.post('/api/v1/messages', {
        body: text,
        channelId: currentChannelId,
        username,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Удаляем временное и добавляем настоящее (или просто обновляем его)
      dispatch(removeMessage(tempId));
      //dispatch(addMessage(response.data));
  
    } catch (err) {
      console.error('Ошибка отправки:', err);
      dispatch(updateMessageStatus({ id: tempId, status: 'error' }));
    }
  };





  const currentMessages = messages.filter(
    msg => msg.channelId === currentChannelId
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chat-container">
      <div className="channels-sidebar">
        <h3>Channels</h3>
        <ul>
          {channels.map(channel => (
            <li
              key={channel.id}
              className={channel.id === currentChannelId ? 'active' : ''}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
            >
              #{channel.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-area">
        <div className="messages">
          {currentMessages.map(message => (
            <div key={message.id} className="message">
              <strong>{message.username}:</strong> {message.body}
            </div>
          ))}
        </div>

        <MessageForm
          onSubmit={handleSendMessage}
          isConnected={socketConnected}
        />

        {!socketConnected && (
          <div className="connection-warning">
            Connecting to chat server...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
