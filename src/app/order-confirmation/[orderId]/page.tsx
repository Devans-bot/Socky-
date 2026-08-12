'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import TopNavbar from '../../../components/layout/TopNavbar'
import Footer from '../../../components/Footer'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const [confetti, setConfetti] = useState<{ id: number; x: number; emoji: string }[]>([])

  const mode = searchParams.get('mode')
  const orderNumber = searchParams.get('num')

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    // Launch confetti emojis
    const emojis = ['🧦', '🎉', '✨', '🎊', '⭐', '🔥']
    const items = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }))
    setConfetti(items)
    const t = setTimeout(() => setConfetti([]), 3500)
    return () => clearTimeout(t)
  }, [])

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="min-h-screen bg-[#fbfbf2] flex flex-col overflow-hidden">
      <TopNavbar />

      {/* Confetti */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {confetti.map(c => (
          <span key={c.id} className="absolute text-3xl animate-float-vanish"
            style={{ left: `${c.x}%`, top: '-10%', animationDuration: `${1.5 + Math.random() * 2}s`, animationDelay: `${Math.random() * 0.8}s` }}>
            {c.emoji}
          </span>
        ))}
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Success Card */}
          <div className="border-4 border-black rounded-3xl p-8 md:p-12 shadow-[10px_10px_0px_#000] bg-white text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_#555]">
                <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="font-pixel text-2xl md:text-3xl uppercase text-black mb-3 leading-tight">
              Order Placed! 🎉
            </h1>

            <p className="text-gray-600 font-medium mb-6">
              {mode === 'Online'
                ? 'Payment successful! Your order is confirmed and being processed.'
                : 'Your order is confirmed! Pay when it arrives at your doorstep.'}
            </p>

            {/* Order ID */}
            <div className="bg-[#fbfbf2] border-2 border-black rounded-2xl p-4 mb-6">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Order Number</p>
              <p className="font-pixel text-lg text-black">{orderNumber || orderId}</p>
            </div>

            {/* Payment badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm mb-8 ${mode === 'Online' ? 'border-green-500 text-green-700 bg-green-50' : 'border-blue-500 text-blue-700 bg-blue-50'}`}>
              <Package className="w-4 h-4" />
              {mode === 'Online' ? 'Payment Received ✓' : 'Cash on Delivery'}
            </div>

            {/* Info boxes */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: '📦', title: 'Processing', sub: 'Order being packed' },
                { icon: '🚚', title: '5–7 Days', sub: 'Estimated delivery' },
              ].map(item => (
                <div key={item.title} className="bg-[#fbfbf2] border-2 border-black rounded-2xl p-3">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Link href="/orders"
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-black shadow-[4px_4px_0px_#555] hover:shadow-[6px_6px_0px_#555] active:shadow-none transition-all flex items-center justify-center gap-2">
                <Package className="w-5 h-5" /> View My Orders <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/"
                className="w-full py-3 rounded-2xl font-bold uppercase tracking-widest text-sm border-2 border-black hover:bg-black hover:text-white transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
