import {apiUrl} from '@api/client';

export const formatImageUrl = (url?: string | undefined | null) => {
  if (!url) {
    return '';
  }
  // if url has localhost:9000, replace with the actual backend url
  if (url.includes('http://localhost:9000')) {
    return url.replace('http://localhost:9000', apiUrl);
  }
  return url;
};
