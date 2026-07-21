import React, { useState, useEffect } from 'react'
import styles from './CartPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { CartItemCard } from '../components/cart/CartItemCard'
import { OrderSummary } from '../components/cart/OrderSummary'
import { IconTrash } from '../components/Icons'
import { Link } from 'react-router-dom'
import { apiGetCart, apiUpdateCartItem, apiRemoveCartItem, apiClearCart, apiCreateOrder } from '../api'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CartPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutMsg, setCheckoutMsg] = useState('')

  const loadCart = () => {
    setLoading(true)
    apiGetCart()
      .then((items) => {
        setCartItems(items)
        setError(null)
      })
      .catch((err) => {
        if (err.message === 'Unauthenticated') {
          setError('Please sign in to view your shopping cart.')
        } else {
          setError('Could not load cart items.')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCart()
    } else {
      setLoading(false)
      setError('Please sign in to view your shopping cart.')
    }
  }, [isAuthenticated])

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/sign-in')
      return
    }
    setIsCheckingOut(true)
    setCheckoutMsg('')
    try {
      const order = await apiCreateOrder()
      await apiClearCart()
      setCartItems([])
      setCheckoutMsg(`Order ${order.orderCode} placed successfully! Redirecting to profile…`)
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (err) {
      setCheckoutMsg(err.message || 'Failed to place order. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const updateQuantity = async (id, delta) => {
    const item = cartItems.find((i) => i.id === id)
    if (!item) return
    const newQty = Math.max(1, item.quantity + delta)

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    )

    try {
      await apiUpdateCartItem(id, newQty)
    } catch (err) {
      console.error('Failed to update cart item quantity:', err)
      loadCart() // Revert on failure
    }
  }

  const deleteItem = async (id) => {
    // Optimistic UI update
    setCartItems((prev) => prev.filter((item) => item.id !== id))
    try {
      await apiRemoveCartItem(id)
    } catch (err) {
      console.error('Failed to delete cart item:', err)
      loadCart()
    }
  }

  const clearCart = async () => {
    setCartItems([])
    try {
      await apiClearCart()
    } catch (err) {
      console.error('Failed to clear cart:', err)
      loadCart()
    }
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const tax = subtotal > 0 ? Number((subtotal * 0.08).toFixed(2)) : 0

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
          Your Shopping Cart{' '}
          <span className={styles.itemCount}>
            ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
          </span>
        </h1>

        {checkoutMsg && (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto 20px',
            padding: '14px 20px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.9375rem',
            background: checkoutMsg.includes('successfully') ? '#e6f5f2' : '#fef2f2',
            color: checkoutMsg.includes('successfully') ? '#00685c' : '#991b1b',
            border: `1px solid ${checkoutMsg.includes('successfully') ? '#b2e2d8' : '#fecaca'}`
          }}>
            {checkoutMsg}
          </div>
        )}

        <div className={styles.contentLayout}>
          {/* Left Column (Items List) */}
          <div className={styles.itemsColumn}>
            {loading ? (
              <div className={styles.emptyCartCard}>
                <p className={styles.emptyCartText}>Loading your cart...</p>
              </div>
            ) : error ? (
              <div className={styles.emptyCartCard}>
                <p className={styles.emptyCartText}>{error}</p>
                {!isAuthenticated && (
                  <Link to="/sign-in" className={styles.btnContinueShopping} style={{ display: 'inline-block', marginTop: '12px' }}>
                    Sign In Now
                  </Link>
                )}
              </div>
            ) : cartItems.length === 0 ? (
              <div className={styles.emptyCartCard}>
                <p className={styles.emptyCartText}>Your cart is empty.</p>
                <Link to="/shop" className={styles.btnContinueShopping}>
                  Go to Shop
                </Link>
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
              onCheckout={handleCheckout}
              isCheckingOut={isCheckingOut}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

