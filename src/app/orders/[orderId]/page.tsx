'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { client } from '../../../sanity/client'
import { ORDER_DETAIL_QUERY } from '../../../sanity/queries/orders_query'
import TopNavbar from '../../../components/layout/TopNavbar'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, MapPin, Package } from 'lucide-react'

interface OrderDetail {
  _id: string
  orderNumber: string
  orderStatus: string
  paymentMode: string
  paymentStatus: string
  subtotal: number
  shippingCharge: number
  total: number
  createdAt: string
  trackingLink?: string
  razorpayPaymentId?: string
  deliveryAddress: {
    fullName: string; line1: string; line2?: string;
    city: string; state: string; pincode: string; phone: string;
  }
  items: {
    productName: string; thumbnailUrl: string; quantity: number;
    price: number; selected_size?: string;
  }[]
}

const STATUSES = ['Placed', 'Packed', 'Shipped', 'Delivered']

const STATUS_ICONS: Record<string, string> = {
  Placed: '📋', Packed: '📦', Shipped: '🚚', Delivered: '✅', Cancelled: '❌'
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/login?redirect=/orders')
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || !orderId) return
    client.fetch<OrderDetail>(ORDER_DETAIL_QUERY, { orderId, clerkUserId: user.id })
      .then(data => {
        if (!data) setNotFound(true)
        else setOrder(data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [isLoaded, isSignedIn, user, orderId])

  if (!isLoaded || !isSignedIn) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbf2] flex flex-col">
        <TopNavbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
          <div className="animate-pulse flex flex-col gap-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-48 bg-gray-100 rounded-3xl border-4 border-gray-200" />
            <div className="h-48 bg-gray-100 rounded-3xl border-4 border-gray-200" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#fbfbf2] flex flex-col">
        <TopNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-pixel text-xl uppercase mb-2">Order not found</h2>
            <Link href="/orders" className="text-sm underline font-medium">← Back to My Orders</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isCancelled = order.orderStatus === 'Cancelled'
  const currentStep = isCancelled ? -1 : STATUSES.indexOf(order.orderStatus)
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#fbfbf2] flex flex-col">
      <TopNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 md:py-14">
        {/* Back */}
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all mb-6 text-gray-600 hover:text-black">
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-pixel text-lg md:text-2xl uppercase text-black">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">{date}</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm ${isCancelled ? 'bg-red-50 border-red-400 text-red-700' : 'bg-green-50 border-green-400 text-green-700'}`}>
            {STATUS_ICONS[order.orderStatus]} {order.orderStatus}
          </div>
        </div>

        <div className="flex flex-col gap-6">

          {/* Status Timeline */}
          {!isCancelled ? (
            <div className="border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] bg-white">
              <h2 className="font-bold text-base uppercase tracking-wide mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" /> Order Timeline
              </h2>
              <div className="flex items-center">
                {STATUSES.map((status, idx) => {
                  const done = idx <= currentStep
                  const active = idx === currentStep
                  return (
                    <div key={status} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center text-lg font-bold transition-all
                          ${done ? 'border-black bg-black text-white' : 'border-gray-300 bg-gray-100 text-gray-400'}
                          ${active ? 'ring-4 ring-black/20 scale-110' : ''}`}>
                          {STATUS_ICONS[status]}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider text-center ${done ? 'text-black' : 'text-gray-400'}`}>
                          {status}
                        </span>
                      </div>
                      {idx < STATUSES.length - 1 && (
                        <div className={`h-1 flex-1 mx-1 rounded ${idx < currentStep ? 'bg-black' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="border-4 border-red-400 rounded-3xl p-6 shadow-[6px_6px_0px_#000] bg-red-50 text-red-700 font-bold text-center">
              ❌ This order has been cancelled
            </div>
          )}

          {/* Tracking & Shipping Status */}
          {!isCancelled && (
            order.trackingLink ? (
              <div className="border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_#000] bg-[#e8f5e9]">
                <p className="font-black uppercase tracking-widest text-xs text-gray-600 mb-2">📍 Tracking Available</p>
                <a href={order.trackingLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-green-700 hover:underline underline-offset-4">
                  Track Your Package <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') ? (
              <div className="border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_#000] bg-yellow-50">
                <p className="font-black uppercase tracking-widest text-xs text-gray-600 mb-2">📍 Tracking Details</p>
                <p className="font-bold text-yellow-800 text-sm">
                  Tracking data will be available soon.
                </p>
              </div>
            ) : (
              <div className="border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_#000] bg-blue-50">
                <p className="font-black uppercase tracking-widest text-xs text-gray-600 mb-2">🚚 Shipping Status</p>
                <p className="font-bold text-blue-800 text-sm">
                  Order is being prepared. Shipping details will be provided once shipped.
                </p>
              </div>
            )
          )}

          {/* Items */}
          <div className="border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] bg-white">
            <h2 className="font-bold text-base uppercase tracking-wide mb-4">Items Ordered</h2>
            <div className="flex flex-col gap-4">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border-2 border-black rounded-2xl">
                  <div className="w-16 h-16 border-2 border-black rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.thumbnailUrl
                      ? <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🧦</div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.productName}</p>
                    {item.selected_size && <p className="text-xs text-gray-500">Size: {item.selected_size}</p>}
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <hr className="border-t-2 border-black border-dashed my-4" />

            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span>
              </div>
            </div>
            <div className="flex justify-between font-pixel text-xl uppercase mt-3">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] bg-white">
            <h2 className="font-bold text-base uppercase tracking-wide mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Delivery Address
            </h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-bold text-black">{order.deliveryAddress?.fullName}</p>
              <p>{order.deliveryAddress?.line1}</p>
              {order.deliveryAddress?.line2 && <p>{order.deliveryAddress.line2}</p>}
              <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} – {order.deliveryAddress?.pincode}</p>
              <p className="mt-1 font-medium">📞 {order.deliveryAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] bg-white">
            <h2 className="font-bold text-base uppercase tracking-wide mb-4">Payment Info</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode</span>
                <span className="font-bold">{order.paymentMode === 'COD' ? '💵 Cash on Delivery' : '💳 Online (Razorpay)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="font-mono text-xs">{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
