// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../api/chatApi';

// const initialState = {
//   channels: [],
//   messages: {},
//   currentChannelId: 'general', // ID канала по умолчанию
//   status: 'idle',
//   error: null,
//   socket: null,
//   isConnected: false
// };

// export const fetchChannels = createAsyncThunk(
//   'chat/fetchChannels',
//   async () => {
//     const response = await api.getChannels();
//     return response.data;
//   }
// );

// export const fetchMessages = createAsyncThunk(
//   'chat/fetchMessages',
//   async (channelId) => {
//     const response = await api.getMessages(channelId);
//     return { channelId, messages: response.data };
//   }
// );


















// const chatSlice = createSlice({
//   name: 'chat',
//   initialState: {
//     channels: [],
//     messages: {},
//     currentChannelId: null,
//     status: 'idle',
//     error: null,
//   },
//   reducers: {
//     setCurrentChannel: (state, action) => {
//       state.currentChannelId = action.payload;
//     },
//     addMessage: (state, action) => {
//       const { channelId, message } = action.payload;
//       if (!state.messages[channelId]) {
//         state.messages[channelId] = [];
//       }
//       state.messages[channelId].push(message);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchChannels.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchChannels.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.channels = action.payload;
//         if (action.payload.length > 0 && !state.currentChannelId) {
//           state.currentChannelId = action.payload[0].id;
//         }
//       })
//       .addCase(fetchChannels.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
//       .addCase(fetchMessages.fulfilled, (state, action) => {
//         const { channelId, messages } = action.payload;
//         state.messages[channelId] = messages;
//       });
//   },
// });

// export const { setCurrentChannel, addMessage } = chatSlice.actions;
// export default chatSlice.reducer;



















// const chatSlice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     setCurrentChannel: (state, action) => {
//       state.currentChannelId = action.payload;
//     },
//     addMessage: (state, action) => {
//       const { channelId, message } = action.payload;
//       if (!state.messages[channelId]) {
//         state.messages[channelId] = [];
//       }
//       state.messages[channelId].push(message);
//     },
//     socketConnected: (state, action) => {
//       state.isConnected = true;
//       state.socket = action.payload;
//     },
//     socketDisconnected: (state) => {
//       state.isConnected = false;
//       state.socket = null;
//     },
//     messageSending: (state) => {
//       state.status = 'sending';
//     },
//     messageSent: (state) => {
//       state.status = 'idle';
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchChannels.fulfilled, (state, action) => {
//         state.channels = action.payload;
//         // Инициализируем сообщения для каждого канала
//         action.payload.forEach(channel => {
//           if (!state.messages[channel.id]) {
//             state.messages[channel.id] = [];
//           }
//         });
//       });
//   }
// });

// export const { 
//   setCurrentChannel, 
//   addMessage, 
//   socketConnected, 
//   socketDisconnected,
//   messageSending,
//   messageSent
// } = chatSlice.actions;

// export default chatSlice.reducer;


























// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../api/chatApi';

// const initialState = {
//   channels: [],
//   currentChannelId: '1', // general channel by default
//   messages: [],
//   loading: false,
//   error: null,
//   socketConnected: false
// };

// export const fetchChannels = createAsyncThunk(
//   'chat/fetchChannels',
//   async (_, { getState }) => {
//     const { auth } = getState();
//     const response = await api.getChannels(auth.token);
//     return response.data;
//   }
// );

// export const fetchMessages = createAsyncThunk(
//   'chat/fetchMessages',
//   async (_, { getState }) => {
//     const { auth } = getState();
//     const response = await api.getMessages(auth.token);
//     return response.data;
//   }
// );

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     setCurrentChannel: (state, action) => {
//       state.currentChannelId = action.payload;
//     },
//     addMessage: (state, action) => {
//       state.messages.push(action.payload.message);
//     },
//     addChannel: (state, action) => {
//       state.channels.push(action.payload);
//     },
//     removeChannel: (state, action) => {
//       state.channels = state.channels.filter(ch => ch.id !== action.payload.id);
//       state.messages = state.messages.filter(msg => msg.channelId !== action.payload.id);
//       if (state.currentChannelId === action.payload.id) {
//         state.currentChannelId = '1'; // fallback to general channel
//       }
//     },
//     renameChannel: (state, action) => {
//       const channel = state.channels.find(ch => ch.id === action.payload.id);
//       if (channel) {
//         channel.name = action.payload.name;
//       }
//     },
//     socketConnected: (state) => {
//       state.socketConnected = true;
//     },
//     socketDisconnected: (state) => {
//       state.socketConnected = false;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchChannels.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchChannels.fulfilled, (state, action) => {
//         state.loading = false;
//         state.channels = action.payload;
//       })
//       .addCase(fetchChannels.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(fetchMessages.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchMessages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.messages = action.payload;
//       })
//       .addCase(fetchMessages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   }
// });

// export const {
//   setCurrentChannel,
//   addMessage,
//   addChannel,
//   removeChannel,
//   renameChannel,
//   socketConnected,
//   socketDisconnected
// } = chatSlice.actions;

// export default chatSlice.reducer;























import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронные действия для загрузки данных через REST API
export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get('/api/v1/channels', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get('/api/v1/messages', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    currentChannelId: null,
    messages: [],
    loading: false,
    error: null,
    socketConnected: false,
  },
  reducers: {
    setCurrentChannel(state, action) {
      state.currentChannelId = action.payload;
    },
    socketConnected(state) {
      state.socketConnected = true;
    },
    socketDisconnected(state) {
      state.socketConnected = false;
    },


    // addMessage(state, action) {
    //   state.messages.push(action.payload);
    // },

    addMessage(state, action) {
      state.messages.push(action.payload);
    },


    addChannel(state, action) {
      state.channels.push(action.payload);
    },
    removeChannel(state, action) {
      const id = action.payload.id;
      state.channels = state.channels.filter(ch => ch.id !== id);
      // Если удалён текущий канал, переключаем на первый доступный
      if (state.currentChannelId === id && state.channels.length > 0) {
        state.currentChannelId = state.channels[0].id;
      }
    },
    renameChannel(state, action) {
      const { id, name } = action.payload;
      const channel = state.channels.find(ch => ch.id === id);
      if (channel) {
        channel.name = name;
      }
    },


    removeMessage(state, action) {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    updateMessageStatus(state, action) {
      const msg = state.messages.find(m => m.id === action.payload.id);
      if (msg) {
        msg.status = action.payload.status;
      }
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })




      // .addCase(fetchChannels.fulfilled, (state, action) => {
      //   state.channels = action.payload;
      //   state.loading = false;
      //   // Если канал не выбран, выбираем первый из списка
      //   if (!state.currentChannelId && action.payload.length > 0) {
      //     state.currentChannelId = action.payload[0].id;
      //   }
      // })



      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.channels = action.payload;
        state.loading = false;
      
        const generalChannel = action.payload.find(ch => ch.name === 'General');
        state.currentChannelId = generalChannel ? generalChannel.id : action.payload[0]?.id || null;
      })



      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setCurrentChannel,
  socketConnected,
  socketDisconnected,
  addMessage,
  addChannel,
  removeChannel,
  renameChannel,
  removeMessage,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;

