import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

const initialState = {
  channels: [],
  currentChannelId: null,
  messages: [],
  loading: false,
  error: null,
  socketConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    socketConnected: (state) => {
      state.socketConnected = true;
    },
    socketDisconnected: (state) => {
      state.socketConnected = false;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(ch => ch.id !== action.payload.id);
      if (state.currentChannelId === action.payload.id) {
        state.currentChannelId = state.channels[0]?.id || null;
      }
    },
    renameChannel: (state, action) => {
      const channel = state.channels.find(ch => ch.id === action.payload.id);
      if (channel) channel.name = action.payload.name;
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    updateMessageStatus: (state, action) => {
      const msg = state.messages.find(m => m.id === action.payload.id);
      if (msg) msg.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
        const generalChannel = action.payload.find(ch => 
          ch.name.toLowerCase() === 'general'
        );
        state.currentChannelId = generalChannel?.id || action.payload[0]?.id || null;
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
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
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
