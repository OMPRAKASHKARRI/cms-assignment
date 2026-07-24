import { createSlice } from '@reduxjs/toolkit';

// Cross-cutting UI state: a global loading flag any async action can flip,
// and the theme toggle. Everything else (form field values, modal-open
// booleans local to one component) stays in component state.
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    globalLoading: false,
    theme: localStorage.getItem('cms_theme') || 'light',
  },
  reducers: {
    setGlobalLoading: (state, action) => { state.globalLoading = action.payload; },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('cms_theme', state.theme);
    },
  },
});

export const { setGlobalLoading, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
