// Query all products
export const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id, name, slug, description, price, sale_price, color, sizes, material, gender, season, fit, rating, reviews_count, ordered_numbers, stock, is_featured, is_new, search_tags,
  "categoryName": category->name,
  "thumbnailUrl": thumbnail.asset->url,
  "imageUrls": images[].asset->url
}`;

// Single product by slug
export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id, name, slug, description, price, sale_price, color, sizes, material, gender, season, fit, rating, reviews_count, ordered_numbers, stock, is_featured, is_new, search_tags,
  "categoryName": category->name,
  "thumbnailUrl": thumbnail.asset->url,
  "imageUrls": images[].asset->url
}`;

// Bestsellers query (Strictly highest ordered_numbers to lowest, up to 8 products)
export const BESTSELLERS_SOCKS_QUERY = `*[_type == "product" && defined(ordered_numbers)] | order(ordered_numbers desc)[0...8] {
  _id, name, slug, price, sale_price, rating, reviews_count, ordered_numbers,
  "thumbnailUrl": thumbnail.asset->url
}`;

// Featured query
export const FEATURED_SOCKS_QUERY = `*[_type == "product" && is_featured == true] {
  _id, name, slug, price, sale_price,
  "thumbnailUrl": thumbnail.asset->url
}`;

// New arrivals query
export const NEW_ARRIVALS_QUERY = `*[_type == "product" && is_new == true] | order(_createdAt desc)[0...8] {
  _id, name, slug, price, sale_price,
  "thumbnailUrl": thumbnail.asset->url
}`;

// Rating query (Sort products based on reviews/ratings)
export const HIGHEST_RATED_QUERY = `*[_type == "product" && defined(reviews_count)] | order(reviews_count desc)[0...8] {
  _id, name, slug, price, sale_price, rating, reviews_count,
  "thumbnailUrl": thumbnail.asset->url
}`;
