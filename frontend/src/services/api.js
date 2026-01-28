import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging en desarrollo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==========================================
// GRADES
// ==========================================
export const gradeService = {
  getAll: () => api.get('/grades'),
  getById: (id) => api.get(`/grades/${id}`),
  create: (data) => api.post('/grades', data),
  update: (id, data) => api.put(`/grades/${id}`, data),
  delete: (id) => api.delete(`/grades/${id}`),
};

// ==========================================
// STUDENTS
// ==========================================
export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getByGrade: (gradeId) => api.get(`/students/grade/${gradeId}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// ==========================================
// ATTENDANCES (preparado para futuro)
// ==========================================
export const attendanceService = {
  getAll: () => api.get('/attendances'),
  getByDate: (date) => api.get(`/attendances/date/${date}`),
  getByStudent: (studentId) => api.get(`/attendances/student/${studentId}`),
  create: (data) => api.post('/attendances', data),
  update: (id, data) => api.put(`/attendances/${id}`, data),
  delete: (id) => api.delete(`/attendances/${id}`),
};

export default api;
