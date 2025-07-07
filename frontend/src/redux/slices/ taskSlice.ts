import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  createdAt: string;
  updatedAt: string;
  context: string;
  id:string
  title: string;
  description: string;
  category: string;
  deadline: string;
  priority: number;
  status: string;
}

const initialState: Task[] = [];

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
        
      state.push({...action.payload });
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const { addTask, setTasks } = taskSlice.actions;
export default taskSlice.reducer;

