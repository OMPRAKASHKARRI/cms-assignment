import { createSlice } from '@reduxjs/toolkit';

// The public site is almost entirely server-rendered from CMS data (fetched
// directly in Server Components — see lib/api.js), so there's very little
// that belongs in client-side Redux. The one genuinely client-only,
// cross-component piece of state is whether the mobile nav drawer is open.
const uiSlice = createSlice({
  name: 'ui',
  initialState: { mobileNavOpen: false },
  reducers: {
    openMobileNav: (state) => { state.mobileNavOpen = true; },
    closeMobileNav: (state) => { state.mobileNavOpen = false; },
    toggleMobileNav: (state) => { state.mobileNavOpen = !state.mobileNavOpen; },
  },
});

export const { openMobileNav, closeMobileNav, toggleMobileNav } = uiSlice.actions;
export default uiSlice.reducer;
