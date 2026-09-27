const AUTH_KEY = 'opportunityos_auth';
const USERS_KEY = 'opportunityos_users';

export function getAuthUser() {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

export function registerUser(email, password, name) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }
  const newUser = { email, password, name };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Auto-login
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email, name }));
  return { email, name };
}

export function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email: user.email, name: user.name }));
  return { email: user.email, name: user.name };
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}
