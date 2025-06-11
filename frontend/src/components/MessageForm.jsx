import React from 'react'
import { useTranslation } from 'react-i18next'

const MessageForm = ({ onSubmit, isSubmitting, isConnected }) => {
  const [text, setText] = React.useState('')
  const { t } = useTranslation()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      onSubmit(text.trim());
      setText('')
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        aria-label={t('messageform_page.new_message') || 'Новое сообщение'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isConnected ? t('messageform_page.write_message') : t('messageform_page.connect_me')}
        disabled={!isConnected || isSubmitting}
      />
      <button
        type="submit"
        disabled={!isConnected || isSubmitting || !text.trim()}
      >
        {isSubmitting ? t('messageform_page.sending') : t('messageform_page.send')}
      </button>
      {!isConnected && (
        <div className="connection-warning">
          {t('messageform_page.esc_one')}
        </div>
      )}
    </form>
  )
}

export default MessageForm
