const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'w7ebp0qv',
  dataset: 'production', 
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function run() {
  try {
    const data = await client.fetch('*[_type == "product"]{_id, name, is_featured}');
    console.log("FROM production:", data.length);
  } catch (e) {
    console.error("production ERR:", e.message);
  }

  try {
    const client2 = createClient({
      projectId: 'w7ebp0qv',
      dataset: 'socks-data', 
      useCdn: false,
      apiVersion: '2023-05-03',
    });
    const data2 = await client2.fetch('*[_type == "product"]{_id, name, is_featured}');
    console.log("FROM socks-data:", data2.length);
  } catch (e) {
    console.error("socks-data ERR:", e.message);
  }
}
run();
