const apiUrl =
  process.env.NEXT_PUBLIC_OAUTH_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

export const OAUTH_API_URL = apiUrl.replace(/\/$/, '');
