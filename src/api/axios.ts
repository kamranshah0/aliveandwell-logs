import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // cookies allow (refresh token)
});

// ================================
// ACCESS TOKEN (MEMORY ONLY)
// ================================
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

// ================================
// RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const errorCode = error.response?.data?.errorCode;
      const detectedIp = error.response?.data?.detectedIp;

      if (errorCode === 'IP_RESTRICTED') {
        // Prevent infinite loop if already on the unauthorized page
        if (window.location.pathname !== '/unauthorized-access') {
          const redirectUrl = detectedIp 
            ? `/unauthorized-access?ip=${detectedIp}` 
            : '/unauthorized-access';
          window.location.href = redirectUrl;
        }
      }
    }
    return Promise.reject(error);
  }
);

// ================================
// REQUEST INTERCEPTOR
// ================================
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});