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

