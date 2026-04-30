import { client } from './client';

interface SanityFetchOptions<TParams = Record<string, unknown>> {
  query: string;
  params?: TParams;
}

/**
 * Thin typed wrapper around client.fetch that mirrors the next-sanity
 * `sanityFetch({ query, params })` API so this project can adopt the
 * same call-site convention without depending on next-sanity.
 */
export async function sanityFetch<TResult = unknown, TParams = Record<string, unknown>>({
  query,
  params = {} as TParams,
}: SanityFetchOptions<TParams>): Promise<{ data: TResult }> {
  const data = await client.fetch<TResult>(query, params as Record<string, unknown>);
  return { data };
}
