import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'w7ebp0qv',
  dataset: 'socks-data',
  useCdn: true,
  apiVersion: '2023-05-03',
});

const FEATURED_SOCKS_QUERY = `*[_type == "product" && is_featured == true] {
  _id, name, slug, price, sale_price,
  "thumbnailUrl": thumbnail.asset->url
}`;

async function test() {
  const data = await client.fetch(FEATURED_SOCKS_QUERY);
  console.log("FEATURED SOCKS:", JSON.stringify(data, null, 2));
}

test();
