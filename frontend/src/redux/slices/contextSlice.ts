import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTasks } from '../utils/fetchTask';


interface ContextEntry {
  id: number;
  content: string;
  source: 'notes' | 'email' | 'whatsapp';
  timestamp: string;
}

interface ContextState {
  entries: ContextEntry[];
}

const initialState: ContextState = {
  entries: [],
};

// Async thunk to send data to DB before adding to state
export const addContextEntryAsync = createAsyncThunk(
  'context/addContextEntryAsync',
  async (entry: ContextEntry, thunkAPI) => {
    try {
      // Replace this with your actual API endpoint
      const response = await fetch('http://localhost:8000/modify', 
        {
          method:'POST' , 
          headers:{
                    'Content-Type':'Application/json',
                    'Accept':'Application/json'
                  },
          body: JSON.stringify(entry)});

      if(!response.ok){
        alert('Error in storinf the task')
        return thunkAPI.rejectWithValue('Failed to add entry');
      }
      fetchTasks()
      return entry 
    } catch (error) {
      console.log(error)
      alert('Error in saving the Context')
      return thunkAPI.rejectWithValue('Failed to add entry');
    }
  }
);

export const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    // Still keeping this if you ever want to add entries directly
    addContextEntry: (state, action: PayloadAction<ContextEntry>) => {
      state.entries.push(action.payload);
    },
    setContexts:(state, action)=>{
      
      state.entries = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addContextEntryAsync.fulfilled, (state, action: PayloadAction<ContextEntry>) => {
      state.entries.push(action.payload);
    });
  },
});

export const { addContextEntry , setContexts } = contextSlice.actions;
export default contextSlice.reducer;
