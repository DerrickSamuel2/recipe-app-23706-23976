/**
 * Centralized Axios client for Backend API.
 * All persistent data must go through backend; no direct external integrations.
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

// Attach Authorization header if token exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle common error responses
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      // Optionally clear token and redirect to login:
      // localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

/**
 * API surface
 * This wrapper documents typical endpoints used in frontend.
 * Actual backend endpoints must exist in the backend container.
 */
export const AuthAPI = {
  // PUBLIC_INTERFACE
  async loginEmail({ email, password }) {
    /** Email/password login; returns {token, user} */
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  // PUBLIC_INTERFACE
  async registerEmail({ email, password, name }) {
    /** Email registration; returns {token, user} */
    const { data } = await api.post('/auth/register', { email, password, name });
    return data;
  },
  // PUBLIC_INTERFACE
  async requestPasswordReset(email) {
    /** Trigger password reset email. */
    const { data } = await api.post('/auth/password/reset', { email });
    return data;
  },
  // PUBLIC_INTERFACE
  async socialLogin(provider, code) {
    /** OAuth/social login callback exchange; returns {token, user} */
    const { data } = await api.post(`/auth/${provider}/callback`, { code, redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI });
    return data;
  },
  // PUBLIC_INTERFACE
  async me() {
    /** Fetch current user profile. */
    const { data } = await api.get('/users/me');
    return data;
  },
  // PUBLIC_INTERFACE
  async logout() {
    /** Logout user session. */
    const { data } = await api.post('/auth/logout');
    return data;
  },
};

export const UserAPI = {
  // PUBLIC_INTERFACE
  async updateProfile(partial) {
    /** Update user profile fields. */
    const { data } = await api.patch('/users/me', partial);
    return data;
  },
  // PUBLIC_INTERFACE
  async updatePassword(currentPassword, newPassword) {
    /** Update user password securely. */
    const { data } = await api.post('/users/me/password', { currentPassword, newPassword });
    return data;
  },
  // PUBLIC_INTERFACE
  async deleteAccount() {
    /** Deactivate/delete account based on backend policy. */
    const { data } = await api.delete('/users/me');
    return data;
  },
  // PUBLIC_INTERFACE
  async setPreferences(prefs) {
    /** Set dietary preferences/allergies. */
    const { data } = await api.put('/users/me/preferences', prefs);
    return data;
  },
};

export const RecipeAPI = {
  // PUBLIC_INTERFACE
  async search({ q, ingredients = [], diets = [], page = 1 }) {
    /** Search recipes with filters. */
    const { data } = await api.get('/recipes/search', {
      params: { q, ingredients: ingredients.join(','), diets: diets.join(','), page },
    });
    return data;
  },
  // PUBLIC_INTERFACE
  async get(id) {
    /** Get recipe by id. */
    const { data } = await api.get(`/recipes/${id}`);
    return data;
  },
  // PUBLIC_INTERFACE
  async create(payload) {
    /** Create a new recipe. */
    const { data } = await api.post('/recipes', payload);
    return data;
  },
  // PUBLIC_INTERFACE
  async update(id, payload) {
    /** Update recipe. */
    const { data } = await api.patch(`/recipes/${id}`, payload);
    return data;
  },
  // PUBLIC_INTERFACE
  async remove(id) {
    /** Delete recipe. */
    const { data } = await api.delete(`/recipes/${id}`);
    return data;
  },
  // PUBLIC_INTERFACE
  async save(id) {
    /** Save/bookmark recipe. */
    const { data } = await api.post(`/recipes/${id}/save`);
    return data;
  },
  // PUBLIC_INTERFACE
  async unsave(id) {
    /** Remove bookmark. */
    const { data } = await api.delete(`/recipes/${id}/save`);
    return data;
  },
  // PUBLIC_INTERFACE
  async rate(id, rating, review) {
    /** Rate and review recipe. */
    const { data } = await api.post(`/recipes/${id}/reviews`, { rating, review });
    return data;
  },
  // PUBLIC_INTERFACE
  async recommendations() {
    /** Personalized recipe recommendations. */
    const { data } = await api.get('/recipes/recommendations');
    return data;
  },
};

export const MealPlanAPI = {
  // PUBLIC_INTERFACE
  async get(period = 'week', startDate) {
    /** Get meal plan for period (week/month) starting at startDate. */
    const { data } = await api.get('/meal-plans', { params: { period, startDate } });
    return data;
  },
  // PUBLIC_INTERFACE
  async setEntry(date, mealType, recipeId, servings = 1) {
    /** Assign recipe to date/mealType. */
    const { data } = await api.post('/meal-plans/entries', { date, mealType, recipeId, servings });
    return data;
  },
  // PUBLIC_INTERFACE
  async removeEntry(entryId) {
    /** Remove meal plan entry. */
    const { data } = await api.delete(`/meal-plans/entries/${entryId}`);
    return data;
  },
  // PUBLIC_INTERFACE
  async savePlan(name) {
    /** Save current meal plan snapshot. */
    const { data } = await api.post('/meal-plans/save', { name });
    return data;
  },
  // PUBLIC_INTERFACE
  async groceryList({ startDate, endDate }) {
    /** Generate grocery list for plan window. */
    const { data } = await api.get('/meal-plans/grocery-list', { params: { startDate, endDate } });
    return data;
  },
};

export const SocialAPI = {
  // PUBLIC_INTERFACE
  async follow(userId) {
    /** Follow another user. */
    const { data } = await api.post(`/social/follow/${userId}`);
    return data;
  },
  // PUBLIC_INTERFACE
  async unfollow(userId) {
    /** Unfollow another user. */
    const { data } = await api.delete(`/social/follow/${userId}`);
    return data;
  },
  // PUBLIC_INTERFACE
  async feed() {
    /** Get social activity feed. */
    const { data } = await api.get('/social/feed');
    return data;
  },
  // PUBLIC_INTERFACE
  async shareRecipe(recipeId, target = 'in-app') {
    /** Share recipe - handled by backend to external services if applicable. */
    const { data } = await api.post(`/recipes/${recipeId}/share`, { target });
    return data;
  },
  // PUBLIC_INTERFACE
  async communities() {
    /** List/join communities. */
    const { data } = await api.get('/communities');
    return data;
  },
  // PUBLIC_INTERFACE
  async joinCommunity(id) {
    const { data } = await api.post(`/communities/${id}/join`);
    return data;
  },
};

export const PremiumAPI = {
  // PUBLIC_INTERFACE
  async status() {
    /** Get premium subscription status for current user. */
    const { data } = await api.get('/premium/status');
    return data;
  },
  // PUBLIC_INTERFACE
  async subscribe(planId) {
    /** Subscribe to premium plan; backend handles provider integration. */
    const { data } = await api.post('/premium/subscribe', { planId });
    return data;
  },
  // PUBLIC_INTERFACE
  async cancel() {
    const { data } = await api.post('/premium/cancel');
    return data;
  },
};
