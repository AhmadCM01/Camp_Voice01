import { Platform } from 'react-native';

// Next.js Web: http://localhost:3000
// FastAPI Backend: http://localhost:8000

// On iOS simulator: http://localhost:8000 works
// On Android emulator: http://10.0.2.2:8000 is required to access host's localhost
// On physical device: Use the actual IP address of your machine, e.g. http://192.168.1.100:8000
const envApiUrl = process.env.EXPO_PUBLIC_API_URL;

const defaultApiUrl =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api/v1'
    : Platform.OS === 'web'
      ? 'http://localhost:8000/api/v1'
      : 'http://localhost:8000/api/v1';

export const API_URL = envApiUrl || defaultApiUrl;
