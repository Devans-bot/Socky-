# Socky - E-commerce Storefront

Socky is a modern, full-featured e-commerce platform dedicated to selling socks. Built with a premium aesthetic and rich interactions, the application provides a seamless customer journey from browsing the product catalog to a complete checkout experience. It features robust user authentication, a sliding cart, and secure online payments via Razorpay (along with Cash on Delivery).

## Tech Stack

This project is built using a modern React ecosystem:
- **Framework:** Next.js (App Router)
- **Language:** TypeScript, React 19, Node.js
- **Styling:** Tailwind CSS (v4), PostCSS, styled-components
- **State Management:** Zustand
- **Content Management (CMS):** Sanity
- **Authentication:** Clerk
- **Payment Gateway:** Razorpay
- **Animations & UI:** GSAP, Embla Carousel React, Lucide React Icons

## Features

### Customer-Facing
- **Authentication:** Secure Login and Sign Up flows powered by Clerk.
- **Home & Browsing:** Dynamic home page featuring promotional carousels, new arrivals, product tickers, and user reviews.
- **Product Catalog:** Comprehensive product listing with search functionality and rich filtering.
- **Product Details:** Detailed product pages featuring interactive image galleries, size selectors, and Add to Cart functionality.
- **Shopping Cart:** An interactive, slide-out cart drawer for easy order management.
- **Checkout Flow:** A dedicated checkout page capturing delivery addresses and offering payment method selection (Online via Razorpay or Cash on Delivery).
- **Order Confirmation:** Engaging success screens with order summaries and confetti animations.
- **My Orders:** A gated dashboard for authenticated users to view their past orders.
- **Order Tracking:** Detailed order views for customers showcasing a status timeline (Placed -> Packed -> Shipped -> Delivered) and live tracking links.

### Backend & API
- **Order Processing:** Secure API routes (`/api/orders/create`) that construct Sanity order documents and initiate Razorpay checkout sessions.
- **Payment Verification:** Server-side HMAC-SHA256 signature validation (`/api/razorpay/verify`) to securely confirm payments and update Sanity records.
- **User Sync:** Clerk webhook listeners (`/api/webhooks/clerk`) that automatically mirror authenticated users into Sanity's customer database.

## Data Model (Sanity Schemas)

The application uses Sanity as its backend database, with the following core document types implemented:

- **`product`**: Defines the catalog items including name, slug, description, price, sale price, color schema, available sizes, material, stock levels, ratings, and image assets.
- **`category`**: Defines taxonomic groupings for products.
- **`customer`**: Stores user profiles synced from Clerk, including clerkId, email, name, and avatar URL.
- **`order`**: The central record of a purchase. It contains the order number, customer references, subtotal/total calculations, payment mode (Online/COD), payment status, order status (Placed, Packed, Shipped, Delivered, Cancelled), Razorpay transaction IDs, tracking links, and full delivery address details.
- **`orderItem`**: Represents individual line items within an order, capturing the specific product reference, selected size, quantity, and snapshot price.
- **`shipping`**: Stores shipping configurations and rates.

## Integrations

- **Clerk:** Handles all user identity, authentication, session management, and secures protected routes (like checkout and order history).
- **Sanity:** Serves as the headless CMS and primary database, housing all product data, user profiles, and order records.
- **Razorpay:** The integrated payment gateway responsible for securely processing online transactions and returning verifiable payment signatures.
