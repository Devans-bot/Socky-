import { createClient } from '@sanity/client';

export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'w7ebp0qv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'socks-data',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});
