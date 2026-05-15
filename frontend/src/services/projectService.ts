import api from './api';

export const projectService = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProjectById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: any) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: any) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};
