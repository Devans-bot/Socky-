// Query to get all categories and the first image of a sock from each category
export const GET_ALL_CATEGORY = `*[_type == "category"] {
  _id,
  name,
  "slug": slug.current,
  description,
  "imageUrl": *[_type == "product" && references(^._id)][0].thumbnail.asset->url
}`;
