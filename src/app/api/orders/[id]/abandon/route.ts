import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { adminClient } from '../../../../../sanity/adminClient'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Verify the order belongs to this user before abandoning
    const order = await adminClient.fetch(`*[_type == "order" && _id == $id && clerkUserId == $clerkUserId][0]`, {
      id,
      clerkUserId: userId
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 })
    }

    if (order.paymentStatus !== 'Pending') {
      return NextResponse.json({ error: 'Order is not pending' }, { status: 400 })
    }

    await adminClient
      .patch(id)
      .set({ paymentStatus: 'Abandoned' })
      .commit()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ABANDON ORDER ERROR]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
