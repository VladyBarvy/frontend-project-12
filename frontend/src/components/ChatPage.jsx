import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initSocket, closeSocket } from '../api/wsService'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import leoProfanity from 'leo-profanity'
const DEFAULT_CHANNELS = ['general', 'random']
import {
  fetchChannels,
  fetchMessages,
  setCurrentChannel,
  addMessage,
  removeMessage,
  updateMessageStatus,
} from '../store/chatSlice'
import axios from 'axios'
import MessageForm from './MessageForm'
import AddChannelModal from './AddChannelModal'
import RenameChannelModal from './RenameChannelModal'
import DeleteChannelModal from './DeleteChannelModal'
import './ChatPage.css'

const ChatPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)
  const {
    channels,
    currentChannelId,
    messages,
    loading,
    error,
    socketConnected,
  } = useSelector(state => state.chat)
  const [openMenuChannelId, setOpenMenuChannelId] = useState(null)
  const toggleChannelMenu = (channelId) => {
    if (openMenuChannelId === channelId) {
      setOpenMenuChannelId(null)
    }
    else {
      setOpenMenuChannelId(channelId)
    }
  }
  const filterProfanity = (text) => {
    if (!leoProfanity.list().length) {
      leoProfanity.loadDictionary('ru')
      leoProfanity.add(leoProfanity.getDictionary('en'))
    }
    const originalText = text
    const filteredText = leoProfanity.clean(text)
    if (filteredText !== originalText) {
      toast.warn(t('chat.profanity_filtered'))
    }

    return filteredText
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.channel-menu') && !event.target.closest('.channel-menu-button')) {
        setOpenMenuChannelId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  const [isAddChannelOpen, setAddChannelOpen] = useState(false)
  const [isRenameChannelOpen, setRenameChannelOpen] = useState(false)
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [channelToEdit, setChannelToEdit] = useState(null)
  const openAddChannelModal = () => setAddChannelOpen(true)
  const closeAddChannelModal = () => setAddChannelOpen(false)
  const openRenameModal = (channel) => {
    setChannelToEdit(channel)
    setRenameChannelOpen(true)
  }
  const closeRenameModal = () => {
    setChannelToEdit(null)
    setRenameChannelOpen(false)
  }
  const openDeleteConfirmModal = (channel) => {
    setChannelToEdit(channel)
    setDeleteConfirmOpen(true)
  }
  const closeDeleteConfirmModal = () => {
    setChannelToEdit(null)
    setDeleteConfirmOpen(false)
  }
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchChannels()).unwrap()
        await dispatch(fetchMessages()).unwrap()
      }
      catch (err) {
        console.error('Ошибка при загрузке данных:', err)
        if (!navigator.onLine) {
          toast.error(t('chat.network_error'))
        }
        else {
          toast.error(`${t('chat.error_go')} ${t('chat.load_data_error')}`)
        }
      }
    }
    loadData()
    initSocket(dispatch, token)
    return () => {
      closeSocket()
    }
  }, [dispatch, token, t])
  const handleSendMessage = async (text) => {
    if (!text.trim() || !currentChannelId) return
    const filteredText = filterProfanity(text)
    const username = localStorage.getItem('username')
    const tempId = `temp-${Date.now()}`
    const tempMessage = {
      id: tempId,
      body: filteredText,
      channelId: currentChannelId,
      username,
      pending: true,
    }
    dispatch(addMessage(tempMessage))
    try {
      const response = await axios.post('/api/v1/messages', {
        body: filteredText,
        channelId: currentChannelId,
        username,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(response)
      dispatch(removeMessage(tempId))
    }
    catch (err) {
      console.error('Ошибка отправки:', err)
      dispatch(updateMessageStatus({ id: tempId, status: 'error' }))
      toast.error(t('chat.error_go') + ' ' + t('chat.message_send_error'))
    }
  }
  const handleAddChannel = async (name) => {
    try {
      const filteredName = filterProfanity(name)
      const response = await axios.post('/api/v1/channels', {
        name: filteredName,
      },
        {
          headers: { Authorization: `Bearer ${token}` },
        })
      const newChannel = response.data
      dispatch(setCurrentChannel(newChannel.id))
      toast.success(t('chat.channel_created'))
    }
    catch (error) {
      console.error('Ошибка добавления канала:', error)
      toast.error(t('chat.error_create_channel'))
    }
  }
  const handleDeleteChannel = async () => {
    if (!channelToEdit) return
    try {
      await axios.delete(`/api/v1/channels/${channelToEdit.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      closeDeleteConfirmModal()
      toast.success(t('chat.channel_deleted'))
    }
    catch (err) {
      console.error('Ошибка при удалении канала:', err)
      toast.error(t('chat.error_go') + ' ' + t('chat.error_delete_channel'))
    }
  }
  const currentMessages = messages.filter(
    msg => msg.channelId === currentChannelId,
  )
  if (loading) return <div>{t('chat.loading_go')}</div>
  if (error) {
    return <div>{t('chat.error_go')}
      {error}
    </div>
  }
  return (
    <div className="chat-container">
      <div className="channels-sidebar">
        <div className="channels-header">
          <h3>{t('chat.list_of_channel_one')}</h3>
          <button onClick={openAddChannelModal} aria-label={t('chat.add_channel_one')}>
            +
          </button>
        </div>
        {DEFAULT_CHANNELS.map(channelName => {
          const channel = channels.find(ch => ch.name.toLowerCase() === channelName)
          if (!channel) return null
          return (
            <button
              key={channel.id}
              className={`channel-button ${currentChannelId === channel.id ? 'active' : ''}`}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
              role="button"
              type="button"
              aria-label={t(`chat.${channelName}_channel`)}
            >
              {t(`chat.${channelName}_channel`)}
            </button>
          )
        })}

        {channels
          .filter(channel => !DEFAULT_CHANNELS.includes(channel.name.toLowerCase()))
          .map(channel => (
            <div
              key={channel.id}
              className={channel.id === currentChannelId ? 'active' : ''}
              style={{ position: 'relative', marginBottom: '100px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  className="channel-button"
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                  type="button"
                  aria-label={`# ${channel.name}`}
                  style={{ flexGrow: 1, textAlign: 'left' }}
                >
                  #
                  {channel.name}
                </button>

                <button
                  className="channel-menu-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleChannelMenu(channel.id)
                  }}
                  aria-label={t('chat.menu_of_channel')}
                  style={{ marginLeft: '8px' }}
                >
                  ⋮
                  <span
                    style={{
                      position: 'absolute',
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: 'hidden',
                      clip: 'rect(0, 0, 0, 0)',
                      whiteSpace: 'nowrap',
                      border: 0,
                    }}
                  >
                    Управление каналом
                  </span>
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
                    top: '100%',
                    right: 0,
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
                    openRenameModal(channel)
                    setOpenMenuChannelId(null)
                  }}>
                    {t('chat.rename_channel_one')}
                  </button>
                  <button onClick={() => {
                    openDeleteConfirmModal(channel)
                    setOpenMenuChannelId(null)
                  }}
                  >
                    {t('chat.delete_channel_one')}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="chat-area">
        <div className="messages">
          {currentMessages.map(message => (
            <div key={message.id} className="message">
              <strong>
                {message.username}
                :
              </strong>
              {message.body}
            </div>
          ))}
        </div>
        <AddChannelModal
          isOpen={isAddChannelOpen}
          onRequestClose={closeAddChannelModal}
          onAddChannel={handleAddChannel}
          channels={channels}
        />
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
  )
}

export default ChatPage
