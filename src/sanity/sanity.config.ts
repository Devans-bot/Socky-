import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Socky E-commerce Studio',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'w7ebp0qv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'socks-data',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Our Store')
          .items([
            // Add a dedicated Products folder with filtered views
            S.listItem()
              .title('Products')
              .child(
                S.list()
                  .title('Manage Products')
                  .items([
                    S.listItem()
                      .title('All Products')
                      .child(S.documentTypeList('product').title('All Products')),
                    S.listItem()
                      .title('Products by Category')
                      .child(
                        S.documentTypeList('category')
                          .title('Select Category')
                          .child((categoryId) =>
                            S.documentTypeList('product')
                              .id(`category-products-${categoryId}`)
                              .title('Socks in Category')
                              .filter('_type == "product" && category._ref == $categoryId')
                              .params({ categoryId })
                          )
                      ),
                    S.listItem()
                      .title('Featured Products')
                      .child(
                        S.documentTypeList('product')
                          .id('featured-products-list')
                          .title('Featured Products')
                          .filter('_type == "product" && is_featured == true')
                      ),
                    S.listItem()
                      .title('New Arrivals')
                      .child(
                        S.documentTypeList('product')
                          .id('new-arrivals-list')
                          .title('New Arrivals')
                          .filter('_type == "product" && is_new == true')
                      ),
                    S.listItem()
                      .title('Bestsellers')
                      .child(
                        S.documentTypeList('product')
                          .id('bestsellers-list')
                          .title('Bestsellers (Top Ordered)')
                          .filter('_type == "product" && defined(ordered_numbers)')
                          .defaultOrdering([{ field: 'ordered_numbers', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Rating')
                      .child(
                        S.documentTypeList('product')
                          .id('rating-list')
                          .title('Rating (By Reviews)')
                          .filter('_type == "product" && defined(reviews_count)')
                          .defaultOrdering([{ field: 'reviews_count', direction: 'desc' }])
                      ),
                  ])
              ),
            // Dedicated Categories item for editing names/descriptions
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),
            // Divider
            S.divider(),
            // All other document types except product and category
            ...S.documentTypeListItems().filter(
              (listItem) => !['product', 'category'].includes(listItem.getId() as string)
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
