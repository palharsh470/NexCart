import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './ProductsPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { ProductCard } from '../components/common/ProductCard'
import { FilterSidebar } from '../components/products/FilterSidebar'
import { apiGetProducts, apiAddWishlistItem, apiRemoveWishlistItem } from '../api'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [selectedCategory, setSelectedCategory] = useState({
    electronics: false,
    accessories: false,
    apparel: false,
  })
  const [priceRange, setPriceRange] = useState(10000)
  const [selectedColor, setSelectedColor] = useState('darkgray')
  const [sortBy, setSortBy] = useState('popularity')
  const [favorites, setFavorites] = useState({})

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    apiGetProducts(currentPage)
      .then((res) => {
        if (!isMounted) return
        if (typeof res === 'object' && res.products) {
          setProducts(res.products)
          setTotalPages(res.totalPages || 1)
          setTotalCount(res.count || res.products.length)
          setError(null)
        } else if (Array.isArray(res)) {
          setProducts(res)
          setTotalPages(1)
          setTotalCount(res.length)
          setError(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load products:', err)
          setError('Could not load products. Please ensure backend is running.')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [currentPage])

  const handleCategoryChange = (key, val) => {
    setSelectedCategory((prev) => ({ ...prev, [key]: val }))
  }

  const toggleFavorite = async (id) => {
    const isFav = favorites[id]
    setFavorites((prev) => ({ ...prev, [id]: !isFav }))
    try {
      if (isFav) {
        await apiRemoveWishlistItem(id)
      } else {
        await apiAddWishlistItem(id)
      }
    } catch (err) {
      console.warn('Wishlist API update:', err)
    }
  }

  
  const filteredProducts = products.filter((p) => {
    if (p.price > priceRange) return false
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      const matchName = p.name.toLowerCase().includes(q)
      const matchCat = p.category.toLowerCase().includes(q)
      const matchDesc = p.description && p.description.toLowerCase().includes(q)
      if (!matchName && !matchCat && !matchDesc) return false
    }
    return true
  })

  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return a.id - b.id
  })

  return (
    <div className={styles.root}>
      <Navbar activeLink="Shop" />

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
              <span className={styles.resultsCount}>
                {loading
                  ? 'LOADING PRODUCTS…'
                  : `SHOWING PAGE ${currentPage} OF ${totalPages} (${totalCount || products.length} TOTAL RESULTS)`}
              </span>
              <div className={styles.topBarActions}>
                <div className={styles.sortWrapper}>
                  <select
                    className={styles.sortSelect}
                    aria-label="Sort by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularity">Sort by: Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '48px 0', textTransform: 'uppercase', color: '#6d7a76', letterSpacing: '0.05em' }}>
                Loading catalog items…
              </div>
            ) : error ? (
              <div style={{ padding: '36px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#991b1b', margin: '20px 0' }}>
                {error}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div style={{ padding: '48px 0', color: '#6d7a76' }}>
                No products found matching the criteria.
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {sortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isFavorite={favorites[p.id]}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}

            {!loading && sortedProducts.length > 0 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageArrowBtn}
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  style={{ opacity: currentPage <= 1 ? 0.5 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  <span className={styles.arrowLeft}>←</span> Previous
                </button>

                <div className={styles.pageNumbers}>
                  {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`${styles.pageNum} ${currentPage === pageNum ? styles.pageNumActive : ''}`}
                      onClick={() => {
                        setCurrentPage(pageNum)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className={styles.pageArrowBtn}
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  style={{ opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next <span className={styles.arrowRight}>→</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

