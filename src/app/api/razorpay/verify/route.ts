import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { adminClient } from '../../../../sanity/adminClient'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: false,
    })
  }
} catch (e) {
  console.warn("Upstash Redis not configured. Rate limiting disabled for Razorpay Verify.")
}

export async function POST(req: NextRequest) {
  try {
    if (ratelimit) {
      const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
      const { success } = await ratelimit.limit(`razorpay-verify-${ip}`)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    }
    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sanityOrderId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !sanityOrderId) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 })
    }

    // Verify the Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch — mark as Failed
      await adminClient.patch(sanityOrderId).set({ paymentStatus: 'Failed' }).commit()
      return NextResponse.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 })
    }

    // Signature valid — mark as Paid
    await adminClient
      .patch(sanityOrderId)
      .set({
        paymentStatus: 'Paid',
        razorpayPaymentId: razorpay_payment_id,
      })
      .commit()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[RAZORPAY VERIFY ERROR]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
