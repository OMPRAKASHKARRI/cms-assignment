import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Bootstraps auth state from localStorage so a page refresh doesn't kick the
// admin back to the login screen.
const initialState = {
  accessToken: localStorage.getItem('cms_access_token') || null,
  refreshToken: localStorage.getItem('cms_refresh_token') || null,
  admin: JSON.parse(localStorage.getItem('cms_admin') || 'null'),
  isAuthenticated: !!localStorage.getItem('cms_access_token'),
  status: 'idle',
  error: null,
};

export const loginAdmin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logoutAdmin = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Even if the server call fails (e.g. token already expired), we still
    // want to clear local state below.
  } finally {
    dispatch(logout());
  }
});

const persist = (state) => {
  if (state.accessToken) localStorage.setItem('cms_access_token', state.accessToken);
  if (state.refreshToken) localStorage.setItem('cms_refresh_token', state.refreshToken);
  if (state.admin) localStorage.setItem('cms_admin', JSON.stringify(state.admin));
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      persist(state);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem('cms_access_token');
      localStorage.removeItem('cms_refresh_token');
      localStorage.removeItem('cms_admin');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.admin = action.payload.admin;
        persist(state);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
