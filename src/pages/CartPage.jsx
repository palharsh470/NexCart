import React, { useState } from 'react'
import styles from './CartPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { CartItemCard } from '../components/cart/CartItemCard'
import { OrderSummary } from '../components/cart/OrderSummary'
import { IconTrash } from '../components/Icons'
import { Link } from 'react-router-dom'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Aura ANC Wireless Headphones',
      variant: 'Obsidian Black',
      extra: 'Warranty: 1 Year',
      price: 229.00,
      originalPrice: 249.00,
      quantity: 1,
      image: '/assets/headphones_hero.png',
    },
    {
      id: 2,
      name: 'Modernist Chrono XL',
      variant: 'Tan Leather',
      extra: 'Size: 42mm',
      price: 185.00,
      quantity: 1,
      image: '/assets/nexwatch_watch.png',
    },
  ])

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    )
  }

  const deleteItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const tax = subtotal > 0 ? 32.12 : 0

  return (
    <div className={styles.root}>
      <Navbar activeLink="Shop" cartCount={totalItemsCount} />

      <main className={styles.main}>
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Shopping Cart', path: '/cart' },
          ]}
        />

        <h1 className={styles.title}>
          Your Shopping Cart <span className={styles.itemCount}>({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</span>
        </h1>

        <div className={styles.contentLayout}>
          {/* Left Column (Items List) */}
          <div className={styles.itemsColumn}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyCartCard}>
                <p className={styles.emptyCartText}>Your cart is empty.</p>
                <Link to="/shop" className={styles.btnContinueShopping}>Go to Shop</Link>
              </div>
            ) : (
              <>
                <div className={styles.itemsList}>
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onDelete={deleteItem}
                    />
                  ))}
                </div>

                <div className={styles.cartActions}>
                  <Link to="/shop" className={styles.backLink}>
                    <span className={styles.arrowBack}>←</span> Continue Shopping
                  </Link>
                  <button type="button" className={styles.clearBtn} onClick={clearCart}>
                    <IconTrash /> Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Column (Order Summary Card) */}
          <aside className={styles.summaryColumn}>
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              isCartEmpty={cartItems.length === 0}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
