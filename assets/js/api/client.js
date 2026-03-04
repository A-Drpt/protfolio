/**
 * API client with JWT auth handling
 */

const API_BASE = '/api/admin';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Don't set Content-Type if FormData - let browser handle multipart/form-data
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Send cookies (HttpOnly tokens)
  });

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json') 
    ? await response.json() 
    : await response.text();

  if (!response.ok) {
    // If 401, try to refresh token
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the original request
        return request(endpoint, options);
      }
    }
    throw new ApiError(data.message || 'API Error', response.status, data);
  }

  return data;
}

export async function refreshToken() {
  try {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

// Projects
export async function getProjects() {
  return request('/projects');
}

export async function getProject(id) {
  return request(`/projects/${id}`);
}

export async function createProject(data) {
  const headers = !(data instanceof FormData) ? { 'Content-Type': 'application/json' } : {};
  return request('/projects', {
    method: 'POST',
    headers,
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

export async function updateProject(id, data) {
  // Use _method for PUT with FormData
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    return request(`/projects/${id}`, {
      method: 'POST',
      body: data,
    });
  }
  
  return request(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id) {
  return request(`/projects/${id}`, { method: 'DELETE' });
}

// Skills
export async function getSkills() {
  return request('/skills');
}

export async function createSkill(data) {
  return request('/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSkill(id, data) {
  return request(`/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id) {
  return request(`/skills/${id}`, { method: 'DELETE' });
}

// Experiences
export async function getExperiences() {
  return request('/experiences');
}

export async function createExperience(data) {
  return request('/experiences', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateExperience(id, data) {
  return request(`/experiences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteExperience(id) {
  return request(`/experiences/${id}`, { method: 'DELETE' });
}
