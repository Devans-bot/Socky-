'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useCartStore } from '../../lib/useCartStore'
import TopNavbar from '../../components/layout/TopNavbar'
import Footer from '../../components/Footer'
import { ShoppingBag, MapPin, CreditCard, Banknote, ChevronRight, Lock, Truck } from 'lucide-react'
import Link from 'next/link'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
  modal: { ondismiss: () => void }
}

interface AddressForm {
  fullName: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
  phone: string
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'
]

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()
  const { items, clearCart } = useCartStore()
  const [paymentMode, setPaymentMode] = useState<'Online' | 'COD'>('Online')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [address, setAddress] = useState<AddressForm>({
    fullName: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: ''
  })
  const [idempotencyKey] = useState(() => crypto.randomUUID())

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login?redirect=/checkout')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setAddress(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      }))
    }
  }, [isLoaded, isSignedIn, user])

  useEffect(() => {
    if (isLoaded && items.length === 0) {
      router.push('/')
    }
  }, [isLoaded, items, router])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingCharge = subtotal >= 999 ? 0 : 120
  const total = subtotal + shippingCharge

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id, name: i.name, price: i.price,
            quantity: i.quantity, image: i.image,
          })),
          deliveryAddress: address,
          paymentMode,
          idempotencyKey,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      if (paymentMode === 'COD') {
        clearCart()
        router.push(`/order-confirmation/${data.orderId}?mode=COD&num=${data.orderNumber}`)
        return
      }

      // Online payment — open Razorpay
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Failed to load payment gateway. Please try again.')

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: 'Socky 🧦',
        description: `Order #${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          // Verify payment server-side
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              sanityOrderId: data.orderId,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            clearCart()
            router.push(`/order-confirmation/${data.orderId}?mode=Online&num=${data.orderNumber}`)
          } else {
            setError('Payment verification failed. Please contact support.')
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.emailAddresses[0]?.emailAddress || '',
          contact: address.phone,
        },
        theme: { color: '#000000' },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
            setError('Payment cancelled. The order was marked as abandoned. Please try again.')
            fetch(`/api/orders/${data.orderId}/abandon`, { method: 'POST' }).catch(console.error)
          }
        }
      }

      new window.Razorpay(options).open()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="min-h-screen bg-[#fbfbf2] flex flex-col">
      <TopNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-14">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-5 h-5" />
          <h1 className="font-pixel text-xl md:text-3xl uppercase text-black tracking-widest">Secure Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

            {/* LEFT: Address + Payment */}
            <div className="flex flex-col gap-6">

              {/* Delivery Address */}
              <div className="border-4 border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_#000] bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-xl uppercase tracking-wide">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-gray-500">Full Name *</label>
                    <input name="fullName" value={address.fullName} onChange={handleAddressChange} required
                      className="w-full border-2 border-black rounded-2xl px-4 py-3 font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-gray-500">Address Line 1 *</label>
                    <input name="line1" value={address.line1} onChange={handleAddressChange} required placeholder="House/Flat No., Street"
                      className="w-full border-2 border-black rounded-2xl px-4 py-3 font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-gray-500">Address Line 2</label>
                    <input name="line2" value={address.line2} onChange={handleAddressChange} placeholder="Landmark, Area (optional)"
                      className="w-full border-2 border-black rounded-2xl px-4 py-3 font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-gray-500">City *</label>
                    <input name="city" value={address.city} onChange={handleAddressChange} required
                      className="w-full border-2 border-black rounded-2xl px-4 py-3 font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-gray-500">Pincode *</label>
                    <input name="pincode" value={address.pincode} onChange={handleAddressChange} required pattern="[0-9]{6}" maxLength={6}
                      className="w-full border-2 border-black rounded-2xl px-4 py-3 font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-gray-500">State *</label>
                    <select name="state" value={address.state} onChange={handleAddressChange} required
                      className="w-full border-2 border-black rounded-2xl px-4 py-3 font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-all bg-white">
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-gray-500">Phone Number *</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange} required type="tel" pattern="[6-9][0-9]{9}" maxLength={10}
                      placeholder="10-digit mobile number"
                      className="w-full border-2 border-black rounded-2xl px-4 py-3 font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-all" />
                  </div>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="border-4 border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_#000] bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-xl uppercase tracking-wide">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Online */}
                  <button type="button" onClick={() => setPaymentMode('Online')}
                    className={`relative flex flex-col items-start gap-2 p-5 rounded-2xl border-4 transition-all cursor-pointer text-left ${paymentMode === 'Online' ? 'border-black bg-black text-white shadow-[4px_4px_0px_#555]' : 'border-black bg-white hover:shadow-[4px_4px_0px_#000]'}`}>
                    {paymentMode === 'Online' && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <span className="w-3 h-3 rounded-full bg-black block" />
                      </span>
                    )}
                    <CreditCard className="w-7 h-7" />
                    <span className="font-black text-base uppercase tracking-wide">Pay Online</span>
                    <span className={`text-xs font-medium ${paymentMode === 'Online' ? 'text-gray-300' : 'text-gray-500'}`}>
                      UPI, Cards, Net Banking via Razorpay
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${paymentMode === 'Online' ? 'border-gray-400 text-gray-300' : 'border-green-500 text-green-600'}`}>
                      🔒 Secure
                    </span>
                  </button>

                  {/* COD */}
                  <button type="button" onClick={() => setPaymentMode('COD')}
                    className={`relative flex flex-col items-start gap-2 p-5 rounded-2xl border-4 transition-all cursor-pointer text-left ${paymentMode === 'COD' ? 'border-black bg-black text-white shadow-[4px_4px_0px_#555]' : 'border-black bg-white hover:shadow-[4px_4px_0px_#000]'}`}>
                    {paymentMode === 'COD' && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <span className="w-3 h-3 rounded-full bg-black block" />
                      </span>
                    )}
                    <Banknote className="w-7 h-7" />
                    <span className="font-black text-base uppercase tracking-wide">Cash on Delivery</span>
                    <span className={`text-xs font-medium ${paymentMode === 'COD' ? 'text-gray-300' : 'text-gray-500'}`}>
                      Pay when your order arrives
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${paymentMode === 'COD' ? 'border-gray-400 text-gray-300' : 'border-blue-500 text-blue-600'}`}>
                      No advance needed
                    </span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 text-red-700 font-medium text-sm">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* RIGHT: Order Summary */}
            <div className="flex flex-col gap-4">
              <div className="border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] bg-white sticky top-24">
                <div className="flex items-center gap-3 mb-5">
                  <ShoppingBag className="w-5 h-5" />
                  <h2 className="font-bold text-lg uppercase tracking-wide">Order Summary</h2>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-14 h-14 border-2 border-black rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-pixel text-[10px] leading-tight truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm flex-shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-t-2 border-black border-dashed mb-4" />

                {/* Totals */}
                <div className="flex flex-col gap-2 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shippingCharge === 0 ? 'text-green-600 font-bold' : ''}>
                      {shippingCharge === 0 ? 'FREE 🎉' : `₹${shippingCharge}`}
                    </span>
                  </div>
                  {shippingCharge > 0 && (
                    <p className="text-xs text-gray-400">Add ₹{999 - subtotal} more for free shipping</p>
                  )}
                </div>

                <hr className="border-t-2 border-black my-4" />

                <div className="flex justify-between font-pixel text-xl uppercase mb-6">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                {/* Submit */}
                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-base border-2 border-black shadow-[4px_4px_0px_#555] hover:shadow-[6px_6px_0px_#555] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <><span className="animate-spin">⏳</span> Processing...</>
                  ) : (
                    <>
                      {paymentMode === 'Online' ? <CreditCard className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
                      {paymentMode === 'Online' ? 'Pay Now' : 'Place Order'}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                  <Truck className="w-4 h-4" />
                  <span>Delivered in 5–7 business days</span>
                </div>

                <Link href="/" className="block text-center mt-3 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
