export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    { name: 'orderNumber', title: 'Order Number', type: 'string' },
    { name: 'customer', title: 'Customer', type: 'reference', to: [{ type: 'customer' }] },
    { name: 'items', title: 'Items', type: 'array', of: [{ type: 'orderItem' }] },
    { name: 'total', title: 'Total', type: 'number' },
    { name: 'status', title: 'Status', type: 'string', options: { list: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] } },
    { name: 'shippingType', title: 'Shipping Type', type: 'reference', to: [{ type: 'shipping' }] }
  ]
}
