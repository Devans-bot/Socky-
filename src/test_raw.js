const url = `https://w7ebp0qv.api.sanity.io/v2023-05-03/data/query/socks-data?query=*`;
fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("RAW RESPONSE:", JSON.stringify(data, null, 2).slice(0, 500));
  })
  .catch(err => console.error(err));
