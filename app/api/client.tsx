import Medusa from '@medusajs/js-sdk';
import {MEDUSA_BACKEND_URL, PUBLISHABLE_API_KEY} from '@env';

export const apiUrl = MEDUSA_BACKEND_URL || 'http://localhost:9000';

const apiClient = new Medusa({
  baseUrl: apiUrl,
  publishableKey: PUBLISHABLE_API_KEY,
  debug: true,
});

export default apiClient;
