export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'sale_price', title: 'Sale Price', type: 'number' },
    { 
      name: 'color', 
      title: 'Color', 
      type: 'object',
      fields: [
        { name: 'primary', title: 'Primary', type: 'string' },
        { name: 'secondary', title: 'Secondary', type: 'string' }
      ]
    },
    { name: 'sizes', title: 'Sizes', type: 'array', of: [{ type: 'string' }] },
    { name: 'material', title: 'Material', type: 'string' },
    { name: 'gender', title: 'Gender', type: 'string' },
    { name: 'season', title: 'Season', type: 'string' },
    { name: 'fit', title: 'Fit', type: 'string' },
    { name: 'rating', title: 'Rating', type: 'number' },
    { name: 'reviews_count', title: 'Reviews Count', type: 'number' },
    { name: 'stock', title: 'Stock', type: 'number' },
    { name: 'ordered_numbers', title: 'Ordered Numbers (Sales)', type: 'number' },
    { name: 'is_featured', title: 'Is Featured', type: 'boolean' },
    { name: 'is_new', title: 'Is New', type: 'boolean' },
    { name: 'search_tags', title: 'Search Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } },
    { name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }
  ]
}
