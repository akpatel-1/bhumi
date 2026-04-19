import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

export const userClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

userClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const originalConfig = error.config as RetryableRequestConfig | undefined;

    if (!originalConfig || status !== 401) {
      return Promise.reject(error);
    }

    const url = originalConfig.url ?? '';
    const isRefreshCall = url.includes('/user/auth/refresh');
    const isLoginCall = url.includes('/user/auth/verify-otp');

    if (originalConfig._retry || isRefreshCall || isLoginCall) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    try {
      refreshPromise ??= refreshClient
        .post('/user/auth/refresh')
        .then(() => undefined)
        .finally(() => {
          refreshPromise = null;
        });

      await refreshPromise;

      return userClient.request(
        originalConfig as unknown as AxiosRequestConfig
      );
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);
