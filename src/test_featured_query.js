const query = encodeURIComponent(`*[_type == "product" && is_featured == true] {
  _id, name, slug, price, sale_price,
  "thumbnailUrl": thumbnail.asset->url
}`);
const url = `https://w7ebp0qv.api.sanity.io/v2023-05-03/data/query/socks-data?query=${query}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("FEATURED RESULTS:", JSON.stringify(data.result, null, 2));
  })
  .catch(err => console.error(err));
