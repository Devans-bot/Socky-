const queryProd = encodeURIComponent('*[]{ _id, _type }');
const urlProd = `https://w7ebp0qv.api.sanity.io/v2023-05-03/data/query/production?query=${queryProd}`;

fetch(urlProd)
  .then(res => res.json())
  .then(data => {
    console.log("PRODUCTION DATASET:", data.result ? data.result.length : data);
  })
  .catch(err => console.error(err));
