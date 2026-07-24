import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// CMS content lives in Redux because it's shared across the dashboard list,
// the editor, and (soon) any future "recently edited" widgets — multiple
// disconnected components need the same server state. Editor draft state
// for a single page-in-progress is intentionally NOT here; that stays local
// to PageEditorPage so every keystroke doesn't dispatch a Redux action.
export const fetchPages = createAsyncThunk('pages/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/pages', { params });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load pages');
  }
});

export const fetchPageById = createAsyncThunk('pages/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/pages/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load page');
  }
});

export const createPage = createAsyncThunk('pages/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/pages', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create page');
  }
});

export const updatePage = createAsyncThunk('pages/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/pages/${id}`, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update page');
  }
});

export const setPageStatus = createAsyncThunk('pages/setStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/pages/${id}/status`, { status });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const deletePage = createAsyncThunk('pages/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/pages/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete page');
  }
});

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    items: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentPage: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPageById.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createPage.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.current = action.payload;
        state.items = state.items.map((p) => (p._id === action.payload._id ? action.payload : p));
      })
      .addCase(setPageStatus.fulfilled, (state, action) => {
        state.items = state.items.map((p) => (p._id === action.payload._id ? action.payload : p));
        if (state.current?._id === action.payload._id) state.current = action.payload;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearCurrentPage } = pagesSlice.actions;
export default pagesSlice.reducer;
