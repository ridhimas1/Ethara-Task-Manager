import api from './api';

export const taskService = {
  getTasks: async (params?: { projectId?: string; status?: string }) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  createTask: async (data: any) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: any) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};
