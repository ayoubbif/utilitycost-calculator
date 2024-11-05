import { getCsrfToken } from './formatters';

export const fetchWithCSRF = async (url, options = {}) => {
  const csrfToken = getCsrfToken();
  const defaultHeaders = {
    'X-CSRFToken': csrfToken,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'An error occurred');
  }

  return response;
};
