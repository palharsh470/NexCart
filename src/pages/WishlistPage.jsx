import React, { useState } from 'react'
import styles from './WishlistPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { IconBag, IconRedTrash } from '../components/Icons'
import { Link } from 'react-router-dom'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Aura ANC Wireless',
      price: '$229.00',
      description: 'Flagship hybrid noise cancellation & high-definition acoustics.',
      image: '/assets/headphones_hero.png',
    },
    {
      id: 2,
      name: 'Titanium X Pro',
      price: '$349.00',
      description: 'Next-gen health monitoring with 7-day battery life.',
      image: '/assets/nexwatch_watch.png',
    },
    {
      id: 3,
      name: 'Nebula 14 Ultra',
      price: '$1,299.00',
      description: 'The ultimate productivity machine with OLED display.',
      badge: 'LIMITED EDITION',
      image: '/assets/nexabook_laptop.png',
    },
    {
      id: 4,
      name: 'Zenith Ergonomic',
      price: '$499.00',
      description: 'Sculpted for comfort during long working sessions.',
      image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=600&q=80',
    },
  ])

  const [cartCount, setCartCount] = useState(3)

  const recommendations = [
    {
      id: 101,
      name: 'Tactile Pro Keyboard',
      price: '$159.00',
      image: '/assets/mechanical_keyboard.png',
    },
    {
      id: 102,
      name: 'Lumina Desk Lamp',
      price: '$89.00',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 103,
      name: 'Ceramic Mug Set',
      price: '$45.00',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
    },
  ]

  const handleRemoveItem = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id))
  }

  const handleMoveToCart = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id))
    setCartCount(prev => prev + 1)
  }

  return (
    <div className={styles.root}>
      <Navbar activeAction="wishlist" activeLink="" cartCount={cartCount} wishlistCount={wishlistItems.length} />

      <main className={styles.main}>
        {/* Wishlist Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>Your Wishlist</h1>
          <p className={styles.subtitle}>
            You have <strong className={styles.highlightCount}>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</strong> saved for later.
          </p>
        </header>

        {/* Wishlist Items Grid */}
        {wishlistItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Your wishlist is empty.</p>
            <Link to="/shop" className={styles.btnExplore}>Explore Shop</Link>
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
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <IconRedTrash />
                  </button>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeaderRow}>
                    <h3 className={styles.productName}>{item.name}</h3>
                    <span className={styles.productPrice}>{item.price}</span>
                  </div>
                  <p className={styles.productDesc}>{item.description}</p>

                  <button
                    type="button"
                    className={styles.btnMoveToCart}
                    onClick={() => handleMoveToCart(item.id)}
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
            {recommendations.map((rec) => (
              <div key={rec.id} className={styles.recomCard}>
                <img src={rec.image} alt={rec.name} className={styles.recomImage} />
                <div className={styles.recomInfo}>
                  <h4 className={styles.recomName}>{rec.name}</h4>
                  <span className={styles.recomPrice}>{rec.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
