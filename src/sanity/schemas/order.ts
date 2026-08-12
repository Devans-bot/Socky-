import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'orderNumber', title: 'Order Number', type: 'string' }),
    defineField({ name: 'customer', title: 'Customer', type: 'reference', to: [{ type: 'customer' }] }),
    defineField({ name: 'clerkUserId', title: 'Clerk User ID', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'orderItem' }]
    }),
    defineField({ name: 'subtotal', title: 'Subtotal', type: 'number' }),
    defineField({ name: 'shippingCharge', title: 'Shipping Charge', type: 'number' }),
    defineField({ name: 'total', title: 'Total', type: 'number' }),
    defineField({
      name: 'paymentMode',
      title: 'Payment Mode',
      type: 'string',
      options: { list: [{ title: 'Online (Razorpay)', value: 'Online' }, { title: 'Cash on Delivery', value: 'COD' }] }
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      initialValue: 'Pending',
      options: { list: ['Pending', 'Paid', 'Failed', 'Abandoned'] }
    }),
    defineField({
      name: 'idempotencyKey',
      title: 'Idempotency Key',
      type: 'string',
      description: 'Used to prevent duplicate orders.',
    }),
    defineField({
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      initialValue: 'Placed',
      options: { list: ['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'] }
    }),
    defineField({ name: 'razorpayOrderId', title: 'Razorpay Order ID', type: 'string' }),
    defineField({ name: 'razorpayPaymentId', title: 'Razorpay Payment ID', type: 'string' }),
    defineField({ name: 'trackingLink', title: 'Tracking Link', type: 'url' }),
    defineField({
      name: 'deliveryAddress',
      title: 'Delivery Address',
      type: 'object',
      fields: [
        { name: 'fullName', title: 'Full Name', type: 'string' },
        { name: 'line1', title: 'Address Line 1', type: 'string' },
        { name: 'line2', title: 'Address Line 2', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State', type: 'string' },
        { name: 'pincode', title: 'Pincode', type: 'string' },
        { name: 'phone', title: 'Phone', type: 'string' },
      ]
    }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      status: 'orderStatus',
      total: 'total',
      paymentMode: 'paymentMode',
    },
    prepare({ orderNumber, status, total, paymentMode }: { orderNumber: string; status: string; total: number; paymentMode: string }) {
      return {
        title: `#${orderNumber}`,
        subtitle: `${status} · ${paymentMode} · ₹${total}`,
      }
    }
  },
  orderings: [
    { title: 'Newest First', name: 'createdAtDesc', by: [{ field: 'createdAt', direction: 'desc' as const }] },
  ]
})
