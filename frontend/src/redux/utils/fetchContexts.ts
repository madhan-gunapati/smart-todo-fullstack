import { createAsyncThunk } from '@reduxjs/toolkit';

import { setContexts } from '../slices/contextSlice';

export const fetchContexts = createAsyncThunk('contexts/fetchContexts', async (_, thunkAPI) => {
    
  try {
    
    const response = await fetch('http://localhost:8000/contexts'); 
    const data = await response.json();
    thunkAPI.dispatch(setContexts(data));
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    
  }
});
