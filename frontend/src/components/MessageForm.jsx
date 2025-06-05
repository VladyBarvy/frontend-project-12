// import React, { useState } from 'react';

// const MessageForm = ({ onSubmit }) => {
//   const [text, setText] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (text.trim()) {
//       onSubmit(text.trim());
//       setText('');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="message-form">
//       <input
//         type="text"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Type a message..."
//       />
//       <button type="submit">Send</button>
//     </form>
//   );
// };

// export default MessageForm;















import React from 'react';

const MessageForm = ({ onSubmit, isSubmitting, isConnected }) => {
  const [text, setText] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isConnected ? "Type a message..." : "Connecting..."}
        disabled={!isConnected || isSubmitting}
      />
      <button 
        type="submit" 
        disabled={!isConnected || isSubmitting || !text.trim()}
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
      {!isConnected && (
        <div className="connection-warning">
          Message will be sent when connection is restored
        </div>
      )}
    </form>
  );
};

export default MessageForm;
