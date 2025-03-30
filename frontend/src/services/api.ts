import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing token

// Define your backend base URL. Adjust if your backend runs elsewhere.
// For Expo Go app on physical device, use your computer's local IP address.
// For simulators/emulators, localhost might work.
const API_BASE_URL = 'http://localhost:5000/api/v1'; // Replace with your backend URL if needed

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API calls
export const signupUser = (userData: any) => api.post('/auth/signup', userData);
export const loginUser = (credentials: any) => api.post('/auth/login', credentials);

// Example protected route call (add more as needed)
// export const getMyProfile = () => api.get('/users/me');

export default api;