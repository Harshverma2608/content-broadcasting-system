/**
 * Auth Service
 * All authentication API calls go here.
 * Replace mock logic with real API calls when backend is ready.
 */
import { MOCK_USERS } from '../utils/mockData';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const authService = {
  async login(email, password) {
    await delay(800); // simulate network

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // Strip password before storing
    const safeUser = Object.fromEntries(
      Object.entries(user).filter(([k]) => k !== 'password')
    );
    localStorage.setItem(TOKEN_KEY, safeUser.token);
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

    return safeUser;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
