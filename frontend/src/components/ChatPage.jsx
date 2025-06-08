import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initSocket, sendSocketMessage, closeSocket } from '../api/wsService';

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
import AddChannelModal from './AddChannelModal';
import RenameChannelModal from './RenameChannelModal';
import DeleteChannelModal from './DeleteChannelModal';
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


  const [openMenuChannelId, setOpenMenuChannelId] = useState(null);



  const toggleChannelMenu = (channelId) => {
    if (openMenuChannelId === channelId) {
      setOpenMenuChannelId(null);
    } else {
      setOpenMenuChannelId(channelId);
    }
  };






  useEffect(() => {
    const handleClickOutside = (event) => {
      // Если клик вне меню — закрываем меню
      if (!event.target.closest('.channel-menu') && !event.target.closest('.channel-menu-button')) {
        setOpenMenuChannelId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);








  // Состояния для модалок
  const [isAddChannelOpen, setAddChannelOpen] = useState(false);
  const [isRenameChannelOpen, setRenameChannelOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [channelToEdit, setChannelToEdit] = useState(null);


  // Функции открытия модалок
  const openAddChannelModal = () => setAddChannelOpen(true);
  const closeAddChannelModal = () => setAddChannelOpen(false);

  const openRenameModal = (channel) => {
    setChannelToEdit(channel);
    setRenameChannelOpen(true);
  };
  const closeRenameModal = () => {
    setChannelToEdit(null);
    setRenameChannelOpen(false);
  };

  const openDeleteConfirmModal = (channel) => {
    setChannelToEdit(channel);
    setDeleteConfirmOpen(true);
  };
  const closeDeleteConfirmModal = () => {
    setChannelToEdit(null);
    setDeleteConfirmOpen(false);
  };







  // Инициализация WebSocket и данных
  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());

    console.log('Token for auth:', token);

    initSocket(dispatch, token);

    return () => {
      closeSocket();
    };
  }, [dispatch, token]);




  const handleSendMessage = async (text) => {
    if (!text.trim() || !currentChannelId) return;

    const username = localStorage.getItem('username');
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









  const handleAddChannel = async (name) => {
    try {
      // отправка на сервер добавления канала
      const response = await axios.post('/api/v1/channels', { name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newChannel = response.data;

      // переключаем пользователя на новый канал
      dispatch(setCurrentChannel(newChannel.id));
    } catch (error) {
      console.error('Ошибка добавления канала:', error);
    }
  };













  const handleDeleteChannel = async () => {
    if (!channelToEdit) return;

    try {
      await axios.delete(`/api/v1/channels/${channelToEdit.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // WebSocket событие удалит канал из списка автоматически
      closeDeleteConfirmModal();
    } catch (err) {
      console.error('Ошибка при удалении канала:', err);
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
            >
              <span
                onClick={() => dispatch(setCurrentChannel(channel.id))}
                style={{ cursor: 'pointer' }}
              >
                # {channel.name}
              </span>

              {/* <button onClick={() => } aria-label="Меню канала" > ⋮ </button> */}

              <button
                className="channel-menu-button"
                onClick={(e) => {
                  e.stopPropagation(); // чтобы не сработал click на li
                  toggleChannelMenu(channel.id);
                }}
                aria-label="Меню канала"
              >
                ⋮
              </button>




              {channel.removable && openMenuChannelId === channel.id && (
                <div className="channel-menu" style={{
                  position: 'absolute',
                  background: 'white',
                  border: '1px solid #ccc',
                  padding: '5px',
                  zIndex: 10,
                }}>
                  <button onClick={() => {
                    openRenameModal(channel);
                    setOpenMenuChannelId(null);
                  }}>
                    Переименовать
                  </button>
                  <button onClick={() => {
                    openDeleteConfirmModal(channel);
                    setOpenMenuChannelId(null);
                  }}>
                    Удалить
                  </button>
                </div>
              )}




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



        <AddChannelModal
          isOpen={isAddChannelOpen}
          onRequestClose={closeAddChannelModal}
          onAddChannel={handleAddChannel}
          channels={channels}
        />

        <button onClick={openAddChannelModal}>Добавить канал</button>


        <MessageForm
          onSubmit={handleSendMessage}
          isConnected={socketConnected}
        />

        {!socketConnected && (
          <div className="connection-warning">
            Connecting to chat server...
          </div>
        )}




        {isRenameChannelOpen && channelToEdit && (
          <RenameChannelModal
            channelId={channelToEdit.id}
            initialName={channelToEdit.name}
            onClose={closeRenameModal}
          />
        )}






        {isDeleteConfirmOpen && channelToEdit && (
          <DeleteChannelModal
            isOpen={isDeleteConfirmOpen}
            onRequestClose={closeDeleteConfirmModal}
            onConfirm={handleDeleteChannel}
            channelName={channelToEdit.name}
          />
        )}






      </div>
    </div>
  );
};

export default ChatPage;
