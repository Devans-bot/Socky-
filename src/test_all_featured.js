const query = encodeURIComponent(`*[_type == "product"]{ _id, name, is_featured }`);
const url = `https://w7ebp0qv.api.sanity.io/v2023-05-03/data/query/socks-data?query=${query}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("TOTAL PRODUCTS:", data.result ? data.result.length : "NO RESULT");
    
    const featured = data.result ? data.result.filter(p => p.is_featured === true) : [];
    console.log("Locally calculated featured socks:", featured.length);
    console.table(featured);

    const nonFeatured = data.result ? data.result.filter(p => p.is_featured !== true) : [];
    console.log("A few non-featured:", nonFeatured.slice(0, 3));
  })
  .catch(err => console.error(err));
