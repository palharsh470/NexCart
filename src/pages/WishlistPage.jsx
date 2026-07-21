import React, { useState, useEffect } from 'react'
import styles from './WishlistPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { IconBag, IconRedTrash } from '../components/Icons'
import { Link } from 'react-router-dom'
import {
  apiGetWishlist,
  apiRemoveWishlistItem,
  apiMoveToCart,
  apiGetFeaturedProducts,
} from '../api'
import { useAuth } from '../AuthContext'

export default function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionMsg, setActionMsg] = useState('')

  const loadWishlist = () => {
    setLoading(true)
    apiGetWishlist()
      .then((items) => {
        setWishlistItems(items)
        setError(null)
      })
      .catch((err) => {
        if (err.message === 'Unauthenticated') {
          setError('Please sign in to view your saved wishlist.')
        } else {
          setError('Could not load wishlist items.')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist()
    } else {
      setLoading(false)
      setError('Please sign in to view your saved wishlist.')
    }

    // Load recommendations
    apiGetFeaturedProducts()
      .then((feat) => {
        if (feat && feat.length > 0) {
          setRecommendations(
            feat.map((p) => ({
              id: p.id,
              name: p.name,
              price: `$${p.price.toFixed(2)}`,
              image: p.image,
            }))
          )
        }
      })
      .catch(() => {})
  }, [isAuthenticated])

  const handleRemoveItem = async (productId) => {
    // Optimistic UI update
    setWishlistItems((prev) => prev.filter((item) => item.productId !== productId && item.id !== productId))
    try {
      await apiRemoveWishlistItem(productId)
    } catch (err) {
      console.error('Failed to remove item from wishlist:', err)
      loadWishlist()
    }
  }

  const handleMoveToCart = async (productId) => {
    setActionMsg('')
    // Optimistic UI update
    setWishlistItems((prev) => prev.filter((item) => item.productId !== productId && item.id !== productId))
    try {
      await apiMoveToCart(productId)
      setActionMsg('Item moved to cart successfully!')
      setTimeout(() => setActionMsg(''), 3000)
    } catch (err) {
      console.error('Failed to move item to cart:', err)
      setActionMsg(err.message || 'Could not move item to cart.')
      loadWishlist()
    }
  }

  return (
    <div className={styles.root}>
      <Navbar activeAction="wishlist" activeLink="" wishlistCount={wishlistItems.length} />

      <main className={styles.main}>
        {/* Wishlist Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>Your Wishlist</h1>
          <p className={styles.subtitle}>
            You have{' '}
            <strong className={styles.highlightCount}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </strong>{' '}
            saved for later.
          </p>
        </header>

        {actionMsg && (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto 20px',
            padding: '12px 18px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.9375rem',
            background: actionMsg.includes('successfully') ? '#e6f5f2' : '#fef2f2',
            color: actionMsg.includes('successfully') ? '#00685c' : '#991b1b',
            border: `1px solid ${actionMsg.includes('successfully') ? '#b2e2d8' : '#fecaca'}`
          }}>
            {actionMsg}
          </div>
        )}

        {/* Wishlist Items Grid */}
        {loading ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Loading your wishlist…</p>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>{error}</p>
            {!isAuthenticated && (
              <Link to="/sign-in" className={styles.btnExplore} style={{ marginTop: '12px' }}>
                Sign In Now
              </Link>
            )}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Your wishlist is empty.</p>
            <Link to="/shop" className={styles.btnExplore}>
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlistItems.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {item.badge && <span className={styles.badge}>{item.badge}</span>}
                  <img src={item.image} alt={item.name} className={styles.image} />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemoveItem(item.productId)}
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <IconRedTrash />
                  </button>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeaderRow}>
                    <h3 className={styles.productName}>
                      <Link to={`/product/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {item.name}
                      </Link>
                    </h3>
                    <span className={styles.productPrice}>{item.price}</span>
                  </div>
                  <p className={styles.productDesc}>{item.description}</p>

                  <button
                    type="button"
                    className={styles.btnMoveToCart}
                    onClick={() => handleMoveToCart(item.productId)}
                  >
                    <IconBag /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Divider */}
        <hr className={styles.divider} />

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section className={styles.recommendationsSection}>
            <div className={styles.recomHeader}>
              <div>
                <span className={styles.eyebrow}>WAIT, THERE'S MORE</span>
                <h2 className={styles.recomTitle}>You May Also Like</h2>
              </div>
              <Link to="/shop" className={styles.viewAllLink}>
                View All Recommendations <span className={styles.arrow}>→</span>
              </Link>
            </div>

            <div className={styles.recomGrid}>
              {recommendations.slice(0, 3).map((rec) => (
                <Link to={`/product/${rec.id}`} key={rec.id} className={styles.recomCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={rec.image} alt={rec.name} className={styles.recomImage} />
                  <div className={styles.recomInfo}>
                    <h4 className={styles.recomName}>{rec.name}</h4>
                    <span className={styles.recomPrice}>{rec.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

