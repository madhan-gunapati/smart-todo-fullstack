// taskThunks.ts
import { AppDispatch } from '../store';

import { addTask , Task } from '../slices/ taskSlice';
import { v4 as uuidv4 } from 'uuid';

interface TaskInput {
  title: string;
  description: string;
  category: string;
  deadline: string;
  priority: number;
  status: string;
}

export const createTask = (taskData: TaskInput) => async (dispatch: AppDispatch) => {
  try {
    const taskWithId: Task = {
      ...taskData, id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      context: ''
    };
    
    // Replace '/api/tasks' with your backend endpoint
    const res = await fetch('http://localhost:8000/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskWithId),
    });

    if (!res.ok) {
      console.log(res.statusText)
      throw new Error('Failed to save task');
    }

    // Optionally, you can wait for the response and use returned data
    dispatch(addTask(taskWithId));
  } catch (error) {
    alert('Error creating task, Try Again....')
    console.error('Error creating task:', error);
  }
};
