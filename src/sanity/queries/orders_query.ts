// Orders queries for storefront (customer-scoped) and admin

export const MY_ORDERS_QUERY = `
*[_type == "order" && clerkUserId == $clerkUserId] | order(createdAt desc) {
  _id,
  orderNumber,
  orderStatus,
  paymentMode,
  paymentStatus,
  total,
  createdAt,
  items[] {
    productName,
    thumbnailUrl,
    quantity,
    price,
    selected_size
  }
}
`

export const MY_ORDERS_PAGINATED_QUERY = `
{
  "orders": *[_type == "order" && clerkUserId == $clerkUserId] | order(createdAt desc)[$start...$end] {
    _id,
    orderNumber,
    orderStatus,
    paymentMode,
    paymentStatus,
    total,
    createdAt,
    items[] {
      productName,
      thumbnailUrl,
      quantity,
      price,
      selected_size
    }
  },
  "total": count(*[_type == "order" && clerkUserId == $clerkUserId])
}
`

export const ORDER_DETAIL_QUERY = `
*[_type == "order" && _id == $orderId && clerkUserId == $clerkUserId][0] {
  _id,
  orderNumber,
  orderStatus,
  paymentMode,
  paymentStatus,
  subtotal,
  shippingCharge,
  total,
  createdAt,
  trackingLink,
  deliveryAddress,
  razorpayPaymentId,
  items[] {
    productName,
    thumbnailUrl,
    quantity,
    price,
    selected_size,
    product-> { _id, slug }
  }
}
`

export const ALL_ORDERS_ADMIN_QUERY = `
*[_type == "order"] | order(createdAt desc) {
  _id,
  orderNumber,
  orderStatus,
  paymentMode,
  paymentStatus,
  total,
  createdAt,
  trackingLink,
  deliveryAddress,
  items[] {
    productName,
    thumbnailUrl,
    quantity,
    price
  },
  customer-> { name, email }
}
`

export const ADMIN_ORDER_DETAIL_QUERY = `
*[_type == "order" && _id == $orderId][0] {
  _id,
  orderNumber,
  orderStatus,
  paymentMode,
  paymentStatus,
  subtotal,
  shippingCharge,
  total,
  createdAt,
  trackingLink,
  razorpayOrderId,
  razorpayPaymentId,
  deliveryAddress,
  items[] {
    productName,
    thumbnailUrl,
    quantity,
    price,
    selected_size
  },
  customer-> { name, email }
}
`
