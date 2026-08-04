const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const buildApiUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const fetchJson = async (path, options = {}) => {
  const response = await fetch(buildApiUrl(path), options);
  const rawText = await response.text();

  let payload = rawText;
  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = rawText;
    }
  }

  if (!response.ok) {
    if (payload && typeof payload === 'object' && payload.message) {
      throw payload;
    }

    throw new Error(payload || `Request failed with status ${response.status}`);
  }

  return payload;
};
