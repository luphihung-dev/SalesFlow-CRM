const TOKEN_KEY = 'mini-crm-token';
const USER_KEY = 'mini-crm-user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  },
  setSession: ({ token, tokenType, ...user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem('mini-crm-session', JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('mini-crm-session');
  },
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY))
};
