import React from 'react';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';

function DeleteChannelModal ({ isOpen, onRequestClose, onConfirm, channelName }) {
  const { t } = useTranslation();
  return (
  <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
    <h2>{t('delete_channel_page.delete_channel')}</h2>
    <p>{t('delete_channel_page.are_you_sure')} «{channelName}»?</p>
    <div>
      <button className="btn-danger" onClick={onConfirm}>{t('delete_channel_page.delete_go')}</button>
      <button onClick={onRequestClose}>{t('delete_channel_page.cancel_go')}</button>
    </div>
  </Modal>
  );
};

export default DeleteChannelModal;
