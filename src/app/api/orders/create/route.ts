import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { adminClient } from '../../../../sanity/adminClient'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `SCK-${ts}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { items, deliveryAddress, paymentMode, idempotencyKey } = body

    if (!items?.length || !deliveryAddress || !paymentMode || !idempotencyKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate address
    const { fullName, line1, city, state, pincode, phone } = deliveryAddress
    if (!fullName || !line1 || !city || !state || !pincode || !phone) {
      return NextResponse.json({ error: 'Incomplete delivery address' }, { status: 400 })
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json({ error: 'Invalid pincode format' }, { status: 400 })
    }
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }

    // Check idempotency
    const existingOrder = await adminClient.fetch(
      `*[_type == "order" && clerkUserId == $userId && idempotencyKey == $idempotencyKey][0]`,
      { userId, idempotencyKey }
    )

    if (existingOrder) {
      let rzpOrderId = existingOrder.razorpayOrderId
      if (paymentMode === 'Online' && !rzpOrderId) {
        const razorpayOrder = await razorpay.orders.create({
          amount: existingOrder.total * 100,
          currency: 'INR',
          receipt: existingOrder._id,
          notes: { orderNumber: existingOrder.orderNumber, sanityOrderId: existingOrder._id },
        })
        rzpOrderId = razorpayOrder.id
        await adminClient.patch(existingOrder._id).set({ razorpayOrderId: rzpOrderId }).commit()
      }
      return NextResponse.json({
        success: true,
        orderId: existingOrder._id,
        orderNumber: existingOrder.orderNumber,
        razorpayOrderId: rzpOrderId,
        amount: existingOrder.total * 100,
        currency: 'INR',
      })
    }

    // Calculate totals
    const subtotal = items.reduce((acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity, 0)
    const shippingCharge = subtotal >= 999 ? 0 : 120
    const total = subtotal + shippingCharge

    const orderNumber = generateOrderNumber()

    // Find customer doc in Sanity
    const customerId = `customer-${userId}`

    // Build order items with snapshots
    const sanityItems = items.map((item: {
      id: string; name: string; price: number; quantity: number;
      image?: string; size?: string;
    }) => ({
      _type: 'orderItem',
      _key: item.id,
      product: { _type: 'reference', _ref: item.id },
      productName: item.name,
      thumbnailUrl: item.image || '',
      quantity: item.quantity,
      price: item.price,
      selected_size: item.size || '',
    }))

    // Create the order doc in Sanity
    const orderDoc = await adminClient.create({
      _type: 'order',
      orderNumber,
      clerkUserId: userId,
      customer: { _type: 'reference', _ref: customerId },
      items: sanityItems,
      subtotal,
      shippingCharge,
      total,
      paymentMode,
      paymentStatus: 'Pending',
      orderStatus: 'Placed',
      idempotencyKey,
      deliveryAddress,
      createdAt: new Date().toISOString(),
    })

    // If COD, return immediately
    if (paymentMode === 'COD') {
      return NextResponse.json({ success: true, orderId: orderDoc._id, orderNumber })
    }

    // If Online, create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100, // in paise
      currency: 'INR',
      receipt: orderDoc._id,
      notes: { orderNumber, sanityOrderId: orderDoc._id },
    })

    // Patch the Sanity order with the razorpay order ID
    await adminClient.patch(orderDoc._id).set({ razorpayOrderId: razorpayOrder.id }).commit()

    return NextResponse.json({
      success: true,
      orderId: orderDoc._id,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: total * 100,
      currency: 'INR',
    })
  } catch (err) {
    console.error('[CREATE ORDER ERROR]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
