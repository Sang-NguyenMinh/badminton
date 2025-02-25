import axios from 'axios';
import { getDataSecure } from '../libs/storage';
import { EXPO_PUBLIC_ROOT_API_URL } from '@/configs/config';

const EXPO_PUBLIC_API_URL = EXPO_PUBLIC_ROOT_API_URL;

const api = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getDataSecure('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sendMessage = (conversationId: string, content: string) => api.post(`/api/v1/conversations/${conversationId}/messages`, { content });
