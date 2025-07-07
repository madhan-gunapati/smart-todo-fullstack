import { configureStore } from '@reduxjs/toolkit';

import taskReducer from './slices/ taskSlice';
import contextReducer from './slices/contextSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    context: contextReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;