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

// Search products by tags
// Usage: client.fetch(SEARCH_PRODUCTS_QUERY, { query: "ankle*" })
// The caller should append "*" to the input string for prefix/partial matching,
// e.g. query = `${userInput}*`
// --- Filter / Sort Queries ---
// Flexible query that handles category, search, and ordering
export const PRODUCT_FILTER_QUERY = `*[_type == "product" && 
  ($categorySlug == "" || category->slug.current == $categorySlug) &&
  ($query == "" || name match $query || count(search_tags[@ match $query]) > 0) &&
  ($color == "" || color match $color || count(search_tags[@ match $color]) > 0) &&
  ($material == "" || material match $material || count(search_tags[@ match $material]) > 0) &&
  (coalesce(sale_price, price) >= $minPrice) &&
  ($maxPrice == 0 || coalesce(sale_price, price) <= $maxPrice) &&
  ($inStock == false || stock > 0)
]`;

// Helper to append fields and ordering to the filter
const PRODUCT_FIELDS = `{
  _id, name, slug, price, sale_price, rating, reviews_count, ordered_numbers,
  "thumbnailUrl": thumbnail.asset->url
}`;

// Filter: Price low → high (cheapest first)
export const FILTER_PRODUCTS_BY_PRICE_ASC_QUERY = `${PRODUCT_FILTER_QUERY} | order(coalesce(sale_price, price) asc) ${PRODUCT_FIELDS}`;

// Filter: Price high → low (most expensive first)
export const FILTER_PRODUCTS_BY_PRICE_DESC_QUERY = `${PRODUCT_FILTER_QUERY} | order(coalesce(sale_price, price) desc) ${PRODUCT_FIELDS}`;

// Filter: Highest rated first (by rating, then reviews_count as tiebreaker)
export const FILTER_PRODUCTS_BY_RATING_QUERY = `${PRODUCT_FILTER_QUERY} | order(rating desc, reviews_count desc) ${PRODUCT_FIELDS}`;

// Filter: Bestselling first (highest ordered_numbers)
export const FILTER_PRODUCTS_BY_BESTSELLING_QUERY = `${PRODUCT_FILTER_QUERY} | order(ordered_numbers desc) ${PRODUCT_FIELDS}`;

// Filter: Alphabetical
export const FILTER_PRODUCTS_BY_NAME_QUERY = `${PRODUCT_FILTER_QUERY} | order(name asc) ${PRODUCT_FIELDS}`;

// Search products by tags (re-using the flexible query logic)
export const SEARCH_PRODUCTS_QUERY = `${PRODUCT_FILTER_QUERY} | order(ordered_numbers desc) ${PRODUCT_FIELDS}`;

// Fetch strictly the stock count for a specific product by slug
export const GET_STOCKS_OF_PRODUCT_BY_SLUG = `*[_type == "product" && slug.current == $slug][0] { stock }`;
