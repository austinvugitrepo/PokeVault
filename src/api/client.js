// Error with HTTP status and response data
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Default messages when the server sends none
const FALLBACKS = {
  400: 'Invalid input.',
  401: 'Not signed in.',
  429: 'Too many attempts.',
  500: 'Server error.',
};

// Parse JSON safely; empty or invalid body -> null
async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Shared fetch wrapper for all API calls
async function request(path, { body, headers, ...options } = {}) {
  // Send session cookie with every request
  const init = { credentials: 'include', ...options, headers: { ...headers } };
  // Encode body as JSON when given
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  // Network failure (server down)
  let response;
  try {
    response = await fetch(path, init);
  } catch {
    throw new ApiError("Can't reach the server.", 0, null);
  }

  // Throw readable error on non-2xx
  const data = await parseBody(response);
  if (!response.ok) {
    const message =
      (data && data.error) ||
      FALLBACKS[response.status] ||
      `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, data);
  }
  return data;
}

// Helpers for each HTTP method
export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
