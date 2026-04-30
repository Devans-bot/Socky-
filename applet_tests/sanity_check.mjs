import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'w7ebp0qv',
  dataset: 'socks-data',
  useCdn: false, // Bypass CDN to get the freshest data
  apiVersion: '2023-05-03',
});

async function run() {
  const query = `*[_type == "product" && is_featured == true]`;
  const result = await client.fetch(query);
  console.log(`Found ${result.length} featured socks`);
  
  const allProducts = await client.fetch(`*[_type == "product"]{ name, is_featured }`);
  console.log("Total products:", allProducts.length);
  // console.log("A few products:", allProducts.slice(0, 5));
}
run();
