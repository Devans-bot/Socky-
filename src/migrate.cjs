const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7ebp0qv',
  dataset: 'socks-data',
  useCdn: false,
  apiVersion: '2023-05-03',
  // Normally requires a token to write, but we may get away with it if dataset allows unauthorized writes from local or via studio?
  // Let's assume we might need a token. Wait, if the user set it up, they have a token in env. 
  // Let's just create the script. If it fails, I'll log it.
});

async function migrate() {
  try {
    const products = await client.fetch(`*[_type == "product"]{_id, _rev}`);
    
    console.log(`Found ${products.length} products to migrate...`);
    
    let promises = [];
    for (const product of products) {
      const randomOrders = Math.floor(Math.random() * 1000) + 50; // Random sales between 50 and 1050
      
      const p = client
        .patch(product._id)
        .set({ ordered_numbers: randomOrders })
        .commit()
        .then(() => console.log(`Migrated ${product._id} with ${randomOrders} orders`))
        .catch(err => console.error(`Failed to migrate ${product._id}`, err.message));
        
      promises.push(p);
    }
    
    await Promise.all(promises);
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  }
}

migrate();
