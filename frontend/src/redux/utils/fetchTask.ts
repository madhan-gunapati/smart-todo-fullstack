import { createAsyncThunk } from '@reduxjs/toolkit';

import { setTasks } from '../slices/ taskSlice';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
    
  try {
    
    const response = await fetch('http://localhost:8000/tasks'); 
    const data = await response.json();
    thunkAPI.dispatch(setTasks(data));
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    
  }
});
