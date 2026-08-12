'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { client } from '../../sanity/client'
import { MY_ORDERS_PAGINATED_QUERY } from '../../sanity/queries/orders_query'
import TopNavbar from '../../components/layout/TopNavbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'

interface OrderItem {
  productName: string
  thumbnailUrl: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  orderNumber: string
  orderStatus: string
  paymentMode: string
  paymentStatus: string
  total: number
  createdAt: string
  items: OrderItem[]
}

const STATUS_COLORS: Record<string, string> = {
  Placed: 'bg-blue-100 text-blue-700 border-blue-400',
  Packed: 'bg-yellow-100 text-yellow-700 border-yellow-400',
  Shipped: 'bg-purple-100 text-purple-700 border-purple-400',
  Delivered: 'bg-green-100 text-green-700 border-green-400',
  Cancelled: 'bg-red-100 text-red-700 border-red-400',
}

const STATUS_ICONS: Record<string, string> = {
  Placed: '📋', Packed: '📦', Shipped: '🚚', Delivered: '✅', Cancelled: '❌'
}

export default function MyOrdersPage() {
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/login?redirect=/orders')
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return
    setLoading(true)
    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE

    client.fetch<{orders: Order[], total: number}>(MY_ORDERS_PAGINATED_QUERY, { clerkUserId: user.id, start, end })
      .then(data => {
        setOrders(data?.orders || [])
        setTotalOrders(data?.total || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isLoaded, isSignedIn, user, page])

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="min-h-screen bg-[#fbfbf2] flex flex-col">
      <TopNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-14">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-6 h-6" />
          <h1 className="font-pixel text-xl md:text-3xl uppercase text-black tracking-widest">My Orders</h1>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] bg-white animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="border-4 border-black rounded-3xl p-12 shadow-[6px_6px_0px_#000] bg-white text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="font-pixel text-xl uppercase mb-3">No orders yet</h2>
            <p className="text-gray-500 mb-6">When you place an order, it'll show up here.</p>
            <Link href="/" className="inline-block bg-black text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-black shadow-[4px_4px_0px_#555] hover:shadow-[6px_6px_0px_#555] transition-all">
              Start Shopping 🧦
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => {
              const firstThree = order.items?.slice(0, 3) || []
              const extra = (order.items?.length || 0) - 3
              const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

              return (
                <Link href={`/orders/${order._id}`} key={order._id}
                  className="border-4 border-black rounded-3xl p-5 md:p-6 shadow-[6px_6px_0px_#000] bg-white hover:shadow-[8px_8px_0px_#000] transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-pixel text-sm text-black">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600 border-gray-400'}`}>
                        {STATUS_ICONS[order.orderStatus]} {order.orderStatus}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Item thumbnails */}
                  <div className="flex items-center gap-2 mb-4">
                    {firstThree.map((item, i) => (
                      <div key={i} className="w-14 h-14 border-2 border-black rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.thumbnailUrl
                          ? <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xl">🧦</div>}
                      </div>
                    ))}
                    {extra > 0 && (
                      <div className="w-14 h-14 border-2 border-black rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        +{extra}
                      </div>
                    )}
                    <div className="ml-2">
                      <p className="font-medium text-sm line-clamp-1">
                        {firstThree[0]?.productName}{order.items?.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium px-3 py-1 rounded-full border ${order.paymentMode === 'COD' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-green-50 border-green-300 text-green-700'}`}>
                      {order.paymentMode === 'COD' ? '💵 COD' : '💳 Online'}
                    </span>
                    <span className="font-pixel text-base">₹{order.total}</span>
                  </div>
                </Link>
              )
            })}

            {/* Pagination Controls */}
            {totalOrders > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between mt-6 bg-white p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border-2 border-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  ← Previous
                </button>
                <span className="font-pixel text-sm">
                  Page {page} of {Math.ceil(totalOrders / ITEMS_PER_PAGE)}
                </span>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(totalOrders / ITEMS_PER_PAGE)}
                  className="px-4 py-2 border-2 border-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
