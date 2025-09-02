
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// API Configuration
interface ApiConfig {
  params?: Record<string, any>;
  responseType?: 'json' | 'blob';
  headers?: Record<string, string>;
}

// Helper to build query string
const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      query.append(key, params[key].toString());
    }
  });
  return query.toString();
};

// API instance with full configuration support
const api = {
  get: async (url: string, config?: ApiConfig): Promise<any> => {
    try {
      let finalUrl = url;
      if (config?.params) {
        const queryString = buildQueryString(config.params);
        finalUrl = `${url}${queryString ? `?${queryString}` : ''}`;
      }
      
      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers
        }
      });
      
      if (config?.responseType === 'blob') {
        return await response.blob();
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async (url: string, data?: any, config?: ApiConfig): Promise<any> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers
        },
        body: data ? JSON.stringify(data) : undefined
      });
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  put: async (url: string, data?: any, config?: ApiConfig): Promise<any> => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers
        },
        body: data ? JSON.stringify(data) : undefined
      });
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  patch: async (url: string, data?: any, config?: ApiConfig): Promise<any> => {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers
        },
        body: data ? JSON.stringify(data) : undefined
      });
      return await response.json();
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  },

  delete: async (url: string, config?: ApiConfig): Promise<any> => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers
        }
      });
      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};

export default api;

// API helper functions - Backward compatibility
export const apiGet = (url: string, config?: ApiConfig) => api.get(url, config);
export const apiPost = (url: string, data?: any, config?: ApiConfig) => api.post(url, data, config);
export const apiPut = (url: string, data?: any, config?: ApiConfig) => api.put(url, data, config);
export const apiPatch = (url: string, data?: any, config?: ApiConfig) => api.patch(url, data, config);
export const apiDelete = (url: string, config?: ApiConfig) => api.delete(url, config);
