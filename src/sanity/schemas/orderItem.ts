export default {
  name: 'orderItem',
  title: 'Order Item',
  type: 'object',
  fields: [
    { name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }] },
    { name: 'quantity', title: 'Quantity', type: 'number' },
    { name: 'price', title: 'Price (at time of order)', type: 'number' },
    { name: 'selected_size', title: 'Selected Size', type: 'string' }
  ]
}
