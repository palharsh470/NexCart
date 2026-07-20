import React, { useState } from 'react'
import styles from './ProductsPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { ProductCard } from '../components/common/ProductCard'
import { FilterSidebar } from '../components/products/FilterSidebar'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState({
    electronics: true,
    accessories: false,
    apparel: false,
  })
  const [priceRange, setPriceRange] = useState(2500)
  const [selectedColor, setSelectedColor] = useState('darkgray')
  const [favorites, setFavorites] = useState({})

  const handleCategoryChange = (key, val) => {
    setSelectedCategory(prev => ({ ...prev, [key]: val }))
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const products = [
    {
      id: 1,
      name: 'Aura ANC Wireless Headphones',
      brand: 'Aura Acoustics',
      price: 299.00,
      originalPrice: 349.00,
      rating: 5,
      reviews: 124,
      badge: 'NEW',
      image: '/assets/headphones_hero.png',
    },
    {
      id: 2,
      name: 'K-Series Mechanical Deck',
      brand: 'NexGen Tech',
      price: 189.00,
      rating: 5,
      reviews: 86,
      image: '/assets/mechanical_keyboard.png',
    },
    {
      id: 3,
      name: 'Chronos Smart Watch S2',
      brand: 'Minimalist.',
      price: 449.00,
      originalPrice: 599.00,
      rating: 5,
      reviews: 342,
      badge: 'SALE',
      image: '/assets/nexwatch_watch.png',
    },
    {
      id: 4,
      name: 'Legacy Leather Messenger',
      brand: 'Urban Craft',
      price: 215.00,
      rating: 5,
      reviews: 42,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      name: 'ZenBook Titanium Ultra',
      brand: 'NexGen Tech',
      price: 1299.00,
      rating: 5,
      reviews: 312,
      image: '/assets/nexabook_laptop.png',
    },
    {
      id: 6,
      name: 'Aura Buds Pro 2',
      brand: 'Aura Acoustics',
      price: 249.00,
      rating: 5,
      reviews: 1024,
      image: '/assets/aura_buds.png',
    },
  ]

  return (
    <div className={styles.root}>
      <Navbar activeLink="Shop" cartCount={3} />

      <main className={styles.main}>
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Shop', path: '/shop' },
          ]}
        />

        <h1 className={styles.title}>Explore Premium Collections</h1>

        <div className={styles.contentLayout}>
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          <section className={styles.productsArea}>
            <div className={styles.topBar}>
              <span className={styles.resultsCount}>SHOWING 12 OF 248 RESULTS</span>
              <div className={styles.topBarActions}>
                <div className={styles.viewToggles}>
                  <button className={`${styles.viewBtn} ${styles.viewBtnActive}`} aria-label="Grid view">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </button>
                  <button className={styles.viewBtn} aria-label="List view">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                  </button>
                </div>

                <div className={styles.sortWrapper}>
                  <select className={styles.sortSelect} aria-label="Sort by">
                    <option value="popularity">Sort by: Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.productsGrid}>
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isFavorite={favorites[p.id]}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            <div className={styles.pagination}>
              <button className={styles.pageArrowBtn}>
                <span className={styles.arrowLeft}>←</span> Previous
              </button>
              <div className={styles.pageNumbers}>
                <button className={`${styles.pageNum} ${styles.pageNumActive}`}>1</button>
                <button className={styles.pageNum}>2</button>
                <button className={styles.pageNum}>3</button>
                <span className={styles.pageEllipsis}>...</span>
                <button className={styles.pageNum}>12</button>
              </div>
              <button className={styles.pageArrowBtn}>
                Next <span className={styles.arrowRight}>→</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
