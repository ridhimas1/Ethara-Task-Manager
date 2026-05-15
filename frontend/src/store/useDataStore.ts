import { create } from 'zustand';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';

interface DataState {
  projects: any[];
  tasks: any[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchTasks: (projectId?: string) => Promise<void>;
  createTask: (data: any) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: string) => Promise<void>;
  optimisticTaskUpdate: (taskId: string, newStatus: string) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  projects: [],
  tasks: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.getProjects();
      set({ projects: data.projects, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTasks: async (projectId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await taskService.getTasks({ projectId });
      set({ tasks: data.tasks, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTask: async (taskData: any) => {
    try {
      const data = await taskService.createTask(taskData);
      set(state => ({ tasks: [...state.tasks, data.task] }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  optimisticTaskUpdate: (taskId: string, newStatus: string) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    }));
  },

  updateTaskStatus: async (taskId: string, newStatus: string) => {
    // Save original in case of failure
    const originalTasks = get().tasks;
    
    // Optimistic UI update
    get().optimisticTaskUpdate(taskId, newStatus);
    
    try {
      await taskService.updateTask(taskId, { status: newStatus });
    } catch (error: any) {
      // Revert on failure
      set({ tasks: originalTasks, error: error.message });
    }
  }
}));
