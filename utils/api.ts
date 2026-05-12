/**
 * Centralized API helper for authenticated and public requests.
 */

import { API_BASE } from '@/contexts/AuthContext';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
  token?: string | null;
}

export async function apiFetch<T = any>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.detail || `HTTP ${res.status}`);
  }
  return data;
}

// ─── Typed API Functions ─────────────────────────────────────────────────────

export interface CourseInfo {
  id: number;
  name: string;
  difficulty: string;
  topic: string;
}

export interface ProfileData {
  id: number;
  username: string;
  major_name: string | null;
  completed_courses: CourseInfo[];
}

export interface RecommendationItem {
  course_name: string;
  difficulty: string;
}

export const api = {
  // Profile
  getProfile: (token: string) =>
    apiFetch<ProfileData>('/profile/', { token }),

  updateMajor: (token: string, major: string) =>
    apiFetch<ProfileData>('/profile/', { method: 'PATCH', token, body: { major } }),

  addCompletedCourses: (token: string, courseNames: string[]) =>
    apiFetch('/profile/courses/', { method: 'POST', token, body: { course_names: courseNames } }),

  removeCompletedCourses: (token: string, courseNames: string[]) =>
    apiFetch('/profile/courses/', { method: 'DELETE', token, body: { course_names: courseNames } }),

  // Data
  getMajors: () =>
    apiFetch<{ id: number; name: string; description: string }[]>('/majors/'),

  getCourses: (major: string) =>
    apiFetch<CourseInfo[]>(`/courses/?major=${major}`),

  // Recommendations
  getRecommendations: (
    type: 'prolog' | 'ai',
    payload: {
      liked_topics?: string[];
      completed_courses?: string[];
      preferred_difficulty?: string;
      major?: string;
    },
    token?: string | null,
  ) =>
    apiFetch(`/recommend/${type}/`, { method: 'POST', body: payload, token }),
};
