/**
 * Waypoint API Client
 * Automatically manages Bearer JWT headers and standardizes global envelope parsing.
 */

export class ApiError extends Error {
  constructor(message, code = 'API_ERROR', details = null, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Core fetch wrapper handling authorization headers and envelope unwrapping.
 * @param {string} endpoint - Relative API path (e.g. '/auth/login/' or 'auth/login/')
 * @param {RequestInit} [options] - Standard Fetch API options
 * @returns {Promise<any>} Unwrapped data payload
 */
export async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${cleanEndpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Automatically attach Bearer token if present
  try {
    const token = localStorage.getItem('waypoint_access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // LocalStorage might be restricted in some iframe contexts
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      'Unable to connect to Waypoint server. Please ensure the backend is running.',
      'NETWORK_ERROR',
      null,
      0
    );
  }

  let json = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      json = await response.json();
    } catch {
      json = null;
    }
  }

  // Handle successful response
  if (response.ok) {
    if (json && typeof json === 'object') {
      if (json.success === true && json.data !== undefined) {
        return json.data;
      }
      return json;
    }
    return null;
  }

  // Handle 401 Unauthorized - Clean up stale credentials if present
  if (response.status === 401) {
    try {
      const hadToken = !!localStorage.getItem('waypoint_access_token');
      localStorage.removeItem('waypoint_access_token');
      localStorage.removeItem('waypoint_refresh_token');
      localStorage.removeItem('waypoint_user');
      if (hadToken && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('waypoint_auth_expired'));
      }
    } catch {}
  }

  // Extract structured backend error from { success: false, error: { code, message, details } }
  const errorObj = json?.error || {};
  const errorCode = errorObj.code || (response.status === 401 ? 'AUTHENTICATION_FAILED' : 'REQUEST_FAILED');
  const errorMessage = errorObj.message || response.statusText || 'Request failed';
  const errorDetails = errorObj.details || null;

  throw new ApiError(errorMessage, errorCode, errorDetails, response.status);
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) =>
    request(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),
  put: (endpoint, body, options) =>
    request(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
