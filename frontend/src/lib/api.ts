import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("bb_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("bb_token");
      localStorage.removeItem("bb_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── Auth ──────────────────────────────────────
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    language: string;
  }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateMe: (data: object) => api.patch("/auth/me", data),
};

// ── Study Planner ─────────────────────────────
export const plannerApi = {
  generate: (data: object) => api.post("/planner/generate", data),
  getAll: () => api.get("/planner"),
  getOne: (id: string) => api.get(`/planner/${id}`),
  updateTask: (planId: string, taskId: string, data: object) =>
    api.patch(`/planner/${planId}/task/${taskId}`, data),
  adjust: (id: string) => api.post(`/planner/${id}/adjust`),
  generateQuiz: (planId: string, taskId: string) => api.post(`/planner/${planId}/task/${taskId}/quiz`),
  delete: (id: string) => api.delete(`/planner/${id}`),
};

// ── Q&A ───────────────────────────────────────
export const qaApi = {
  ask: (data: { question: string; subject?: string; language?: string }) =>
    api.post("/qa/ask", data),
  getAll: (params?: object) => api.get("/qa", { params }),
  getMy: () => api.get("/qa/my"),
  getPending: () => api.get("/qa/pending"),
  getTeacherOverview: () => api.get("/qa/teacher/overview"),
  verify: (id: string, data: { teacherAnswer: string }) =>
    api.patch(`/qa/${id}/verify`, data),
  upvote: (id: string) => api.patch(`/qa/${id}/upvote`),
};

// ── Voice ─────────────────────────────────────
export const voiceApi = {
  ask: (data: {
    transcript: string;
    language?: string;
    subject?: string;
    inputType?: "voice" | "text";
  }) => api.post("/voice/ask", data),
  getHistory: () => api.get("/voice/history"),
  saveToQA: (id: string) => api.post(`/voice/${id}/save-to-qa`),
};

// ── Dashboard ─────────────────────────────────
export const dashboardApi = {
  getSummary: () => api.get("/dashboard/summary"),
};

// ── Community ─────────────────────────────────
export const communityApi = {
  createGroup: (data: any) => api.post("/community/groups", data),
  getGroups: () => api.get("/community/groups"),
  joinGroup: (groupId: string) => api.post(`/community/groups/${groupId}/join`),
  createPost: (groupId: string, data: any) => api.post(`/community/groups/${groupId}/posts`, data),
  getPosts: (groupId: string) => api.get(`/community/groups/${groupId}/posts`),
  upvotePost: (postId: string) => api.put(`/community/posts/${postId}/upvote`),
  createComment: (postId: string, data: any) => api.post(`/community/posts/${postId}/comments`, data),
  summarizePost: (postId: string) => api.post(`/community/posts/${postId}/summarize`),
};

export default api;
