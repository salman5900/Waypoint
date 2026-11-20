/**
 * Waypoint Trip API Service
 * Handles network requests for trip generation, saved trip history, and emailing roadmaps.
 * Conforms to Django backend endpoints:
 * - POST /api/trips/generate/
 * - GET  /api/trips/
 * - GET  /api/trips/:id/
 * - POST /api/trips/:id/email-roadmap/
 */

import { apiClient, ApiError } from './apiClient';

/**
 * Generates an AI-curated travel roadmap via backend Gemini service
 * @param {Object} params
 * @param {string} params.origin - Departure airport/city (e.g., "Kochi" or "SFO")
 * @param {string} params.destination - Target travel destination (e.g., "Tokyo, Japan")
 * @param {number} params.days - Duration in days (e.g., 3)
 * @param {number} [params.members=2] - Number of travelers
 * @param {number|null} [params.budget] - Target budget amount
 * @param {string} [params.currency='USD'] - Currency code
 * @param {string} [params.travelStyle] - e.g. "Cultural & Budget-Friendly"
 * @param {string} [params.extraNotes] - Custom preferences or wishlist items
 * @returns {Promise<{ id: number, origin: string, destination: string, days: number, itinerary: Object }>}
 */
export async function generateTrip(params) {
  const payload = {
    origin: params.origin?.trim() || 'San Francisco',
    destination: params.destination?.trim() || 'Tokyo, Japan',
    days: Number(params.days) || 3,
    members: Number(params.members) || 2,
    budget: params.budget !== undefined && params.budget !== null ? Number(params.budget) : null,
    currency: params.currency || 'USD',
    travelStyle: params.travelStyle || 'Relaxed & Scenic',
    extraNotes: params.extraNotes || params.notes || '',
  };

  return apiClient.post('/trips/generate/', payload);
}

/**
 * Lists all trip plans created by the authenticated user
 * @returns {Promise<Array<{ id: number, tripTitle: string, origin: string, destination: string, days: number, members: number, budget: string, currency: string, travelStyle: string, createdAt: string }>>}
 */
export async function getSavedTrips() {
  return apiClient.get('/trips/');
}

/**
 * Retrieves full itinerary details for a trip by ID
 * @param {number|string} tripId
 * @returns {Promise<{ id: number, tripTitle: string, origin: string, destination: string, days: number, members: number, budget: string, currency: string, travelStyle: string, extraNotes: string, createdAt: string, itinerary: Object }>}
 */
export async function getTripDetail(tripId) {
  if (!tripId) throw new ApiError('Trip ID is required to fetch details', 'VALIDATION_ERROR', null, 400);
  return apiClient.get(`/trips/${tripId}/`);
}

/**
 * Emails the generated roadmap itinerary to the specified email address
 * @param {number|string} tripId - The backend numeric trip ID
 * @param {string} [email] - Destination email address (required for guest users, optional if authenticated)
 * @returns {Promise<{ trip_id: number, recipient_email: string, status: string, message?: string }>}
 */
export async function emailRoadmap(tripId, email) {
  // If no backend ID (e.g. user is viewing static Tokyo demo trip)
  if (!tripId || String(tripId).startsWith('tokyo-') || tripId === 'sample') {
    // Delay slightly to give physical feel
    await new Promise((r) => setTimeout(r, 650));
    return {
      trip_id: null,
      recipient_email: email || 'traveler',
      status: 'simulated',
      message: `Demo itinerary dispatched to ${email || 'your email'}! To save and email live trips with real flight links, generate a trip using the Planner.`,
    };
  }

  const payload = email ? { email: email.trim() } : {};
  const res = await apiClient.post(`/trips/${tripId}/email-roadmap/`, payload);
  return {
    ...res,
    message: `Roadmap dispatched successfully to ${res.recipient_email || email}!`,
  };
}
