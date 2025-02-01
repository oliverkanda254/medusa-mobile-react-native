import Medusa from '@medusajs/js-sdk';
import {MEDUSA_BACKEND_URL, PUBLISHABLE_API_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiUrl = MEDUSA_BACKEND_URL || 'http://localhost:9000';

const publishableKey = PUBLISHABLE_API_KEY || '';
export const AUTH_TOKEN_KEY = 'auth_token';

const apiClient = new Medusa({
  baseUrl: apiUrl,
  publishableKey: publishableKey,
  auth: {
    type: 'jwt',
    jwtTokenStorageMethod: 'memory',
  },
});

// Medusa JS sdk doesn't support RN completely
// Working around it by manually setting the token with memory storage

AsyncStorage.getItem(AUTH_TOKEN_KEY).then(token => {
  if (token) {
    apiClient.client.setToken(token);
  }
});

export default apiClient;
