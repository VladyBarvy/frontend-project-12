import React from 'react';
import Modal from 'react-modal';

const DeleteChannelModal = ({ isOpen, onRequestClose, onConfirm, channelName }) => (
  <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
    <h2>Удалить канал</h2>
    <p>Вы уверены, что хотите удалить канал «{channelName}»?</p>
    <div>
      <button onClick={onConfirm}>Удалить</button>
      <button onClick={onRequestClose}>Отмена</button>
    </div>
  </Modal>
);

export default DeleteChannelModal;
