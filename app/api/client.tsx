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
    jwtTokenStorageMethod: 'custom',
    jwtTokenStorageKey: AUTH_TOKEN_KEY,
    storage: AsyncStorage,
  },
});

export default apiClient;
