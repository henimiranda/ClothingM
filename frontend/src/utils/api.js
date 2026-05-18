const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('Using API URL:', API_URL); // Debugging

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  } catch (error) {
    console.error('Login Fetch Error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error('Register Fetch Error:', error);
    throw error;
  }
};
