import Medusa from '@medusajs/medusa-js';
import {MEDUSA_BACKEND_URL, PUBLISHABLE_API_KEY} from '@env';

export const apiUrl = MEDUSA_BACKEND_URL || 'http://localhost:9000';

const apiClient = new Medusa({
  baseUrl: apiUrl,
  publishableApiKey: PUBLISHABLE_API_KEY,
  maxRetries: 3,
});

export default apiClient;
