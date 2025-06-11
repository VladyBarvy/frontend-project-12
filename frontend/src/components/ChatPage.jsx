import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initSocket, sendSocketMessage, closeSocket } from '../api/wsService';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import leoProfanity from 'leo-profanity';
const DEFAULT_CHANNELS = ['general', 'random'];

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
  const { t } = useTranslation();
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















  const filterProfanity = (text) => {
    if (!leoProfanity.list().length) {
      leoProfanity.loadDictionary('ru');
      leoProfanity.add(leoProfanity.getDictionary('en')); // комбинирует русские и английские

    }

    const originalText = text;
    const filteredText = leoProfanity.clean(text);

    // Если текст был изменен, показываем уведомление
    if (filteredText !== originalText) {
      toast.warn(t('chat.profanity_filtered'));
    }

    return filteredText;
  };









  useEffect(() => {
    const handleClickOutside = (event) => {
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















  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchChannels()).unwrap();
        await dispatch(fetchMessages()).unwrap();
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        if (!navigator.onLine) {
          toast.error(t('chat.network_error'));
        } else {
          toast.error(`${t('chat.error_go')} ${t('chat.load_data_error')}`);
        }
      }
    };

    loadData();
    initSocket(dispatch, token);

    return () => {
      closeSocket();
    };
  }, [dispatch, token, t]);


















  // Инициализация WebSocket и данных
  // useEffect(() => {
  //   dispatch(fetchChannels());
  //   dispatch(fetchMessages());

  //   console.log('Token for auth:', token);

  //   initSocket(dispatch, token);

  //   return () => {
  //     closeSocket();
  //   };
  // }, [dispatch, token]);




  const handleSendMessage = async (text) => {
    if (!text.trim() || !currentChannelId) return;

    // Фильтруем текст перед отправкой
    const filteredText = filterProfanity(text);




    const username = localStorage.getItem('username');
    const tempId = `temp-${Date.now()}`;






    const tempMessage = {
      id: tempId,
      body: filteredText, // Используем отфильтрованный текст
      channelId: currentChannelId,
      username,
      pending: true,
    };

    // Добавляем временное сообщение
    dispatch(addMessage(tempMessage));

    try {
      const response = await axios.post('/api/v1/messages', {
        body: filteredText, // Используем отфильтрованный текст
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
      toast.error(t('chat.error_go') + ' ' + t('chat.message_send_error'));
    }
  };








  const handleAddChannel = async (name) => {
    try {
      // Фильтруем название канала
      const filteredName = filterProfanity(name);

      // const response = await axios.post('/api/v1/channels', { name }, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      const response = await axios.post('/api/v1/channels', {
        name: filteredName // Используем отфильтрованное название
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newChannel = response.data;
      dispatch(setCurrentChannel(newChannel.id));
      toast.success(t('chat.channel_created'));
    } catch (error) {
      console.error('Ошибка добавления канала:', error);
      toast.error(t('chat.error_create_channel'));
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
      toast.success(t('chat.channel_deleted'));

    } catch (err) {
      console.error('Ошибка при удалении канала:', err);
      toast.error(t('chat.error_go') + ' ' + t('chat.error_delete_channel'));
    }
  };









  const currentMessages = messages.filter(
    msg => msg.channelId === currentChannelId
  );

  if (loading) return <div>{t('chat.loading_go')}</div>;
  if (error) return <div>{t('chat.error_go')} {error}</div>;
















  return (
    <div className="chat-container">
      <div className="channels-sidebar">

        <div className="channels-header">
          <h3>{t('chat.list_of_channel_one')}</h3>
          <button onClick={openAddChannelModal} aria-label={t('chat.add_channel_one')}>
            +
          </button>
        </div>

        {/*   
        <h3>{t('chat.list_of_channel_one')}</h3>

        <button onClick={openAddChannelModal} aria-label={t('chat.add_channel_one')}>
          +
        </button> */}










        {/* 
        
        <button
          className={`channel-button ${currentChannelId === 'general' ? 'active' : ''}`}
          onClick={() => dispatch(setCurrentChannel('general'))}
          name="general"
          type="button"
          aria-label={t('chat.general_channel')}
        >
          {t('chat.general_channel')}
        </button>

        
        <button
          className={`channel-button ${currentChannelId === 'random' ? 'active' : ''}`}
          onClick={() => dispatch(setCurrentChannel('random'))}
          name="random"
          type="button"
          aria-label={t('chat.random_channel')}
        >
          {t('chat.random_channel')}
        </button>
 */}





        {/* Отдельные кнопки для дефолтных каналов */}
        {DEFAULT_CHANNELS.map(channelName => {
          const channel = channels.find(ch => ch.name.toLowerCase() === channelName);

          if (!channel) return null;

          return (
            <button
              key={channel.id}
              className={`channel-button ${currentChannelId === channel.id ? 'active' : ''}`}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
              // name={channelName}
              role="button"
              type="button"
              aria-label={t(`chat.${channelName}_channel`)}
            >
              {t(`chat.${channelName}_channel`)}
            </button>
          );
        })}














        {/* {channels
          .filter(channel => !DEFAULT_CHANNELS.includes(channel.name.toLowerCase()))
          .map(channel => (
            <div key={channel.id} className={channel.id === currentChannelId ? 'active' : ''}>


              <button
                className="channel-button"
                onClick={() => dispatch(setCurrentChannel(channel.id))}
                type="button"
                role="button"
                aria-label={`# ${channel.name}`} 
              
              >
                # {channel.name}
              </button>

              <button
                className="channel-menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChannelMenu(channel.id);
                }}
                aria-label={t('chat.menu_of_channel')}
              >
                ⋮
              </button>


              <div key={channel.id} className={channel.id === currentChannelId ? 'active' : ''} style={{ position: 'relative' }}>
                <button
                  className="channel-button"
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                  type="button"
                  aria-label={`# ${channel.name}`}
                >
                  # {channel.name}
                </button>

                <button
                  className="channel-menu-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleChannelMenu(channel.id);
                  }}
                  aria-label={t('chat.menu_of_channel')}
                >
                  ⋮
                </button>

                {channel.removable && (
                  <div
                    className={`channel-menu ${openMenuChannelId === channel.id ? 'visible' : 'hidden'}`}
                    style={{
                      position: 'absolute',
                      background: 'white',
                      border: '1px solid #ccc',
                      padding: '5px',
                      zIndex: 10,
                    }}
                  >
                    <div
                      role="heading"
                      aria-level={3}
                      style={{ padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #ccc', marginBottom: '5px' }}
                    >
                      Управление каналом
                    </div>

                    <button onClick={() => {
                      openRenameModal(channel);
                      setOpenMenuChannelId(null);
                    }}>
                      {t('chat.rename_channel_one')}
                    </button>
                    <button onClick={() => {
                      openDeleteConfirmModal(channel);
                      setOpenMenuChannelId(null);
                    }}>
                      {t('chat.delete_channel_one')}
                    </button>
                  </div>
                )}
              </div>







            </div>
          ))
        } */}








        {/* 110625 19_55 */}
        {/* {channels
          .filter(channel => !DEFAULT_CHANNELS.includes(channel.name.toLowerCase()))
          .map(channel => (
            <div key={channel.id} className={channel.id === currentChannelId ? 'active' : ''} style={{ position: 'relative' }}>
              <button
                className="channel-button"
                onClick={() => dispatch(setCurrentChannel(channel.id))}
                type="button"
                aria-label={`# ${channel.name}`}
              >
                # {channel.name}
              </button>

              <button
                className="channel-menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChannelMenu(channel.id);
                }}
                aria-label={t('chat.menu_of_channel')}
              >
                ⋮
              </button>

              {channel.removable && (
                <div
                  className={`channel-menu ${openMenuChannelId === channel.id ? 'visible' : 'hidden'}`}
                  style={{
                    position: 'absolute',
                    background: 'white',
                    border: '1px solid #ccc',
                    padding: '5px',
                    zIndex: 10,
                  }}
                >
                  <div
                    role="heading"
                    aria-level={3}
                    style={{ padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #ccc', marginBottom: '5px' }}
                  >
                    Управление каналом
                  </div>

                  <button onClick={() => {
                    openRenameModal(channel);
                    setOpenMenuChannelId(null);
                  }}>
                    {t('chat.rename_channel_one')}
                  </button>
                  <button onClick={() => {
                    openDeleteConfirmModal(channel);
                    setOpenMenuChannelId(null);
                  }}>
                    {t('chat.delete_channel_one')}
                  </button>
                </div>
              )}
            </div>
          ))
        } */}














        {channels
          .filter(channel => !DEFAULT_CHANNELS.includes(channel.name.toLowerCase()))
          .map(channel => (
            <div
              key={channel.id}
              className={channel.id === currentChannelId ? 'active' : ''}
              style={{ position: 'relative', marginBottom: '100px' }}
            >
              {/* Обернем кнопки в flex-контейнер */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  className="channel-button"
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                  type="button"
                  aria-label={`# ${channel.name}`}
                  style={{ flexGrow: 1, textAlign: 'left' }} // кнопка занимает максимум места слева
                >
                  # {channel.name}
                </button>

                <button
                  className="channel-menu-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleChannelMenu(channel.id);
                  }}
                  aria-label={t('chat.menu_of_channel')}
                  style={{ marginLeft: '8px' }} // небольшой отступ слева от кнопки меню
                >
                  ⋮
                </button>
              </div>

              {channel.removable && (
                <div
                  className={`channel-menu ${openMenuChannelId === channel.id ? 'visible' : 'hidden'}`}    
                  style={{
                    position: 'absolute',
                    background: 'white',
                    border: '1px solid #ccc',
                    padding: '5px',
                    zIndex: 10,
                    top: '100%', // под кнопками
                    right: 0,    // выравнивание по правому краю кнопки меню
                  }}
                >
                  <div
                    role="heading"
                    aria-level={3}
                    style={{ padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #ccc', marginBottom: '5px' }}
                  >
                    Управление каналом
                  </div>

                  <button onClick={() => {
                    openRenameModal(channel);
                    setOpenMenuChannelId(null);
                  }}>
                    {t('chat.rename_channel_one')}
                  </button>
                  <button onClick={() => {
                    openDeleteConfirmModal(channel);
                    setOpenMenuChannelId(null);
                  }}>
                    {t('chat.delete_channel_one')}
                  </button>
                </div>
              )}
            </div>
          ))
        }













        {/* </ul> */}






        {/* <ul>
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


              <button
                className="channel-menu-button"
                onClick={(e) => {
                  e.stopPropagation(); // чтобы не сработал click на li
                  toggleChannelMenu(channel.id);
                }}
                aria-label={t('chat.menu_of_channel')}
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
                    {t('chat.rename_channel_one')}
                  </button>
                  <button onClick={() => {
                    openDeleteConfirmModal(channel);
                    setOpenMenuChannelId(null);
                  }}>
                    {t('chat.delete_channel_one')}
                  </button>
                </div>
              )}




            </li>




          ))}
        </ul> */}





        {/* <ul>
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

              <button
                className="channel-menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChannelMenu(channel.id);
                }}
                aria-label={t('chat.menu_of_channel')}
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
                    {t('chat.rename_channel_one')}
                  </button>
                  <button onClick={() => {
                    openDeleteConfirmModal(channel);
                    setOpenMenuChannelId(null);
                  }}>
                    {t('chat.delete_channel_one')}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul> */}








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

        {/* <button onClick={openAddChannelModal}>{t('chat.add_channel_one')}</button> */}


        <MessageForm

          onSubmit={handleSendMessage}
          isConnected={socketConnected}
        />

        {!socketConnected && (
          <div className="connection-warning">
            {t('chat.connect_to_chat_server')}
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


        <ToastContainer position="top-right" autoClose={3000} />



      </div>
    </div>




  );
};

export default ChatPage;
