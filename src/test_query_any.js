const query = encodeURIComponent('*[]{ _id, _type }');
const url = `https://w7ebp0qv.api.sanity.io/v2023-05-03/data/query/socks-data?query=${query}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("EVERYTHING:", JSON.stringify(data.result, null, 2));
  })
  .catch(err => console.error(err));
