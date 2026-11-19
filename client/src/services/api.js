import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch unswiped profiles eligible for the demo user
 */
export const getFeed = async () => {
  const response = await api.get('/feed');
  return response.data;
};

/**
 * Record a swipe (like or pass)
 * @param {string} targetUserId
 * @param {'like' | 'pass'} action
 */
export const swipeProfile = async (targetUserId, action) => {
  const response = await api.post('/swipe', {
    targetUserId,
    action,
  });
  return response.data;
};

/**
 * Fetch all mutual matches for the demo user
 */
export const getMatches = async () => {
  const response = await api.get('/matches');
  return response.data;
};

/**
 * Fetch demo user profile details
 */
export const getDemoUser = async () => {
  const response = await api.get('/me');
  return response.data;
};

/**
 * Reset demo swipes & matches back to initial state
 */
export const resetDemo = async () => {
  const response = await api.post('/reset');
  return response.data;
};

export default api;
