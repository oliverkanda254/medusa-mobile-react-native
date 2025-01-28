import Medusa from '@medusajs/js-sdk';
import {MEDUSA_BACKEND_URL, PUBLISHABLE_API_KEY} from '@env';

export const apiUrl = MEDUSA_BACKEND_URL || 'http://localhost:9000';

const publishableKey = PUBLISHABLE_API_KEY || '';

const apiClient = new Medusa({
  baseUrl: apiUrl,
  publishableKey: publishableKey,
});

export default apiClient;
