/**
 * Waypoint Authentication Service
 * Implements classical email/password and passwordless email OTP flows.
 */

import { apiClient } from './apiClient';

export const AUTH_KEYS = {
  ACCESS: 'waypoint_access_token',
  REFRESH: 'waypoint_refresh_token',
  USER: 'waypoint_user',
};

/**
 * Saves auth session tokens and user profile to localStorage
 * @param {{ access: string, refresh: string, user: { id: number, username: string, email: string } }} data 
 */
export function saveAuthSession(data) {
  if (!data) return;
  try {
    if (data.access) localStorage.setItem(AUTH_KEYS.ACCESS, data.access);
    if (data.refresh) localStorage.setItem(AUTH_KEYS.REFRESH, data.refresh);
    if (data.user) localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(data.user));
  } catch (e) {
    console.warn('[authApi] Failed to save session to localStorage', e);
  }
}

/**
 * Clears stored auth session from localStorage
 */
export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_KEYS.ACCESS);
    localStorage.removeItem(AUTH_KEYS.REFRESH);
    localStorage.removeItem(AUTH_KEYS.USER);
  } catch (e) {
    console.warn('[authApi] Failed to clear session from localStorage', e);
  }
}

/**
 * Gets currently cached user profile from localStorage
 * @returns {{ id: number, username: string, email: string } | null}
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Checks if an access token exists in localStorage
 * @returns {boolean}
 */
export function hasStoredToken() {
  try {
    return !!localStorage.getItem(AUTH_KEYS.ACCESS);
  } catch {
    return false;
  }
}

/**
 * Registers a new user with username, email, and password
 * @param {{ username: string, email: string, password: string }} credentials 
 * @returns {Promise<{ access: string, refresh: string, user: { id: number, username: string, email: string } }>}
 */
export async function registerUser({ username, email, password }) {
  const data = await apiClient.post('/auth/register/', {
    username,
    email,
    password,
  });
  saveAuthSession(data);
  return data;
}

/**
 * Authenticates user via identifier (email or username) and password
 * @param {{ identifier: string, password: string }} credentials 
 * @returns {Promise<{ access: string, refresh: string, user: { id: number, username: string, email: string } }>}
 */
export async function loginUser({ identifier, password }) {
  const data = await apiClient.post('/auth/login/', {
    identifier,
    password,
  });
  saveAuthSession(data);
  return data;
}

/**
 * Initiates passwordless login or registration by sending a 6-digit OTP to the user's email
 * @param {string} email 
 * @returns {Promise<{ email: string, expires_in_minutes: number }>}
 */
export async function requestOTP(email) {
  return apiClient.post('/auth/request-otp/', { email });
}

/**
 * Validates the 6-digit OTP code and logs the user in (or signs them up automatically)
 * @param {{ email: string, code: string }} params 
 * @returns {Promise<{ access: string, refresh: string, isNewUser?: boolean, user: { id: number, username: string, email: string } }>}
 */
export async function verifyOTP({ email, code }) {
  const data = await apiClient.post('/auth/verify-otp/', {
    email,
    code: String(code).trim(),
  });
  saveAuthSession(data);
  return data;
}

/**
 * Fetches profile of currently authenticated user from backend
 * @returns {Promise<{ id: number, username: string, email: string }>}
 */
export async function getMe() {
  const user = await apiClient.get('/auth/me/');
  try {
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
  } catch {}
  return user;
}
