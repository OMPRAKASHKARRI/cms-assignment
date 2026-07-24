import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';

export const makeStore = () =>
  configureStore({
    reducer: { ui: uiReducer },
  });
